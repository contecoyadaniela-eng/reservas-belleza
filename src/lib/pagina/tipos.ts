import type { FuenteId } from "./fuentes";

export type Bloque = {
  visible: boolean;
  titulo: string;
  texto: string;
  boton: string;
  imagen: string;
};

// Everything a business can customize on its public page.
export type PaginaConfig = {
  colores: {
    fondo: string;
    fondoSuave: string;
    texto: string;
    acento: string;
    boton: string;
    botonTexto: string;
  };
  letras: { logo: FuenteId; titulos: FuenteId; texto: FuenteId };
  anuncio: { visible: boolean; texto: string };
  portada: { visible: boolean; imagenes: [string, string]; boton: string };
  destacados: { visible: boolean; titulo: string };
  bloqueImagenTexto: Bloque;
  bloqueTextoImagen: Bloque;
  galeria: { visible: boolean; titulo: string; texto: string; boton: string; imagenes: string[] };
};

export type Servicio = {
  id: string;
  nombre: string;
  descripcion: string;
  duracionMin: number;
  precio: number;
  foto: string;
  destacado: boolean;
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
  nombre: string;
  slug: string;
  moneda: string;
  mostrarPrecios: boolean;
  pagina: PaginaConfig;
  servicios: Servicio[];
  contacto: Contacto;
  tarjeta: TarjetaConfig;
};
