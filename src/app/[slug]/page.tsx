import { cargarPaginaNegocio } from "@/lib/pagina/cargar";
import { Inicio } from "@/components/pagina/inicio";

export default async function InicioPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const negocio = (await cargarPaginaNegocio(slug))!;
  return <Inicio negocio={negocio} />;
}
