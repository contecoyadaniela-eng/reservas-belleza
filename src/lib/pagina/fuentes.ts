import {
  Cormorant_Garamond,
  Homemade_Apple,
  Inter,
  Manrope,
  Montserrat,
  Mrs_Saint_Delafield,
  Playfair_Display,
  Yellowtail,
} from "next/font/google";

// Curated list the business owner can choose from. Fonts are only
// downloaded by the browser when a page actually uses them.
const homemadeApple = Homemade_Apple({ weight: "400", subsets: ["latin"], variable: "--font-homemade-apple", preload: false });
const yellowtail = Yellowtail({ weight: "400", subsets: ["latin"], variable: "--font-yellowtail", preload: false });
const mrsSaint = Mrs_Saint_Delafield({ weight: "400", subsets: ["latin"], variable: "--font-mrs-saint", preload: false });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", preload: false });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", preload: false });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", preload: false });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", preload: false });
const cormorant = Cormorant_Garamond({ weight: ["300", "400", "500", "600"], subsets: ["latin"], variable: "--font-cormorant", preload: false });

export const FUENTES = {
  "homemade-apple": { nombre: "Manuscrita pincel", tipo: "manuscrita", font: homemadeApple },
  yellowtail: { nombre: "Manuscrita retro", tipo: "manuscrita", font: yellowtail },
  "mrs-saint": { nombre: "Manuscrita elegante", tipo: "manuscrita", font: mrsSaint },
  manrope: { nombre: "Moderna", tipo: "sans", font: manrope },
  inter: { nombre: "Limpia", tipo: "sans", font: inter },
  montserrat: { nombre: "Geométrica", tipo: "sans", font: montserrat },
  playfair: { nombre: "Clásica", tipo: "serif", font: playfair },
  cormorant: { nombre: "Editorial", tipo: "serif", font: cormorant },
} as const;

export type FuenteId = keyof typeof FUENTES;

export const todasLasFuentesClassName = Object.values(FUENTES)
  .map((f) => f.font.variable)
  .join(" ");

export function fuenteCss(id: FuenteId) {
  return FUENTES[id].font.style.fontFamily;
}
