import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { aServicio, type FilaServicio } from "@/lib/pagina/cargar";
import { tarjetaInicial } from "@/lib/pagina/demo";
import { esMoneda } from "@/lib/pagina/monedas";
import type { PaginaNegocio } from "@/lib/pagina/tipos";
import { combinarPagina } from "@/lib/pagina/validar";

// The signed-in owner's business, read through row level security
// (so it can only ever be her own). Null if she hasn't created one yet.
export const cargarMiNegocio = cache(async () => {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/ingresar");

  const { data: n } = await supabase
    .from("negocios")
    .select("id, nombre, slug, moneda, pagina, direccion, horario_texto, whatsapp, correo, instagram")
    .limit(1)
    .maybeSingle();

  if (!n) return { user: userData.user, negocio: null };

  const { data: servicios } = await supabase
    .from("servicios")
    .select("id, nombre, descripcion, duracion_min, precio, foto")
    .eq("negocio_id", n.id)
    .order("orden")
    .order("creado_en");

  const negocio: PaginaNegocio = {
    id: n.id,
    nombre: n.nombre,
    slug: n.slug,
    moneda: esMoneda(n.moneda) ? n.moneda : "CLP",
    pagina: combinarPagina(n.nombre, n.pagina),
    servicios: ((servicios ?? []) as FilaServicio[]).map(aServicio),
    contacto: {
      direccion: n.direccion,
      horarioTexto: n.horario_texto,
      whatsapp: n.whatsapp,
      correo: n.correo,
      instagram: n.instagram,
    },
    tarjeta: tarjetaInicial,
  };

  return { user: userData.user, negocio };
});

export async function requerirMiNegocio() {
  const { user, negocio } = await cargarMiNegocio();
  if (!negocio) redirect("/panel");
  return { user, negocio };
}
