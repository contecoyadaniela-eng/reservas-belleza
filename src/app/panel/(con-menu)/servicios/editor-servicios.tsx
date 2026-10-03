"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { guardarServicios, type ServicioEditable } from "@/app/panel/actions";
import { SubirImagen } from "@/components/panel/subir-imagen";
import { Caja } from "@/components/ui";
import { MONEDAS, formatoPrecio, leerPrecio, type MonedaId } from "@/lib/pagina/monedas";
import type { Servicio } from "@/lib/pagina/tipos";

type Fila = ServicioEditable & { clave: string; precioTexto: string };

const DURACIONES = [15, 20, 30, 40, 45, 60, 75, 90, 105, 120, 150, 180, 240, 300];

function aFila(s: Servicio): Fila {
  return { ...s, clave: s.id, precioTexto: s.precio === null ? "" : String(s.precio) };
}

export function EditorServicios({
  negocioId,
  slug,
  monedaInicial,
  serviciosIniciales,
}: {
  negocioId: string;
  slug: string;
  monedaInicial: MonedaId;
  serviciosIniciales: Servicio[];
}) {
  const [moneda, setMoneda] = useState<MonedaId>(monedaInicial);
  const [filas, setFilas] = useState<Fila[]>(serviciosIniciales.map(aFila));
  const [sinGuardar, setSinGuardar] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [estado, setEstado] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);

  useEffect(() => {
    if (!sinGuardar) return;
    const avisar = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", avisar);
    return () => window.removeEventListener("beforeunload", avisar);
  }, [sinGuardar]);

  function marcar() {
    setSinGuardar(true);
    setEstado(null);
  }

  function cambiar(clave: string, cambios: Partial<Fila>) {
    setFilas((fs) => fs.map((f) => (f.clave === clave ? { ...f, ...cambios } : f)));
    marcar();
  }

  function agregar() {
    setFilas((fs) => [
      ...fs,
      { clave: crypto.randomUUID(), nombre: "", descripcion: "", duracionMin: 60, precio: null, precioTexto: "", foto: "" },
    ]);
    marcar();
  }

  function quitar(clave: string, nombre: string) {
    if (!confirm(`¿Quitar "${nombre || "este servicio"}"? Se borrará al guardar.`)) return;
    setFilas((fs) => fs.filter((f) => f.clave !== clave));
    marcar();
  }

  function mover(indice: number, direccion: -1 | 1) {
    setFilas((fs) => {
      const copia = [...fs];
      const destino = indice + direccion;
      if (destino < 0 || destino >= copia.length) return fs;
      [copia[indice], copia[destino]] = [copia[destino], copia[indice]];
      return copia;
    });
    marcar();
  }

  async function publicar() {
    const servicios: ServicioEditable[] = [];
    for (const f of filas) {
      const texto = f.precioTexto.trim();
      const precio = texto === "" ? null : leerPrecio(texto);
      if (precio !== null && Number.isNaN(precio)) {
        setEstado({ tipo: "error", texto: `Revisa el precio de "${f.nombre || "un servicio"}": solo números.` });
        return;
      }
      servicios.push({
        id: f.id,
        nombre: f.nombre,
        descripcion: f.descripcion,
        duracionMin: f.duracionMin,
        precio,
        foto: f.foto,
      });
    }

    setGuardando(true);
    const r = await guardarServicios({ moneda, servicios });
    setGuardando(false);
    if (r.ok && r.ids) {
      const ids = r.ids;
      // New services now exist in the database; remember their ids.
      setFilas((fs) => fs.map((f, i) => ({ ...f, id: ids[i] })));
      setSinGuardar(false);
      setEstado({ tipo: "ok", texto: "¡Servicios publicados!" });
    } else {
      setEstado({ tipo: "error", texto: r.error ?? "No se pudo guardar." });
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Caja titulo="Moneda">
        <select
          value={moneda}
          onChange={(e) => {
            setMoneda(e.target.value as MonedaId);
            marcar();
          }}
          className="w-full border border-neutral-200 bg-white px-3 py-2 text-sm"
        >
          {(Object.keys(MONEDAS) as MonedaId[]).map((id) => (
            <option key={id} value={id}>
              {MONEDAS[id].pais} — {MONEDAS[id].nombre} ({id})
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-neutral-500">Así se verá un precio: {formatoPrecio(15000, moneda)}</p>
      </Caja>

      {filas.length === 0 && (
        <Caja>
          <p className="text-sm text-neutral-600">Todavía no tienes servicios. Agrega el primero.</p>
        </Caja>
      )}

      {filas.map((f, i) => (
        <Caja key={f.clave}>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Servicio {i + 1}</p>
            <div className="flex items-center gap-1 text-sm">
              <button type="button" onClick={() => mover(i, -1)} disabled={i === 0} className="px-2 py-1 hover:bg-neutral-100 disabled:opacity-30" title="Subir">
                ↑
              </button>
              <button type="button" onClick={() => mover(i, 1)} disabled={i === filas.length - 1} className="px-2 py-1 hover:bg-neutral-100 disabled:opacity-30" title="Bajar">
                ↓
              </button>
              <button type="button" onClick={() => quitar(f.clave, f.nombre)} className="ml-2 px-2 py-1 text-xs text-red-700 underline">
                Quitar
              </button>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-[auto_1fr]">
            <SubirImagen negocioId={negocioId} etiqueta="Foto" valor={f.foto} proporcion="aspect-square" onCambio={(url) => cambiar(f.clave, { foto: url })} />
            <div className="space-y-4">
              <label className="block">
                <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-600">Nombre</span>
                <input value={f.nombre} maxLength={80} onChange={(e) => cambiar(f.clave, { nombre: e.target.value })} placeholder="Ej: Manicura semipermanente" className="mt-1 w-full border border-neutral-200 px-3 py-2 text-sm" />
              </label>
              <label className="block">
                <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-600">Descripción</span>
                <textarea value={f.descripcion} maxLength={300} rows={2} onChange={(e) => cambiar(f.clave, { descripcion: e.target.value })} className="mt-1 w-full border border-neutral-200 px-3 py-2 text-sm" />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-600">Duración</span>
                  <select value={f.duracionMin} onChange={(e) => cambiar(f.clave, { duracionMin: Number(e.target.value) })} className="mt-1 w-full border border-neutral-200 bg-white px-3 py-2 text-sm">
                    {[...new Set([...DURACIONES, f.duracionMin])].sort((a, b) => a - b).map((m) => (
                      <option key={m} value={m}>
                        {m < 60 ? `${m} min` : `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ""}`}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-600">Precio ({moneda})</span>
                  <input value={f.precioTexto} inputMode="decimal" onChange={(e) => cambiar(f.clave, { precioTexto: e.target.value })} placeholder="Vacío = no mostrar" className="mt-1 w-full border border-neutral-200 px-3 py-2 text-sm" />
                </label>
              </div>
            </div>
          </div>
        </Caja>
      ))}

      <button type="button" onClick={agregar} className="w-full border border-dashed border-neutral-400 bg-white py-4 text-[11px] uppercase tracking-[0.18em] hover:border-neutral-900">
        + Agregar servicio
      </button>

      <div className="sticky bottom-0 z-10 space-y-2 border-t border-neutral-200 bg-neutral-100 py-3">
        {estado && (
          <p className={`px-3 py-2 text-sm ${estado.tipo === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>{estado.texto}</p>
        )}
        <div className="flex gap-3">
          <Link href={`/${slug}/servicios`} target="_blank" className="border border-neutral-300 bg-white px-4 py-3 text-[11px] uppercase tracking-[0.15em] hover:border-neutral-900">
            Ver en mi página ↗
          </Link>
          <button type="button" onClick={publicar} disabled={guardando || !sinGuardar} className="flex-1 bg-neutral-900 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white hover:bg-neutral-700 disabled:opacity-40">
            {guardando ? "Publicando…" : sinGuardar ? "Guardar y publicar" : "Todo publicado"}
          </button>
        </div>
      </div>
    </div>
  );
}
