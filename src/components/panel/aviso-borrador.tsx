import { fechaBorrador } from "@/lib/borrador";

export function AvisoBorrador({ fecha, onDescartar }: { fecha: string; onDescartar: () => void }) {
  return (
    <div className="bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <p>
        Recuperamos los cambios que dejaste sin publicar el <strong>{fechaBorrador(fecha)}</strong>. Tus clientas
        todavía no los ven.
      </p>
      <button type="button" onClick={onDescartar} className="mt-1 text-xs underline">
        Descartar y volver a lo publicado
      </button>
    </div>
  );
}

export function NotaBorrador() {
  return (
    <p className="text-center text-xs text-neutral-500">
      Borrador guardado en este navegador. Tus clientas lo verán cuando publiques.
    </p>
  );
}
