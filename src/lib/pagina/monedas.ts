// Currencies of South American countries (Ecuador uses the US dollar).
export const MONEDAS = {
  ARS: { nombre: "Peso argentino", pais: "Argentina", locale: "es-AR" },
  BOB: { nombre: "Boliviano", pais: "Bolivia", locale: "es-BO" },
  BRL: { nombre: "Real", pais: "Brasil", locale: "pt-BR" },
  CLP: { nombre: "Peso chileno", pais: "Chile", locale: "es-CL" },
  COP: { nombre: "Peso colombiano", pais: "Colombia", locale: "es-CO" },
  USD: { nombre: "Dólar", pais: "Ecuador", locale: "es-EC" },
  PYG: { nombre: "Guaraní", pais: "Paraguay", locale: "es-PY" },
  PEN: { nombre: "Sol", pais: "Perú", locale: "es-PE" },
  UYU: { nombre: "Peso uruguayo", pais: "Uruguay", locale: "es-UY" },
  VES: { nombre: "Bolívar", pais: "Venezuela", locale: "es-VE" },
} as const;

export type MonedaId = keyof typeof MONEDAS;

export function esMoneda(valor: string): valor is MonedaId {
  return valor in MONEDAS;
}

// Reads prices typed the local way: "15.000" and "15,000" are fifteen thousand;
// "25,50" and "25.50" are twenty-five and a half. Returns NaN if it isn't a number.
export function leerPrecio(texto: string): number {
  let t = texto.replace(/[\s$]/g, "");
  if (t === "") return NaN;
  const ultimoPunto = t.lastIndexOf(".");
  const ultimaComa = t.lastIndexOf(",");
  if (ultimoPunto >= 0 && ultimaComa >= 0) {
    const decimal = ultimoPunto > ultimaComa ? "." : ",";
    const miles = decimal === "." ? "," : ".";
    t = t.split(miles).join("").replace(decimal, ".");
  } else {
    const separador = ultimoPunto >= 0 ? "." : ultimaComa >= 0 ? "," : null;
    if (separador) {
      const partes = t.split(separador);
      const sonMiles = partes.length > 2 || partes[partes.length - 1].length === 3;
      t = sonMiles ? partes.join("") : partes.join(".");
    }
  }
  return /^\d+(\.\d+)?$/.test(t) ? Number(t) : NaN;
}

export function formatoPrecio(valor: number, moneda: MonedaId) {
  return new Intl.NumberFormat(MONEDAS[moneda].locale, {
    style: "currency",
    currency: moneda,
    minimumFractionDigits: Number.isInteger(valor) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(valor);
}
