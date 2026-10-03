"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const LADO_MAXIMO = 1600;

// Shrinks the photo in the browser before uploading, so pages load fast
// and the free storage lasts longer.
async function achicar(archivo: File): Promise<Blob> {
  const bitmap = await createImageBitmap(archivo);
  const escala = Math.min(1, LADO_MAXIMO / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("sin_imagen"))), "image/webp", 0.82),
  );
}

export function SubirImagen({
  negocioId,
  etiqueta,
  valor,
  onCambio,
  proporcion = "aspect-[4/3]",
  permitirQuitar = false,
  vertical = false,
}: {
  negocioId: string;
  etiqueta: string;
  valor: string;
  onCambio: (url: string) => void;
  proporcion?: string;
  permitirQuitar?: boolean;
  vertical?: boolean; // photo on top and button below, for narrow columns
}) {
  const input = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");

  async function elegir(archivo: File | undefined) {
    if (!archivo) return;
    setError("");
    if (!archivo.type.startsWith("image/")) {
      setError("Elige una foto (JPG, PNG o WEBP).");
      return;
    }
    setSubiendo(true);
    try {
      const blob = await achicar(archivo);
      const supabase = createClient();
      const ruta = `${negocioId}/${crypto.randomUUID()}.webp`;
      const { error: errorSubida } = await supabase.storage
        .from("imagenes")
        .upload(ruta, blob, { contentType: "image/webp", cacheControl: "31536000" });
      if (errorSubida) throw errorSubida;
      onCambio(supabase.storage.from("imagenes").getPublicUrl(ruta).data.publicUrl);
    } catch {
      setError("No se pudo subir la foto. Intenta con otra o vuelve a intentarlo.");
    } finally {
      setSubiendo(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-600">{etiqueta}</p>
      <div className={`mt-2 flex gap-3 ${vertical ? "flex-col items-stretch" : "items-center"}`}>
        <div className={`relative shrink-0 overflow-hidden bg-neutral-100 ${vertical ? "w-full" : "w-24"} ${proporcion}`}>
          {valor && <Image src={valor} alt="" fill sizes={vertical ? "360px" : "96px"} className="object-cover" />}
        </div>
        <div className="flex flex-col items-start gap-1">
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={subiendo}
            className="border border-neutral-300 px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] hover:border-neutral-900 disabled:opacity-50"
          >
            {subiendo ? "Subiendo…" : valor ? "Cambiar foto" : "Subir foto"}
          </button>
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
    </div>
  );
}
