import { requerirMiNegocio } from "@/lib/panel";
import { EditorPagina } from "./editor-pagina";

export default async function MiPaginaPage() {
  const { negocio } = await requerirMiNegocio();
  return <EditorPagina negocio={negocio} />;
}
