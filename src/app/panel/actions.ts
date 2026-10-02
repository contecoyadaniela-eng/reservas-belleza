"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toSlug } from "@/lib/slug";
import type { FormState } from "@/app/(auth)/actions";

const ERRORES: Record<string, string> = {
  slug_ocupado: "Esa dirección ya la usa otro negocio. Prueba con otra.",
  slug_reservado: "Esa dirección está reservada por el sistema. Prueba con otra.",
  ya_tiene_negocio: "Tu cuenta ya tiene un negocio.",
  sin_sesion: "Tu sesión se cerró. Vuelve a iniciar sesión.",
};

export async function crearNegocio(_prev: FormState, formData: FormData): Promise<FormState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const slug = toSlug(String(formData.get("slug") ?? ""));

  if (nombre.length < 2) return { error: "Escribe el nombre del negocio." };
  if (slug.length < 3) return { error: "La dirección debe tener al menos 3 letras o números." };

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/ingresar");

  const nombreDuena = String(userData.user.user_metadata?.nombre ?? "").trim() || "Dueña";
  const { error } = await supabase.rpc("crear_negocio", {
    p_nombre: nombre,
    p_slug: slug,
    p_nombre_duena: nombreDuena,
  });

  if (error) {
    const clave = Object.keys(ERRORES).find((k) => error.message.includes(k));
    return { error: clave ? ERRORES[clave] : "No se pudo crear el negocio. Intenta de nuevo." };
  }

  redirect("/panel");
}
