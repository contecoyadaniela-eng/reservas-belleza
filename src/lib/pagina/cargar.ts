import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { tarjetaInicial } from "./demo";
import { esMoneda } from "./monedas";
import type { PaginaNegocio, Servicio } from "./tipos";
import { combinarPagina } from "./validar";

export type FilaServicio = {
  id: string;
  nombre: string;
  descripcion: string;
  duracion_min: number;
  precio: number | null;
  foto: string;
};

export function aServicio(fila: FilaServicio): Servicio {
  return {
    id: fila.id,
    nombre: fila.nombre,
    descripcion: fila.descripcion,
    duracionMin: fila.duracion_min,
    precio: fila.precio === null ? null : Number(fila.precio),
    foto: fila.foto,
  };
}

// Shared by the layout and every section page of /[slug]; cached per request.
export const cargarPaginaNegocio = cache(async (slug: string): Promise<PaginaNegocio | null> => {
  const supabase = await createClient();
  const { data } = await supabase.rpc("negocio_publico", { p_slug: slug });
  const n = data?.[0];
  if (!n) return null;

  const { data: servicios } = await supabase
    .from("servicios")
    .select("id, nombre, descripcion, duracion_min, precio, foto")
    .eq("negocio_id", n.id)
    .order("orden")
    .order("creado_en");

  return {
    id: n.id,
    nombre: n.nombre,
    slug: n.slug,
    moneda: esMoneda(n.moneda) ? n.moneda : "CLP",
    pagina: combinarPagina(n.nombre, n.pagina),
    servicios: (servicios ?? []).map(aServicio),
    contacto: {
      direccion: n.direccion,
      horarioTexto: n.horario_texto,
      whatsapp: n.whatsapp,
      correo: n.correo,
      instagram: n.instagram,
    },
    tarjeta: tarjetaInicial,
  };
});
