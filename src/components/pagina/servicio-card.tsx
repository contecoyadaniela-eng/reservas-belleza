import Image from "next/image";
import Link from "next/link";
import { formatoPrecio, type MonedaId } from "@/lib/pagina/monedas";
import type { Servicio } from "@/lib/pagina/tipos";

export function ServicioCard({ servicio, slug, moneda }: { servicio: Servicio; slug: string; moneda: MonedaId }) {
  return (
    <article className="flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-(--c-fondo-suave)">
        {servicio.foto && (
          <Image
            src={servicio.foto}
            alt={servicio.nombre}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 40vw, 70vw"
            className="object-cover transition duration-500 hover:scale-105"
          />
        )}
      </div>
      <h3 className="p-titulos mt-3 text-sm font-medium text-(--c-titulos)">{servicio.nombre}</h3>
      {servicio.descripcion && <p className="mt-1 line-clamp-2 text-xs opacity-60">{servicio.descripcion}</p>}
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-sm">
          {servicio.precio !== null && formatoPrecio(servicio.precio, moneda)}
          <span className={`text-xs opacity-50 ${servicio.precio !== null ? "ml-2" : ""}`}>
            {servicio.duracionMin} min
          </span>
        </span>
        <Link
          href={`/${slug}/reservar?servicio=${servicio.id}`}
          className="border border-(--c-texto) px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] transition hover:bg-(--c-texto) hover:text-(--c-fondo)"
        >
          Reservar
        </Link>
      </div>
    </article>
  );
}
