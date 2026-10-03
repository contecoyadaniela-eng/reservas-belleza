"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ENLACES = [
  { href: "/panel", texto: "Resumen" },
  { href: "/panel/pagina", texto: "Mi página" },
  { href: "/panel/servicios", texto: "Servicios" },
  { href: "/panel/contacto", texto: "Contacto" },
];

export function MenuPanel() {
  const pathname = usePathname();
  return (
    <nav className="sin-barra flex gap-6 overflow-x-auto whitespace-nowrap text-[11px] uppercase tracking-[0.18em]">
      {ENLACES.map((e) => (
        <Link
          key={e.href}
          href={e.href}
          className={`border-b py-1 ${
            pathname === e.href ? "border-neutral-900 text-neutral-900" : "border-transparent text-neutral-500 hover:text-neutral-900"
          }`}
        >
          {e.texto}
        </Link>
      ))}
    </nav>
  );
}
