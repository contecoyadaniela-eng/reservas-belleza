import { notFound } from "next/navigation";
import { cargarPaginaNegocio } from "@/lib/pagina/cargar";
import { MarcoNegocio } from "@/components/pagina/marco";

export async function generateMetadata({ params }: LayoutProps<"/[slug]">) {
  const { slug } = await params;
  const negocio = await cargarPaginaNegocio(slug);
  return { title: negocio ? `${negocio.nombre} · Reserva tu cita` : "Página no encontrada" };
}

export default async function NegocioLayout({ children, params }: LayoutProps<"/[slug]">) {
  const { slug } = await params;
  const negocio = await cargarPaginaNegocio(slug);
  if (!negocio) notFound();

  return <MarcoNegocio negocio={negocio}>{children}</MarcoNegocio>;
}
