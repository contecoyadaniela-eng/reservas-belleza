import { FUENTES, type FuenteId } from "./fuentes";
import { paginaInicial } from "./demo";
import type { Bloque, PaginaConfig } from "./tipos";

// Builds a complete, safe page config from whatever is stored (or sent by the
// editor): every field falls back to the starting content when missing or invalid.

const HEX = /^#[0-9a-fA-F]{6}$/;

function texto(valor: unknown, porDefecto: string, max: number): string {
  return typeof valor === "string" ? valor.slice(0, max) : porDefecto;
}

function color(valor: unknown, porDefecto: string): string {
  return typeof valor === "string" && HEX.test(valor) ? valor.toLowerCase() : porDefecto;
}

function fuente(valor: unknown, porDefecto: FuenteId): FuenteId {
  return typeof valor === "string" && valor in FUENTES ? (valor as FuenteId) : porDefecto;
}

export function esImagenPermitida(url: string): boolean {
  const propias = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/imagenes/`;
  return url.startsWith(propias) || url.startsWith("https://images.unsplash.com/");
}

function imagen(valor: unknown, porDefecto: string, permitirVacia = false): string {
  if (typeof valor !== "string") return porDefecto;
  if (valor === "") return permitirVacia ? "" : porDefecto;
  return esImagenPermitida(valor) ? valor : porDefecto;
}

function objeto(valor: unknown): Record<string, unknown> {
  return valor && typeof valor === "object" && !Array.isArray(valor) ? (valor as Record<string, unknown>) : {};
}

function bloque(valor: unknown, base: Bloque): Bloque {
  const v = objeto(valor);
  return {
    titulo: texto(v.titulo, base.titulo, 80),
    texto: texto(v.texto, base.texto, 400),
    boton: texto(v.boton, base.boton, 30),
    imagen: imagen(v.imagen, base.imagen),
  };
}

export function combinarPagina(nombreNegocio: string, guardada: unknown): PaginaConfig {
  const base = paginaInicial(nombreNegocio);
  const g = objeto(guardada);
  const colores = objeto(g.colores);
  const letras = objeto(g.letras);
  const portada = objeto(g.portada);
  const galeria = objeto(g.galeria);
  const portadaImgs = Array.isArray(portada.imagenes) ? portada.imagenes : [];
  const galeriaImgs = Array.isArray(galeria.imagenes) ? galeria.imagenes : [];

  return {
    logo: imagen(g.logo, base.logo, true),
    colores: {
      fondo: color(colores.fondo, base.colores.fondo),
      fondoSuave: color(colores.fondoSuave, base.colores.fondoSuave),
      texto: color(colores.texto, base.colores.texto),
      acento: color(colores.acento, base.colores.acento),
      boton: color(colores.boton, base.colores.boton),
      botonTexto: color(colores.botonTexto, base.colores.botonTexto),
    },
    letras: {
      logo: fuente(letras.logo, base.letras.logo),
      titulos: fuente(letras.titulos, base.letras.titulos),
      texto: fuente(letras.texto, base.letras.texto),
    },
    anuncio: { texto: texto(objeto(g.anuncio).texto, base.anuncio.texto, 120) },
    portada: {
      imagenes: [imagen(portadaImgs[0], base.portada.imagenes[0]), imagen(portadaImgs[1], base.portada.imagenes[1])],
      boton: texto(portada.boton, base.portada.boton, 30),
    },
    destacados: { titulo: texto(objeto(g.destacados).titulo, base.destacados.titulo, 80) },
    bloqueImagenTexto: bloque(g.bloqueImagenTexto, base.bloqueImagenTexto),
    bloqueTextoImagen: bloque(g.bloqueTextoImagen, base.bloqueTextoImagen),
    galeria: {
      titulo: texto(galeria.titulo, base.galeria.titulo, 80),
      texto: texto(galeria.texto, base.galeria.texto, 400),
      boton: texto(galeria.boton, base.galeria.boton, 30),
      imagenes: [
        imagen(galeriaImgs[0], base.galeria.imagenes[0]),
        imagen(galeriaImgs[1], base.galeria.imagenes[1]),
        imagen(galeriaImgs[2], base.galeria.imagenes[2]),
      ],
    },
  };
}
