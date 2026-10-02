import { cargarPaginaNegocio } from "@/lib/pagina/cargar";
import { BotonLink, Seccion, TituloSeccion } from "@/components/pagina/base";

export default async function ReservarPage({ params }: PageProps<"/[slug]/reservar">) {
  const { slug } = await params;
  const negocio = (await cargarPaginaNegocio(slug))!;

  return (
    <Seccion>
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 text-center">
        <TituloSeccion>Reserva tu cita</TituloSeccion>
        <p className="text-sm leading-relaxed opacity-70">
          Muy pronto podrás elegir tu servicio, tu profesional y tu hora aquí mismo.
          Mientras tanto, escríbenos por WhatsApp al {negocio.contacto.whatsapp}.
        </p>
        <BotonLink href={`/${slug}/servicios`} variante="borde">
          Ver servicios
        </BotonLink>
      </div>
    </Seccion>
  );
}
