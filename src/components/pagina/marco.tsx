import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { fuenteCss, todasLasFuentesClassName } from "@/lib/pagina/fuentes";
import type { PaginaNegocio } from "@/lib/pagina/tipos";
import { BotonLink } from "./base";
import { Menu } from "./menu";

export function instagramUrl(usuario: string) {
  return `https://instagram.com/${usuario.replace("@", "").trim()}`;
}

export function whatsappUrl(numero: string) {
  return `https://wa.me/${numero.replace(/\D/g, "")}`;
}

// Theme, header and footer shared by every section of a business page
// (also used by the live preview in the panel).
export function MarcoNegocio({ negocio, children }: { negocio: PaginaNegocio; children: ReactNode }) {
  const { colores, letras, anuncio, logo } = negocio.pagina;
  const { contacto, slug } = negocio;

  const tema = {
    "--c-fondo": colores.fondo,
    "--c-fondo-suave": colores.fondoSuave,
    "--c-texto": colores.texto,
    "--c-titulos": colores.titulos,
    "--c-acento": colores.acento,
    "--c-boton": colores.boton,
    "--c-boton-texto": colores.botonTexto,
    "--f-logo": fuenteCss(letras.logo),
    "--f-titulos": fuenteCss(letras.titulos),
    "--f-texto": fuenteCss(letras.texto),
  } as CSSProperties;

  const marca = logo ? (
    <span className="relative block h-10 w-32">
      <Image src={logo} alt={negocio.nombre} fill sizes="128px" className="object-contain object-left" />
    </span>
  ) : (
    negocio.nombre
  );

  return (
    <div
      style={tema}
      className={`${todasLasFuentesClassName} p-texto flex min-h-full flex-1 flex-col bg-(--c-fondo) text-(--c-texto)`}
    >
      {anuncio.texto && (
        <div
          className="px-4 py-2 text-center text-[11px] tracking-wide"
          style={{ backgroundColor: colores.anuncioFondo, color: colores.anuncioTexto }}
        >
          {anuncio.texto}
        </div>
      )}

      <header className="sticky top-0 z-20 border-b border-black/5 bg-(--c-fondo)/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3 sm:px-8">
          <Link href={`/${slug}`} className="p-logo shrink-0 text-xl text-(--c-titulos)">
            {marca}
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
            <p className="p-logo text-2xl text-(--c-titulos)">{negocio.nombre}</p>
            {contacto.horarioTexto && <p className="mt-4 max-w-xs opacity-70">{contacto.horarioTexto}</p>}
          </div>
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.18em] opacity-60">Visítanos</p>
            {contacto.direccion && <p>{contacto.direccion}</p>}
            {contacto.whatsapp && <p>WhatsApp {contacto.whatsapp}</p>}
            {contacto.correo && <p>{contacto.correo}</p>}
          </div>
          {contacto.instagram && (
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.18em] opacity-60">Síguenos</p>
              <a href={instagramUrl(contacto.instagram)} className="hover:underline" target="_blank" rel="noreferrer">
                Instagram {contacto.instagram}
              </a>
            </div>
          )}
        </div>
        <p className="pb-8 text-center text-[11px] opacity-50">Reservas en línea</p>
      </footer>
    </div>
  );
}
