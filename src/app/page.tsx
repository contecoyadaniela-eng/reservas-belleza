import { checkSupabaseConnection } from "@/lib/supabase/check-connection";

// Check the connection on every visit instead of once at build time.
export const dynamic = "force-dynamic";

export default async function Home() {
  const status = await checkSupabaseConnection();

  return (
    <main className="flex flex-1 items-center justify-center bg-rose-50 px-4 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
        <div className="text-5xl">💅</div>
        <h1 className="mt-4 text-2xl font-semibold text-stone-800">
          Reservas de belleza
        </h1>
        <p className="mt-2 text-stone-600">
          Reserva tu cita en segundos y acumula sellos de fidelidad.
        </p>
        <p className="mt-6 text-sm text-stone-500">Muy pronto disponible.</p>

        <div
          className={`mt-8 rounded-2xl px-4 py-3 text-sm ${
            status.ok ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"
          }`}
        >
          {status.ok
            ? "Conexión con la base de datos: ✅"
            : `Conexión con la base de datos: ❌ ${status.reason}`}
        </div>
      </div>
    </main>
  );
}
