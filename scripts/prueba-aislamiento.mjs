// Prueba de privacidad: crea dos negocios de prueba dentro de una transacción,
// comprueba que ninguno ve los datos del otro y deshace todo al final.
// Uso: npm run prueba:aislamiento
import pg from "pg";
import { randomUUID } from "node:crypto";

const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
await db.connect();

const results = [];
const check = (name, ok, detail = "") => results.push({ name, ok, detail });

async function as(user, fn) {
  await db.query("reset role");
  if (user) {
    const claims = JSON.stringify({ sub: user.id, email: user.email, role: "authenticated" });
    await db.query("select set_config('request.jwt.claims', $1, true)", [claims]);
    await db.query("set local role authenticated");
  } else {
    await db.query("select set_config('request.jwt.claims', '{\"role\":\"anon\"}', true)");
    await db.query("set local role anon");
  }
  try {
    return await fn();
  } finally {
    await db.query("reset role");
  }
}

const tag = Date.now().toString(36);
const ana = { id: randomUUID(), email: `prueba-a-${tag}@ejemplo.test`, slug: `prueba-a-${tag}` };
const bea = { id: randomUUID(), email: `prueba-b-${tag}@ejemplo.test`, slug: `prueba-b-${tag}` };

try {
  await db.query("begin");

  for (const u of [ana, bea]) {
    await db.query(
      "insert into auth.users (id, email, aud, role) values ($1, $2, 'authenticated', 'authenticated')",
      [u.id, u.email],
    );
    await as(u, () =>
      db.query("select public.crear_negocio($1, $2, $3)", [`Negocio ${u.slug}`, u.slug, "Prueba"]),
    );
    const { rows } = await db.query("select id from public.negocios where slug = $1", [u.slug]);
    u.negocioId = rows[0].id;
  }

  for (const [yo, otra, nombre] of [[ana, bea, "A"], [bea, ana, "B"]]) {
    await as(yo, async () => {
      const negocios = await db.query("select slug from public.negocios");
      check(
        `El negocio ${nombre} solo ve su propio negocio`,
        negocios.rows.length === 1 && negocios.rows[0].slug === yo.slug,
        `ve ${negocios.rows.length}`,
      );

      const equipo = await db.query("select correo from public.equipo_usuarios");
      check(
        `El negocio ${nombre} solo ve su propio equipo`,
        equipo.rows.length === 1 && equipo.rows[0].correo === yo.email,
        `ve ${equipo.rows.length}`,
      );

      const cambio = await db.query(
        "update public.negocios set nombre = 'hackeado' where slug = $1",
        [otra.slug],
      );
      check(`El negocio ${nombre} no puede cambiar el otro negocio`, cambio.rowCount === 0);

      const propio = await db.query(
        "update public.negocios set pagina = '{\"anuncio\":{\"texto\":\"hola\"}}', moneda = 'PEN' where slug = $1",
        [yo.slug],
      );
      check(`El negocio ${nombre} sí puede editar su propia página`, propio.rowCount === 1);

      await db.query("savepoint slug");
      try {
        await db.query("update public.negocios set slug = 'otro-slug' where slug = $1", [yo.slug]);
        check(`El negocio ${nombre} no puede cambiar su dirección web`, false);
      } catch {
        await db.query("rollback to savepoint slug");
        check(`El negocio ${nombre} no puede cambiar su dirección web`, true);
      }

      await db.query(
        "insert into public.servicios (negocio_id, nombre, duracion_min, precio) select id, 'Servicio ' || $1, 60, 1000 from public.negocios where slug = $1",
        [yo.slug],
      );
      const misServicios = await db.query("select count(*)::int as n from public.servicios s join public.negocios n on n.id = s.negocio_id where n.slug = $1", [yo.slug]);
      check(`El negocio ${nombre} sí puede crear sus servicios`, misServicios.rows[0].n === 1);

      await db.query("savepoint servicio_ajeno");
      try {
        await db.query(
          "insert into public.servicios (negocio_id, nombre, duracion_min) values ($1, 'intruso', 30)",
          [otra.negocioId],
        );
        check(`El negocio ${nombre} no puede crear servicios en el otro negocio`, false);
      } catch {
        await db.query("rollback to savepoint servicio_ajeno");
        check(`El negocio ${nombre} no puede crear servicios en el otro negocio`, true);
      }

      const fotoPropia = await db.query("select public.es_duena_carpeta($1) as ok", [yo.negocioId]);
      const fotoAjena = await db.query("select public.es_duena_carpeta($1) as ok", [otra.negocioId]);
      check(
        `El negocio ${nombre} solo puede subir fotos a su propia carpeta`,
        fotoPropia.rows[0].ok === true && fotoAjena.rows[0].ok === false,
      );
    });
  }

  // B tries to edit and delete A's service.
  await as(bea, async () => {
    const editar = await db.query(
      "update public.servicios set precio = 1 where negocio_id = $1",
      [ana.negocioId],
    );
    const borrar = await db.query("delete from public.servicios where negocio_id = $1", [ana.negocioId]);
    check("Un negocio no puede editar ni borrar servicios de otro", editar.rowCount === 0 && borrar.rowCount === 0);
  });

  await as(null, async () => {
    try {
      await db.query("savepoint anon_read");
      await db.query("select * from public.negocios");
      check("Un visitante sin cuenta no puede leer la tabla de negocios", false);
    } catch {
      await db.query("rollback to savepoint anon_read");
      check("Un visitante sin cuenta no puede leer la tabla de negocios", true);
    }
    const publico = await db.query("select * from public.negocio_publico($1)", [ana.slug]);
    check(
      "Un visitante sin cuenta sí ve la página pública, sin datos del equipo",
      publico.rows.length === 1 && !("user_id" in publico.rows[0]) && publico.rows[0].moneda === "PEN",
    );

    const servicios = await db.query("select count(*)::int as n from public.servicios where negocio_id = $1", [ana.negocioId]);
    check("Un visitante sin cuenta sí ve los servicios publicados", servicios.rows[0].n === 1);

    await db.query("savepoint anon_insert");
    try {
      await db.query("insert into public.servicios (negocio_id, nombre, duracion_min) values ($1, 'spam', 30)", [ana.negocioId]);
      check("Un visitante sin cuenta no puede crear servicios", false);
    } catch {
      await db.query("rollback to savepoint anon_insert");
      check("Un visitante sin cuenta no puede crear servicios", true);
    }
  });
} finally {
  await db.query("rollback");
  await db.end();
}

for (const r of results) {
  console.log(`${r.ok ? "✅" : "❌"} ${r.name}${r.ok || !r.detail ? "" : ` (${r.detail})`}`);
}
const failed = results.filter((r) => !r.ok).length;
console.log(failed ? `\n${failed} prueba(s) fallaron.` : "\nTodas las pruebas pasaron. Los datos de prueba se borraron.");
process.exit(failed ? 1 : 0);
