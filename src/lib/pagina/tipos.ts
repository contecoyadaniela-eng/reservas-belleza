import type { FuenteId } from "./fuentes";
import type { MonedaId } from "./monedas";

export type Bloque = {
  titulo: string;
  texto: string;
  boton: string;
  imagen: string;
};

// Everything a business can customize on its home page. The structure
// (which blocks exist and their order) is the same for every business.
export type PaginaConfig = {
  logo: string;
  colores: {
    fondo: string;
    fondoSuave: string;
    texto: string;
    titulos: string;
    acento: string;
    boton: string;
    botonTexto: string;
    anuncioFondo: string;
    anuncioTexto: string;
  };
  letras: { logo: FuenteId; titulos: FuenteId; texto: FuenteId };
  anuncio: { texto: string };
  portada: { modo: "una" | "dos"; imagenes: [string, string]; boton: string };
  destacados: { titulo: string };
  bloqueImagenTexto: Bloque;
  bloqueTextoImagen: Bloque;
  galeria: { titulo: string; texto: string; boton: string; imagenes: [string, string, string] };
};

export type Servicio = {
  id: string;
  nombre: string;
  descripcion: string;
  duracionMin: number;
  precio: number | null; // null = no mostrar precio
  foto: string;
};

export type Contacto = {
  direccion: string;
  horarioTexto: string;
  whatsapp: string;
  correo: string;
  instagram: string;
};

export type TarjetaConfig = {
  sellosTotal: number;
  emoji: string;
  forma: "circulo" | "cuadrado";
  colorTarjeta: string;
  colorSellos: string;
  premios: { sello: number; emoji: string; texto: string }[];
};

export type PaginaNegocio = {
  id: string;
  nombre: string;
  slug: string;
  moneda: MonedaId;
  pagina: PaginaConfig;
  servicios: Servicio[];
  contacto: Contacto;
  tarjeta: TarjetaConfig;
};
