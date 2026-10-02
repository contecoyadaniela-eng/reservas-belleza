import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { salir } from "@/app/(auth)/actions";
import { Card } from "@/components/ui";
import { CrearNegocioForm } from "./crear-negocio-form";

export default async function PanelPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/ingresar");

  // Row level security limits both queries to the user's own business.
  const { data: negocios } = await supabase.from("negocios").select("id, nombre, slug");
  const { data: equipo } = await supabase
    .from("equipo_usuarios")
    .select("id, nombre, correo, rol, negocio_id");

  const negocio = negocios?.[0];

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-500">Hola, {userData.user.user_metadata?.nombre ?? "dueña"}</p>
          <h1 className="text-2xl font-semibold text-neutral-800">
            {negocio ? negocio.nombre : "Crea tu negocio"}
          </h1>
        </div>
        <form action={salir}>
          <button className="whitespace-nowrap border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:border-neutral-900 hover:text-neutral-900">
            Cerrar sesión
          </button>
        </form>
      </div>

      {!negocio ? (
        <>
          <p className="mt-2 text-sm text-neutral-600">
            Elige el nombre de tu negocio y la dirección de tu página de reservas.
          </p>
          <CrearNegocioForm />
        </>
      ) : (
        <div className="mt-6 space-y-6">
          <div className="bg-neutral-100 p-4">
            <p className="text-sm text-neutral-600">Tu página pública de reservas:</p>
            <Link
              href={`/${negocio.slug}`}
              className="mt-1 block break-all font-medium text-neutral-900 underline hover:underline"
            >
              reservas-belleza.vercel.app/{negocio.slug}
            </Link>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-neutral-700">Tu equipo</h2>
            <ul className="mt-2 space-y-1 text-sm text-neutral-600">
              {equipo?.map((m) => (
                <li key={m.id}>
                  {m.nombre} · {m.correo} · {m.rol === "duena" ? "Dueña" : "Profesional"}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-dashed border-neutral-200 p-4 text-sm text-neutral-600">
            <p className="font-semibold text-neutral-700">Prueba de privacidad</p>
            <p className="mt-1">
              Negocios que esta cuenta puede ver en la base de datos:{" "}
              <strong>{negocios?.length ?? 0}</strong>
            </p>
            <p>
              Personas del equipo que puede ver: <strong>{equipo?.length ?? 0}</strong>
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
