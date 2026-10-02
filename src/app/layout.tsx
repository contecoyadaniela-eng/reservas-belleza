import type { Metadata } from "next";
import { FUENTES } from "@/lib/pagina/fuentes";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reservas de belleza",
  description: "Reserva tu cita en línea y acumula sellos de fidelidad.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${FUENTES.manrope.font.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
