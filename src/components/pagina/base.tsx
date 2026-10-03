import Link from "next/link";
import type { ReactNode } from "react";

export function BotonLink({
  href,
  children,
  variante = "solido",
}: {
  href: string;
  children: ReactNode;
  variante?: "solido" | "borde" | "claro";
}) {
  const estilos = {
    solido: "bg-(--c-boton) text-(--c-boton-texto) hover:opacity-85",
    borde: "border border-(--c-texto) text-(--c-texto) hover:bg-(--c-texto) hover:text-(--c-fondo)",
    claro: "bg-white text-neutral-900 hover:bg-neutral-100",
  }[variante];

  return (
    <Link
      href={href}
      className={`inline-block px-8 py-3 text-[11px] font-medium uppercase tracking-[0.2em] transition ${estilos}`}
    >
      {children}
    </Link>
  );
}

export function Seccion({
  children,
  suave = false,
  className = "",
}: {
  children: ReactNode;
  suave?: boolean;
  className?: string;
}) {
  return (
    <section className={`${suave ? "bg-(--c-fondo-suave)" : ""} ${className}`}>
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-20">{children}</div>
    </section>
  );
}

export function TituloSeccion({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`p-titulos text-2xl font-light tracking-tight text-(--c-titulos) sm:text-3xl ${className}`}>{children}</h2>
  );
}
