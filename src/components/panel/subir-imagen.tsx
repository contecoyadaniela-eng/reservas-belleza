"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { createClient } from "@/lib/supabase/client";

const LADO_MAXIMO = 1600;

function cargarImagen(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Cuts the chosen area and shrinks it in the browser before uploading,
// so pages load fast and the free storage lasts longer.
async function recortar(src: string, area: Area): Promise<Blob> {
  const img = await cargarImagen(src);
  const escala = Math.min(1, LADO_MAXIMO / Math.max(area.width, area.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(area.width * escala);
  canvas.height = Math.round(area.height * escala);
  canvas
    .getContext("2d")!
    .drawImage(img, area.x, area.y, area.width, area.height, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("sin_imagen"))), "image/webp", 0.82),
  );
}

export function SubirImagen({
  negocioId,
  etiqueta,
  valor,
  onCambio,
  aspecto,
  proporcion = "aspect-[4/3]",
  permitirQuitar = false,
  vertical = false,
}: {
  negocioId: string;
  etiqueta: string;
  valor: string;
  onCambio: (url: string) => void;
  aspecto?: number; // shape of the place where the photo goes; undefined = keep the photo's own shape
  proporcion?: string;
  permitirQuitar?: boolean;
  vertical?: boolean; // photo on top and buttons below, for narrow columns
}) {
  const input = useRef<HTMLInputElement>(null);
  const [fuente, setFuente] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");

  function elegir(archivo: File | undefined) {
    if (input.current) input.current.value = "";
    if (!archivo) return;
    setError("");
    if (!archivo.type.startsWith("image/")) {
      setError("Elige una foto (JPG, PNG o WEBP).");
      return;
    }
    setFuente(URL.createObjectURL(archivo));
  }

  function cerrar() {
    if (fuente?.startsWith("blob:")) URL.revokeObjectURL(fuente);
    setFuente(null);
  }

  async function usar(area: Area) {
    if (!fuente) return;
    setSubiendo(true);
    setError("");
    try {
      const blob = await recortar(fuente, area);
      const supabase = createClient();
      const ruta = `${negocioId}/${crypto.randomUUID()}.webp`;
      const { error: errorSubida } = await supabase.storage
        .from("imagenes")
        .upload(ruta, blob, { contentType: "image/webp", cacheControl: "31536000" });
      if (errorSubida) throw errorSubida;
      onCambio(supabase.storage.from("imagenes").getPublicUrl(ruta).data.publicUrl);
      cerrar();
    } catch {
      setError("No se pudo guardar la foto. Intenta con otra o vuelve a intentarlo.");
    } finally {
      setSubiendo(false);
    }
  }

  const boton =
    "border border-neutral-300 bg-white px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] hover:border-neutral-900 disabled:opacity-50";

  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-600">{etiqueta}</p>
      <div className={`mt-2 flex gap-3 ${vertical ? "flex-col items-stretch" : "items-center"}`}>
        <div className={`relative shrink-0 overflow-hidden bg-neutral-100 ${vertical ? "w-full" : "w-24"} ${proporcion}`}>
          {valor && <Image src={valor} alt="" fill sizes={vertical ? "360px" : "96px"} className="object-cover" />}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => input.current?.click()} disabled={subiendo} className={boton}>
            {valor ? "Cambiar foto" : "Subir foto"}
          </button>
          {valor && (
            <button type="button" onClick={() => setFuente(valor)} disabled={subiendo} className={boton}>
              Recortar
            </button>
          )}
          {permitirQuitar && valor && (
            <button type="button" onClick={() => onCambio("")} className="text-xs text-neutral-500 underline">
              Quitar
            </button>
          )}
        </div>
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => elegir(e.target.files?.[0])}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}

      {fuente && (
        <VentanaRecorte
          fuente={fuente}
          aspecto={aspecto}
          guardando={subiendo}
          error={error}
          onCancelar={cerrar}
          onUsar={usar}
        />
      )}
    </div>
  );
}

function VentanaRecorte({
  fuente,
  aspecto,
  guardando,
  error,
  onCancelar,
  onUsar,
}: {
  fuente: string;
  aspecto?: number;
  guardando: boolean;
  error: string;
  onCancelar: () => void;
  onUsar: (area: Area) => void;
}) {
  const [posicion, setPosicion] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [aspectoFoto, setAspectoFoto] = useState<number | null>(null);

  useEffect(() => {
    const alPresionar = (e: KeyboardEvent) => e.key === "Escape" && !guardando && onCancelar();
    window.addEventListener("keydown", alPresionar);
    return () => window.removeEventListener("keydown", alPresionar);
  }, [guardando, onCancelar]);

  const forma = aspecto ?? aspectoFoto ?? 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true">
      <div className="flex w-full max-w-2xl flex-col bg-white">
        <div className="px-5 pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">Ajusta tu foto</p>
          <p className="mt-1 text-xs text-neutral-500">
            Arrastra la foto para encuadrarla y usa la barra para acercar o alejar. El marco tiene la forma del lugar
            donde irá en tu página.
          </p>
        </div>
        <div className="relative mt-4 h-[55vh] min-h-[280px] bg-neutral-900">
          <Cropper
            image={fuente}
            crop={posicion}
            zoom={zoom}
            minZoom={1}
            maxZoom={4}
            aspect={forma}
            onCropChange={setPosicion}
            onZoomChange={setZoom}
            onCropComplete={(_, pixeles) => setArea(pixeles)}
            onMediaLoaded={(m) => setAspectoFoto(m.naturalWidth / m.naturalHeight)}
            mediaProps={{ crossOrigin: "anonymous" }}
            showGrid
          />
        </div>
        <div className="space-y-3 px-5 py-4">
          <label className="flex items-center gap-3 text-xs text-neutral-600">
            <span>Alejar</span>
            <input
              type="range"
              min={1}
              max={4}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-neutral-900"
              aria-label="Zoom"
            />
            <span>Acercar</span>
          </label>
          {error && <p className="text-xs text-red-700">{error}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancelar}
              disabled={guardando}
              className="border border-neutral-300 px-4 py-3 text-[11px] uppercase tracking-[0.15em] hover:border-neutral-900"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => area && onUsar(area)}
              disabled={guardando || !area}
              className="flex-1 bg-neutral-900 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white hover:bg-neutral-700 disabled:opacity-50"
            >
              {guardando ? "Guardando…" : "Usar esta foto"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
