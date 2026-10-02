export type ConnectionStatus =
  | { ok: true }
  | { ok: false; reason: string };

// Pings Supabase Auth's health endpoint using the public key.
// A 200 means both the project URL and the key are valid.
export async function checkSupabaseConnection(): Promise<ConnectionStatus> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return { ok: false, reason: "Faltan las claves de Supabase en el archivo .env.local" };
  }

  try {
    const res = await fetch(`${url}/auth/v1/health`, {
      headers: { apikey: key },
      cache: "no-store",
    });
    if (res.ok) return { ok: true };
    if (res.status === 401 || res.status === 403) {
      return { ok: false, reason: "La clave de Supabase no es correcta" };
    }
    return { ok: false, reason: `Supabase respondió con un error (${res.status})` };
  } catch {
    return { ok: false, reason: "No se pudo contactar a Supabase. Revisa la dirección (URL)" };
  }
}
