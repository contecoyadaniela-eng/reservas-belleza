import { cargarPaginaNegocio } from "@/lib/pagina/cargar";
import { Seccion, TituloSeccion } from "@/components/pagina/base";
import { ServicioCard } from "@/components/pagina/servicio-card";

export default async function ServiciosPage({ params }: PageProps<"/[slug]/servicios">) {
  const { slug } = await params;
  const negocio = (await cargarPaginaNegocio(slug))!;

  return (
    <Seccion>
      <TituloSeccion>Servicios</TituloSeccion>
      <p className="mt-2 text-sm opacity-60">Elige tu servicio y reserva tu hora en línea.</p>
      <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
        {negocio.servicios.map((s) => (
          <ServicioCard key={s.id} servicio={s} slug={slug} moneda={negocio.moneda} mostrarPrecio={negocio.mostrarPrecios} />
        ))}
      </div>
    </Seccion>
  );
}
