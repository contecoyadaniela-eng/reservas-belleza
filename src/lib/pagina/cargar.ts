import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { paginaDemo } from "./demo";
import type { PaginaNegocio } from "./tipos";

// Shared by the layout and every section page of /[slug]; cached per request.
export const cargarPaginaNegocio = cache(async (slug: string): Promise<PaginaNegocio | null> => {
  const supabase = await createClient();
  const { data } = await supabase.rpc("negocio_publico", { p_slug: slug });
  const negocio = data?.[0];
  if (!negocio) return null;
  return paginaDemo(negocio.nombre, negocio.slug);
});
