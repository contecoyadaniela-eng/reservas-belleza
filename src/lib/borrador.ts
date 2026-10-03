// Unpublished edits kept in this browser, so a reload doesn't lose them.
// Storage can be unavailable (private mode, blocked site data): every call
// fails silently and the editor simply works without drafts.

export type Borrador<T> = { datos: T; fecha: string };

export function leerBorrador<T>(clave: string): Borrador<T> | null {
  try {
    const texto = window.localStorage.getItem(clave);
    return texto ? (JSON.parse(texto) as Borrador<T>) : null;
  } catch {
    return null;
  }
}

export function guardarBorrador<T>(clave: string, datos: T) {
  try {
    window.localStorage.setItem(clave, JSON.stringify({ datos, fecha: new Date().toISOString() }));
  } catch {
    // Without storage the draft just isn't kept.
  }
}

export function borrarBorrador(clave: string) {
  try {
    window.localStorage.removeItem(clave);
  } catch {
    // Nothing to remove.
  }
}

export function fechaBorrador(iso: string) {
  return new Date(iso).toLocaleString("es", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}
