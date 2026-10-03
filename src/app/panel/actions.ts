"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requerirMiNegocio } from "@/lib/panel";
import { esMoneda } from "@/lib/pagina/monedas";
import { combinarPagina, esImagenPermitida } from "@/lib/pagina/validar";
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

export type Resultado = { ok?: boolean; error?: string };

export async function guardarPagina(datos: { nombre: string; pagina: unknown }): Promise<Resultado> {
  const { negocio } = await requerirMiNegocio();
  const nombre = String(datos.nombre ?? "").trim().slice(0, 80);
  if (nombre.length < 2) return { error: "El nombre del negocio debe tener al menos 2 letras." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("negocios")
    .update({ nombre, pagina: combinarPagina(nombre, datos.pagina) })
    .eq("id", negocio.id);

  return error ? { error: "No se pudo guardar. Intenta de nuevo." } : { ok: true };
}

export type ServicioEditable = {
  id?: string;
  nombre: string;
  descripcion: string;
  duracionMin: number;
  precio: number | null;
  foto: string;
};

export async function guardarServicios(datos: {
  moneda: string;
  servicios: ServicioEditable[];
}): Promise<Resultado & { ids?: string[] }> {
  const { negocio } = await requerirMiNegocio();
  if (!esMoneda(datos.moneda)) return { error: "Elige una moneda de la lista." };

  const filas = [];
  for (const [i, s] of datos.servicios.entries()) {
    const nombre = String(s.nombre ?? "").trim().slice(0, 80);
    const duracion = Math.round(Number(s.duracionMin));
    const precio = s.precio === null || String(s.precio) === "" ? null : Number(s.precio);
    if (!nombre) return { error: `El servicio número ${i + 1} no tiene nombre.` };
    if (!(duracion >= 5 && duracion <= 600)) return { error: `Revisa la duración de "${nombre}" (entre 5 y 600 minutos).` };
    if (precio !== null && !(precio >= 0)) return { error: `Revisa el precio de "${nombre}".` };
    const foto = typeof s.foto === "string" && esImagenPermitida(s.foto) ? s.foto : "";

    filas.push({
      id: s.id && /^[0-9a-f-]{36}$/.test(s.id) ? s.id : randomUUID(),
      negocio_id: negocio.id,
      nombre,
      descripcion: String(s.descripcion ?? "").trim().slice(0, 300),
      duracion_min: duracion,
      precio: precio === null ? null : Math.round(precio * 100) / 100,
      foto,
      orden: i,
    });
  }

  const supabase = await createClient();
  const { error: errorMoneda } = await supabase.from("negocios").update({ moneda: datos.moneda }).eq("id", negocio.id);
  if (errorMoneda) return { error: "No se pudo guardar la moneda. Intenta de nuevo." };

  const ids = filas.map((f) => f.id);
  let borrar = supabase.from("servicios").delete().eq("negocio_id", negocio.id);
  if (ids.length) borrar = borrar.not("id", "in", `(${ids.join(",")})`);
  const { error: errorBorrar } = await borrar;
  if (errorBorrar) return { error: "No se pudieron guardar los servicios. Intenta de nuevo." };

  if (filas.length) {
    const { error } = await supabase.from("servicios").upsert(filas);
    if (error) return { error: "No se pudieron guardar los servicios. Intenta de nuevo." };
  }

  return { ok: true, ids };
}

export async function guardarContacto(_prev: Resultado, formData: FormData): Promise<Resultado> {
  const { negocio } = await requerirMiNegocio();
  const campo = (nombre: string, max: number) => String(formData.get(nombre) ?? "").trim().slice(0, max);

  const correo = campo("correo", 120);
  if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return { error: "Revisa el correo." };

  let instagram = campo("instagram", 60).replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "");
  if (instagram && !instagram.startsWith("@")) instagram = `@${instagram}`;

  const supabase = await createClient();
  const { error } = await supabase
    .from("negocios")
    .update({
      direccion: campo("direccion", 200),
      horario_texto: campo("horario_texto", 200),
      whatsapp: campo("whatsapp", 30),
      correo,
      instagram,
    })
    .eq("id", negocio.id);

  return error ? { error: "No se pudo guardar. Intenta de nuevo." } : { ok: true };
}
