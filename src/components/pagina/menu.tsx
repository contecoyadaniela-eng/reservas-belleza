"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Menu({ slug }: { slug: string }) {
  const pathname = usePathname();
  const enlaces = [
    { href: `/${slug}`, texto: "Inicio" },
    { href: `/${slug}/servicios`, texto: "Servicios" },
    { href: `/${slug}/reservar`, texto: "Reservar" },
    { href: `/${slug}/tarjeta`, texto: "Mi tarjeta" },
    { href: `/${slug}/contacto`, texto: "Contacto" },
  ];

  return (
    <nav className="sin-barra flex gap-6 overflow-x-auto whitespace-nowrap text-[11px] uppercase tracking-[0.18em]">
      {enlaces.map((e) => {
        const activo = pathname === e.href;
        return (
          <Link
            key={e.href}
            href={e.href}
            className={`border-b py-1 transition ${
              activo ? "border-(--c-texto)" : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            {e.texto}
          </Link>
        );
      })}
    </nav>
  );
}
