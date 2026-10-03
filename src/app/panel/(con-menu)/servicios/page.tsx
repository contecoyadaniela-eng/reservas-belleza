import { requerirMiNegocio } from "@/lib/panel";
import { EditorServicios } from "./editor-servicios";

export default async function ServiciosPanelPage() {
  const { negocio } = await requerirMiNegocio();
  return <EditorServicios negocioId={negocio.id} slug={negocio.slug} monedaInicial={negocio.moneda} serviciosIniciales={negocio.servicios} />;
}
