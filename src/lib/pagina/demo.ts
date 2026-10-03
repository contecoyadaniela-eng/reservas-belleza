import type { PaginaConfig, TarjetaConfig } from "./tipos";

// Starting content for a new business, so its page never looks empty.
// The owner replaces it from the panel. Photos: Unsplash (free to use).
const foto = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`;

export function paginaInicial(nombre: string): PaginaConfig {
  return {
    logo: "",
    colores: {
      fondo: "#ffffff",
      fondoSuave: "#f4f4f5",
      texto: "#111111",
      titulos: "#111111",
      acento: "#d2234d",
      boton: "#111111",
      botonTexto: "#ffffff",
      anuncioFondo: "#111111",
      anuncioTexto: "#ffffff",
    },
    letras: { logo: "homemade-apple", titulos: "manrope", texto: "manrope" },
    anuncio: { texto: "10% de descuento en tu primera cita · Reserva en línea" },
    portada: {
      imagenes: [foto("1487412947147-5cebf100ffc2"), foto("1610992015732-2449b76344bc")],
      boton: "Reservar",
    },
    destacados: { titulo: "Nuestros servicios" },
    bloqueImagenTexto: {
      titulo: "Detalle. Forma. Brillo.",
      texto: "Cada servicio está pensado para durar: preparación cuidadosa, productos de calidad y un acabado impecable.",
      boton: "Ver servicios",
      imagen: foto("1632345031435-8727f6897d53"),
    },
    bloqueTextoImagen: {
      titulo: `${nombre} — belleza consciente`,
      texto: "Creemos en una belleza sin prisas y sin complicaciones. Un espacio tranquilo, atención personalizada y resultados que te hacen sentir tú.",
      boton: "Contáctanos",
      imagen: foto("1515377905703-c4788e51af15"),
    },
    galeria: {
      titulo: "Nuestros trabajos",
      texto: "Inspírate con algunos de nuestros trabajos favoritos. Síguenos en Instagram para ver más.",
      boton: "Ver Instagram",
      imagenes: [
        foto("1519014816548-bf5fe059798b", 600),
        foto("1604654894610-df63bc536371", 600),
        foto("1457972729786-0411a3b2b626", 600),
      ],
    },
  };
}

// Loyalty card design is edited in Stage 7; until then every business shows this one.
export const tarjetaInicial: TarjetaConfig = {
  sellosTotal: 8,
  emoji: "💅",
  forma: "circulo",
  colorTarjeta: "#111111",
  colorSellos: "#d2234d",
  premios: [
    { sello: 4, emoji: "🎁", texto: "10% de descuento" },
    { sello: 8, emoji: "✨", texto: "Un servicio gratis" },
  ],
};
