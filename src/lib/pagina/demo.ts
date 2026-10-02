import type { PaginaNegocio } from "./tipos";

// Demo content shown until each business edits its own page (Stage 3).
// Photos: Unsplash (free to use).
const foto = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`;

export function paginaDemo(nombre: string, slug: string): PaginaNegocio {
  return {
    nombre,
    slug,
    moneda: "CLP",
    mostrarPrecios: true,
    pagina: {
      colores: {
        fondo: "#ffffff",
        fondoSuave: "#f4f4f5",
        texto: "#111111",
        acento: "#d2234d",
        boton: "#111111",
        botonTexto: "#ffffff",
      },
      letras: { logo: "homemade-apple", titulos: "manrope", texto: "manrope" },
      anuncio: { visible: true, texto: "10% de descuento en tu primera cita · Reserva en línea" },
      portada: {
        visible: true,
        imagenes: [foto("1487412947147-5cebf100ffc2"), foto("1610992015732-2449b76344bc")],
        boton: "Reservar",
      },
      destacados: { visible: true, titulo: "Nuestros servicios" },
      bloqueImagenTexto: {
        visible: true,
        titulo: "Detalle. Forma. Brillo.",
        texto: "Cada manicura está pensada para durar: preparación cuidadosa, productos de calidad y un acabado impecable.",
        boton: "Ver servicios",
        imagen: foto("1632345031435-8727f6897d53"),
      },
      bloqueTextoImagen: {
        visible: true,
        titulo: `${nombre} — belleza consciente`,
        texto: "Creemos en una belleza sin prisas y sin complicaciones. Un espacio tranquilo, atención personalizada y resultados que te hacen sentir tú.",
        boton: "Conócenos",
        imagen: foto("1515377905703-c4788e51af15"),
      },
      galeria: {
        visible: true,
        titulo: "Nuestros trabajos",
        texto: "Inspírate con algunos de nuestros diseños favoritos. Síguenos en Instagram para ver más.",
        boton: "Ver Instagram",
        imagenes: [
          foto("1519014816548-bf5fe059798b", 600),
          foto("1604654894610-df63bc536371", 600),
          foto("1457972729786-0411a3b2b626", 600),
        ],
      },
    },
    servicios: [
      { id: "s1", nombre: "Manicura clásica", descripcion: "Limado, cutícula, hidratación y esmaltado tradicional.", duracionMin: 45, precio: 12000, foto: foto("1610992015732-2449b76344bc", 600), destacado: true },
      { id: "s2", nombre: "Esmaltado semipermanente", descripcion: "Color intenso y brillo que dura hasta 3 semanas.", duracionMin: 60, precio: 18000, foto: foto("1607779097040-26e80aa78e66", 600), destacado: true },
      { id: "s3", nombre: "Nail art", descripcion: "Diseños a mano alzada, francesas, piedras y efectos.", duracionMin: 90, precio: 25000, foto: foto("1604654894610-df63bc536371", 600), destacado: true },
      { id: "s4", nombre: "Uñas acrílicas", descripcion: "Extensión y forma a tu gusto, con acabado natural.", duracionMin: 120, precio: 30000, foto: foto("1519014816548-bf5fe059798b", 600), destacado: true },
      { id: "s5", nombre: "Spa de manos", descripcion: "Exfoliación, mascarilla y masaje relajante.", duracionMin: 40, precio: 15000, foto: foto("1457972729786-0411a3b2b626", 600), destacado: false },
      { id: "s6", nombre: "Esmaltado de color", descripcion: "Elige entre más de 100 tonos de temporada.", duracionMin: 30, precio: 8000, foto: foto("1599948128020-9a44505b0d1b", 600), destacado: false },
    ],
    contacto: {
      direccion: "Av. Providencia 1234, local 5, Santiago",
      horarioTexto: "Lunes a viernes 10:00–20:00 · Sábado 10:00–15:00",
      whatsapp: "+56 9 1234 5678",
      correo: "hola@ejemplo.com",
      instagram: "@unasdeana",
    },
    tarjeta: {
      sellosTotal: 8,
      emoji: "💅",
      forma: "circulo",
      colorTarjeta: "#111111",
      colorSellos: "#d2234d",
      premios: [
        { sello: 4, emoji: "🎁", texto: "10% de descuento" },
        { sello: 8, emoji: "✨", texto: "Manicura clásica gratis" },
      ],
    },
  };
}

export function formatoPrecio(valor: number, moneda: string) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: moneda, maximumFractionDigits: 0 }).format(valor);
}
