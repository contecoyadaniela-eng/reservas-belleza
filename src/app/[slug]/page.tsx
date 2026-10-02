import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function NegocioPublicoPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.rpc("negocio_publico", { p_slug: slug });
  const negocio = data?.[0];
  if (!negocio) notFound();

  return (
    <main className="flex flex-1 items-center justify-center bg-rose-50 px-4 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
        <div className="text-5xl">💅</div>
        <h1 className="mt-4 text-2xl font-semibold text-stone-800">{negocio.nombre}</h1>
        <p className="mt-2 text-stone-600">Muy pronto podrás reservar tu cita aquí.</p>
      </div>
    </main>
  );
}
