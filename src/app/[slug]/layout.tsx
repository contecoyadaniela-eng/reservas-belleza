import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { cargarPaginaNegocio } from "@/lib/pagina/cargar";
import { fuenteCss, todasLasFuentesClassName } from "@/lib/pagina/fuentes";
import { BotonLink } from "@/components/pagina/base";
import { Menu } from "@/components/pagina/menu";

export async function generateMetadata({ params }: LayoutProps<"/[slug]">) {
  const { slug } = await params;
  const negocio = await cargarPaginaNegocio(slug);
  return { title: negocio ? `${negocio.nombre} · Reserva tu cita` : "Página no encontrada" };
}

export default async function NegocioLayout({ children, params }: LayoutProps<"/[slug]">) {
  const { slug } = await params;
  const negocio = await cargarPaginaNegocio(slug);
  if (!negocio) notFound();

  const { colores, letras, anuncio } = negocio.pagina;
  const { contacto } = negocio;

  // The business's theme, exposed as CSS variables for every section.
  const tema = {
    "--c-fondo": colores.fondo,
    "--c-fondo-suave": colores.fondoSuave,
    "--c-texto": colores.texto,
    "--c-acento": colores.acento,
    "--c-boton": colores.boton,
    "--c-boton-texto": colores.botonTexto,
    "--f-logo": fuenteCss(letras.logo),
    "--f-titulos": fuenteCss(letras.titulos),
    "--f-texto": fuenteCss(letras.texto),
  } as CSSProperties;

  return (
    <div
      style={tema}
      className={`${todasLasFuentesClassName} p-texto flex flex-1 flex-col bg-(--c-fondo) text-(--c-texto)`}
    >
      {anuncio.visible && (
        <div className="bg-(--c-texto) px-4 py-2 text-center text-[11px] tracking-wide text-(--c-fondo)">
          {anuncio.texto}
        </div>
      )}

      <header className="sticky top-0 z-20 border-b border-black/5 bg-(--c-fondo)/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3 sm:px-8">
          <Link href={`/${slug}`} className="p-logo shrink-0 text-xl">
            {negocio.nombre}
          </Link>
          <div className="hidden md:block">
            <Menu slug={slug} />
          </div>
          <BotonLink href={`/${slug}/reservar`}>Reservar</BotonLink>
        </div>
        <div className="border-t border-black/5 px-4 py-2 md:hidden">
          <Menu slug={slug} />
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-black/5">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 text-sm sm:px-8 md:grid-cols-3">
          <div>
            <p className="p-logo text-2xl">{negocio.nombre}</p>
            <p className="mt-4 max-w-xs opacity-70">{contacto.horarioTexto}</p>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.18em] opacity-60">Visítanos</p>
            <p>{contacto.direccion}</p>
            <p>WhatsApp {contacto.whatsapp}</p>
            <p>{contacto.correo}</p>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.18em] opacity-60">Síguenos</p>
            <a
              href={`https://instagram.com/${contacto.instagram.replace("@", "")}`}
              className="hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Instagram {contacto.instagram}
            </a>
          </div>
        </div>
        <p className="pb-8 text-center text-[11px] opacity-50">Reservas en línea · Fotos de ejemplo: Unsplash</p>
      </footer>
    </div>
  );
}
