import Image from "next/image";
import Link from "next/link";
import { cargarPaginaNegocio } from "@/lib/pagina/cargar";
import { BotonLink, Seccion, TituloSeccion } from "@/components/pagina/base";
import { ServicioCard } from "@/components/pagina/servicio-card";

export default async function InicioPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const negocio = (await cargarPaginaNegocio(slug))!;
  const { portada, destacados, bloqueImagenTexto, bloqueTextoImagen, galeria } = negocio.pagina;
  const serviciosDestacados = negocio.servicios.filter((s) => s.destacado);

  return (
    <>
      {portada.visible && (
        <section className="relative grid h-[70vh] min-h-[420px] grid-cols-2">
          {portada.imagenes.map((src, i) => (
            <div key={i} className="relative">
              <Image src={src} alt="" fill priority sizes="50vw" className="object-cover" />
            </div>
          ))}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-black/10 px-4 text-center">
            <h1 className="p-logo text-5xl text-white drop-shadow-md sm:text-7xl">{negocio.nombre}</h1>
            <BotonLink href={`/${slug}/reservar`} variante="claro">
              {portada.boton}
            </BotonLink>
          </div>
        </section>
      )}

      {destacados.visible && serviciosDestacados.length > 0 && (
        <Seccion>
          <div className="flex items-end justify-between gap-4">
            <TituloSeccion>{destacados.titulo}</TituloSeccion>
            <Link href={`/${slug}/servicios`} className="text-[11px] uppercase tracking-[0.18em] underline-offset-4 hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="mt-8 flex snap-x gap-5 overflow-x-auto pb-4">
            {serviciosDestacados.map((s) => (
              <div key={s.id} className="w-[70%] shrink-0 snap-start sm:w-[40%] lg:w-[23%]">
                <ServicioCard servicio={s} slug={slug} moneda={negocio.moneda} mostrarPrecio={negocio.mostrarPrecios} />
              </div>
            ))}
          </div>
        </Seccion>
      )}

      {bloqueImagenTexto.visible && (
        <section className="grid bg-(--c-fondo-suave) md:grid-cols-2">
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[480px]">
            <Image src={bloqueImagenTexto.imagen} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col items-center justify-center gap-5 px-8 py-14 text-center">
            <TituloSeccion className="max-w-xs">{bloqueImagenTexto.titulo}</TituloSeccion>
            <p className="max-w-sm text-sm leading-relaxed opacity-75">{bloqueImagenTexto.texto}</p>
            <BotonLink href={`/${slug}/servicios`}>{bloqueImagenTexto.boton}</BotonLink>
          </div>
        </section>
      )}

      {bloqueTextoImagen.visible && (
        <Seccion>
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="order-2 flex flex-col items-center gap-5 text-center md:order-1">
              <TituloSeccion className="max-w-xs">{bloqueTextoImagen.titulo}</TituloSeccion>
              <p className="max-w-sm text-sm leading-relaxed opacity-75">{bloqueTextoImagen.texto}</p>
              <BotonLink href={`/${slug}/contacto`}>{bloqueTextoImagen.boton}</BotonLink>
            </div>
            <div className="relative order-1 aspect-[4/5] md:order-2">
              <Image src={bloqueTextoImagen.imagen} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
          </div>
        </Seccion>
      )}

      {galeria.visible && (
        <Seccion suave>
          <h2 className="p-logo text-center text-4xl text-(--c-acento) sm:text-5xl md:-rotate-2">{galeria.titulo}</h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            {galeria.imagenes.map((src, i) => (
              <div
                key={i}
                className={`bg-white p-2 pb-8 shadow-lg ${["-rotate-3", "rotate-2", "-rotate-1"][i % 3]}`}
              >
                <div className="relative h-56 w-48 sm:h-64 sm:w-56">
                  <Image src={src} alt="" fill sizes="224px" className="object-cover" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center gap-5 text-center">
            <p className="max-w-md text-sm leading-relaxed opacity-75">{galeria.texto}</p>
            <a
              href={`https://instagram.com/${negocio.contacto.instagram.replace("@", "")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-(--c-boton) px-8 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-(--c-boton-texto) hover:opacity-85"
            >
              {galeria.boton}
            </a>
          </div>
        </Seccion>
      )}
    </>
  );
}
