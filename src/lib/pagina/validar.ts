import { FUENTES, type FuenteId } from "./fuentes";
import { paginaInicial } from "./demo";
import { MAX_BLOQUES, type Bloque, type PaginaConfig } from "./tipos";

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

const IMAGEN_BLOQUE_POR_DEFECTO =
  "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=1200&q=75&auto=format&fit=crop";

function bloque(valor: unknown, i: number, ladoPorDefecto: Bloque["lado"]): Bloque {
  const v = objeto(valor);
  const enlace = v.enlace === "reservar" || v.enlace === "contacto" ? v.enlace : "servicios";
  return {
    id: typeof v.id === "string" && /^[\w-]{1,40}$/.test(v.id) ? v.id : `bloque-${i + 1}`,
    lado: v.lado === "derecha" || v.lado === "izquierda" ? v.lado : ladoPorDefecto,
    titulo: texto(v.titulo, "", 80),
    texto: texto(v.texto, "", 400),
    boton: texto(v.boton, "", 30),
    enlace,
    imagen: imagen(v.imagen, IMAGEN_BLOQUE_POR_DEFECTO),
  };
}

function bloques(g: Record<string, unknown>, base: Bloque[]): Bloque[] {
  if (Array.isArray(g.bloques)) {
    const vistos = new Set<string>();
    return g.bloques.slice(0, MAX_BLOQUES).map((b, i) => {
      const resultado = bloque(b, i, i % 2 === 0 ? "izquierda" : "derecha");
      if (vistos.has(resultado.id)) resultado.id = `${resultado.id.slice(0, 30)}-${i}`;
      vistos.add(resultado.id);
      return resultado;
    });
  }
  // Pages saved before sections were free had exactly these two.
  if (g.bloqueImagenTexto || g.bloqueTextoImagen) {
    return [
      bloque({ ...base[0], ...objeto(g.bloqueImagenTexto), id: "inicial-1", lado: "izquierda", enlace: "servicios" }, 0, "izquierda"),
      bloque({ ...base[1], ...objeto(g.bloqueTextoImagen), id: "inicial-2", lado: "derecha", enlace: "contacto" }, 1, "derecha"),
    ];
  }
  return base;
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

  const fondo = color(colores.fondo, base.colores.fondo);
  const textoColor = color(colores.texto, base.colores.texto);

  return {
    logo: imagen(g.logo, base.logo, true),
    colores: {
      fondo,
      fondoSuave: color(colores.fondoSuave, base.colores.fondoSuave),
      texto: textoColor,
      titulos: color(colores.titulos, textoColor),
      acento: color(colores.acento, base.colores.acento),
      boton: color(colores.boton, base.colores.boton),
      botonTexto: color(colores.botonTexto, base.colores.botonTexto),
      // Pages saved before these existed keep their previous look (text color bar).
      anuncioFondo: color(colores.anuncioFondo, textoColor),
      anuncioTexto: color(colores.anuncioTexto, fondo),
    },
    letras: {
      logo: fuente(letras.logo, base.letras.logo),
      titulos: fuente(letras.titulos, base.letras.titulos),
      texto: fuente(letras.texto, base.letras.texto),
    },
    anuncio: { texto: texto(objeto(g.anuncio).texto, base.anuncio.texto, 120) },
    portada: {
      modo: portada.modo === "una" ? "una" : "dos",
      imagenes: [imagen(portadaImgs[0], base.portada.imagenes[0]), imagen(portadaImgs[1], base.portada.imagenes[1])],
      boton: texto(portada.boton, base.portada.boton, 30),
    },
    destacados: { titulo: texto(objeto(g.destacados).titulo, base.destacados.titulo, 80) },
    bloques: bloques(g, base.bloques),
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
