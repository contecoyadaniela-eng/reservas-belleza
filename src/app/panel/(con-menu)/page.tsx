import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { cargarMiNegocio } from "@/lib/panel";
import { Caja } from "@/components/ui";
import { CrearNegocioForm } from "../crear-negocio-form";

export default async function PanelPage() {
  const { user, negocio } = await cargarMiNegocio();

  if (!negocio) {
    return (
      <div className="mx-auto max-w-md">
        <Caja>
          <p className="text-sm text-neutral-500">Hola, {user.user_metadata?.nombre ?? "dueña"}</p>
          <h1 className="text-2xl font-semibold">Crea tu negocio</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Elige el nombre de tu negocio y la dirección de tu página de reservas.
          </p>
          <CrearNegocioForm />
        </Caja>
      </div>
    );
  }

  // Row level security limits both queries to the user's own business.
  const supabase = await createClient();
  const { data: negocios } = await supabase.from("negocios").select("id");
  const { data: equipo } = await supabase.from("equipo_usuarios").select("id, nombre, correo, rol");

  const accesos = [
    { href: "/panel/pagina", titulo: "Mi página", texto: "Textos, letras, colores y fotos de tu página." },
    { href: "/panel/servicios", titulo: "Servicios", texto: `${negocio.servicios.length} servicio(s) publicados, precios y moneda.` },
    { href: "/panel/contacto", titulo: "Contacto", texto: "Dirección, horario, WhatsApp, correo e Instagram." },
  ];

  return (
    <div className="space-y-6">
      <Caja>
        <p className="text-sm text-neutral-500">Hola, {user.user_metadata?.nombre ?? "dueña"}</p>
        <h1 className="text-2xl font-semibold">{negocio.nombre}</h1>
        <p className="mt-4 text-sm text-neutral-600">Tu página pública de reservas:</p>
        <Link href={`/${negocio.slug}`} target="_blank" className="mt-1 block break-all font-medium underline">
          reservas-belleza.vercel.app/{negocio.slug}
        </Link>
      </Caja>

      <div className="grid gap-6 md:grid-cols-3">
        {accesos.map((a) => (
          <Link key={a.href} href={a.href} className="group bg-white p-6 hover:outline hover:outline-neutral-900">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">{a.titulo} →</p>
            <p className="mt-2 text-sm text-neutral-600">{a.texto}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Caja titulo="Tu equipo">
          <ul className="space-y-1 text-sm text-neutral-600">
            {equipo?.map((m) => (
              <li key={m.id}>
                {m.nombre} · {m.correo} · {m.rol === "duena" ? "Dueña" : "Profesional"}
              </li>
            ))}
          </ul>
        </Caja>
        <Caja titulo="Prueba de privacidad">
          <p className="text-sm text-neutral-600">
            Negocios que esta cuenta puede ver en la base de datos: <strong>{negocios?.length ?? 0}</strong>
          </p>
          <p className="text-sm text-neutral-600">
            Personas del equipo que puede ver: <strong>{equipo?.length ?? 0}</strong>
          </p>
        </Caja>
      </div>
    </div>
  );
}
