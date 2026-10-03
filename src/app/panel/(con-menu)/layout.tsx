import Link from "next/link";
import type { ReactNode } from "react";
import { salir } from "@/app/(auth)/actions";
import { cargarMiNegocio } from "@/lib/panel";
import { MenuPanel } from "./menu-panel";

export default async function PanelLayout({ children }: { children: ReactNode }) {
  const { negocio } = await cargarMiNegocio();

  return (
    <div className="flex flex-1 flex-col bg-neutral-100">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 sm:px-8">
          <p className="text-sm font-semibold">{negocio ? negocio.nombre : "Mi panel"}</p>
          <div className="flex items-center gap-3">
            {negocio && (
              <Link
                href={`/${negocio.slug}`}
                target="_blank"
                className="text-[11px] uppercase tracking-[0.15em] text-neutral-600 underline-offset-4 hover:underline"
              >
                Ver mi página ↗
              </Link>
            )}
            <form action={salir}>
              <button className="whitespace-nowrap border border-neutral-300 px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] hover:border-neutral-900">
                Cerrar sesión
              </button>
            </form>
          </div>
          {negocio && (
            <div className="w-full">
              <MenuPanel />
            </div>
          )}
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8">{children}</div>
    </div>
  );
}
