"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { guardarPagina } from "@/app/panel/actions";
import { SubirImagen } from "@/components/panel/subir-imagen";
import { FUENTES, type FuenteId } from "@/lib/pagina/fuentes";
import type { Bloque, PaginaConfig, PaginaNegocio } from "@/lib/pagina/tipos";

type Colores = PaginaConfig["colores"];

const PALETAS: { nombre: string; colores: Colores }[] = [
  { nombre: "Editorial", colores: { fondo: "#ffffff", fondoSuave: "#f4f4f5", texto: "#111111", acento: "#d2234d", boton: "#111111", botonTexto: "#ffffff", anuncioFondo: "#111111", anuncioTexto: "#ffffff" } },
  { nombre: "Rosa palo", colores: { fondo: "#fffafa", fondoSuave: "#f9e4e6", texto: "#3b2a2c", acento: "#c45a6b", boton: "#c45a6b", botonTexto: "#ffffff", anuncioFondo: "#c45a6b", anuncioTexto: "#ffffff" } },
  { nombre: "Nude", colores: { fondo: "#faf7f2", fondoSuave: "#efe6da", texto: "#3d342c", acento: "#a47148", boton: "#3d342c", botonTexto: "#faf7f2", anuncioFondo: "#3d342c", anuncioTexto: "#faf7f2" } },
  { nombre: "Lavanda", colores: { fondo: "#fbfaff", fondoSuave: "#ece8f7", texto: "#2e2a3d", acento: "#7c5cbf", boton: "#2e2a3d", botonTexto: "#ffffff", anuncioFondo: "#2e2a3d", anuncioTexto: "#ffffff" } },
  { nombre: "Salvia", colores: { fondo: "#f9faf7", fondoSuave: "#e4eadf", texto: "#2b3327", acento: "#6b8f5e", boton: "#2b3327", botonTexto: "#ffffff", anuncioFondo: "#2b3327", anuncioTexto: "#ffffff" } },
  { nombre: "Noche", colores: { fondo: "#141414", fondoSuave: "#222222", texto: "#f4f1ec", acento: "#e8b4b8", boton: "#e8b4b8", botonTexto: "#141414", anuncioFondo: "#e8b4b8", anuncioTexto: "#141414" } },
];

const NOMBRES_COLORES: { clave: keyof Colores; nombre: string; ayuda: string }[] = [
  { clave: "fondo", nombre: "Fondo", ayuda: "Color principal de la página" },
  { clave: "fondoSuave", nombre: "Fondo secundario", ayuda: "Bloques grises y galería" },
  { clave: "texto", nombre: "Texto", ayuda: "Letras de la página" },
  { clave: "acento", nombre: "Acento", ayuda: "Título manuscrito de la galería" },
  { clave: "boton", nombre: "Botones", ayuda: "Fondo de los botones" },
  { clave: "botonTexto", nombre: "Texto de botones", ayuda: "Letras dentro de los botones" },
  { clave: "anuncioFondo", nombre: "Barra de anuncio", ayuda: "Fondo de la barra de arriba" },
  { clave: "anuncioTexto", nombre: "Texto de la barra", ayuda: "Letras de la barra de arriba" },
];

export function EditorPagina({ negocio }: { negocio: PaginaNegocio }) {
  const [nombre, setNombre] = useState(negocio.nombre);
  const [pagina, setPagina] = useState<PaginaConfig>(negocio.pagina);
  const [sinGuardar, setSinGuardar] = useState(false);
  const [estado, setEstado] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);
  const [guardando, setGuardando] = useState(false);

  const cambiar = useCallback((fn: (p: PaginaConfig) => PaginaConfig) => {
    setPagina(fn);
    setSinGuardar(true);
    setEstado(null);
  }, []);

  useEffect(() => {
    if (!sinGuardar) return;
    const avisar = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", avisar);
    return () => window.removeEventListener("beforeunload", avisar);
  }, [sinGuardar]);

  async function publicar() {
    setGuardando(true);
    const r = await guardarPagina({ nombre, pagina });
    setGuardando(false);
    if (r.ok) {
      setSinGuardar(false);
      setEstado({ tipo: "ok", texto: "¡Publicado! Tus clientas ya ven los cambios." });
    } else {
      setEstado({ tipo: "error", texto: r.error ?? "No se pudo guardar." });
    }
  }

  const bloque = (clave: "bloqueImagenTexto" | "bloqueTextoImagen", campo: keyof Bloque, valor: string) =>
    cambiar((p) => ({ ...p, [clave]: { ...p[clave], [campo]: valor } }));

  const vistaNegocio: PaginaNegocio = { ...negocio, nombre, pagina };

  return (
    <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
      <div className="space-y-3">
        <Grupo titulo="Marca" abierto>
          <Texto etiqueta="Nombre del negocio" valor={nombre} max={80} onCambio={(v) => { setNombre(v); setSinGuardar(true); }} />
          <SubirImagen
            negocioId={negocio.id}
            etiqueta="Logo (opcional, reemplaza al nombre en el menú)"
            valor={pagina.logo}
            proporcion="aspect-[3/1]"
            permitirQuitar
            onCambio={(url) => cambiar((p) => ({ ...p, logo: url }))}
          />
        </Grupo>

        <Grupo titulo="Colores">
          <p className="text-xs text-neutral-500">Elige una paleta lista o ajusta cada color.</p>
          <div className="grid grid-cols-3 gap-2">
            {PALETAS.map((paleta) => (
              <button
                key={paleta.nombre}
                type="button"
                onClick={() => cambiar((p) => ({ ...p, colores: paleta.colores }))}
                className="border border-neutral-200 p-2 text-left text-[11px] hover:border-neutral-900"
              >
                <span className="flex h-5 overflow-hidden">
                  {[paleta.colores.fondo, paleta.colores.fondoSuave, paleta.colores.acento, paleta.colores.boton].map((c, i) => (
                    <span key={i} className="flex-1" style={{ backgroundColor: c }} />
                  ))}
                </span>
                <span className="mt-1 block">{paleta.nombre}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {NOMBRES_COLORES.map((c) => (
              <label key={c.clave} className="flex items-center gap-2" title={c.ayuda}>
                <input
                  type="color"
                  value={pagina.colores[c.clave]}
                  onChange={(e) => cambiar((p) => ({ ...p, colores: { ...p.colores, [c.clave]: e.target.value } }))}
                  className="h-9 w-9 shrink-0 cursor-pointer border border-neutral-200 bg-white p-0.5"
                />
                <span className="text-xs leading-tight">
                  {c.nombre}
                  <span className="block text-[10px] text-neutral-500">{c.ayuda}</span>
                </span>
              </label>
            ))}
          </div>
        </Grupo>

        <Grupo titulo="Letras">
          <SelectorFuente etiqueta="Nombre y títulos manuscritos" valor={pagina.letras.logo} onCambio={(v) => cambiar((p) => ({ ...p, letras: { ...p.letras, logo: v } }))} />
          <SelectorFuente etiqueta="Títulos" valor={pagina.letras.titulos} onCambio={(v) => cambiar((p) => ({ ...p, letras: { ...p.letras, titulos: v } }))} />
          <SelectorFuente etiqueta="Textos" valor={pagina.letras.texto} onCambio={(v) => cambiar((p) => ({ ...p, letras: { ...p.letras, texto: v } }))} />
        </Grupo>

        <Grupo titulo="Barra de anuncio">
          <Texto etiqueta="Texto (déjalo vacío para no mostrar la barra)" valor={pagina.anuncio.texto} max={120} onCambio={(v) => cambiar((p) => ({ ...p, anuncio: { texto: v } }))} />
        </Grupo>

        <Grupo titulo="Portada">
          <div className="grid grid-cols-2 gap-3">
            {[0, 1].map((i) => (
              <SubirImagen
                key={i}
                negocioId={negocio.id}
                etiqueta={i === 0 ? "Foto izquierda" : "Foto derecha"}
                valor={pagina.portada.imagenes[i]}
                proporcion="aspect-[3/4]"
                onCambio={(url) =>
                  cambiar((p) => {
                    const imagenes = [...p.portada.imagenes] as [string, string];
                    imagenes[i] = url;
                    return { ...p, portada: { ...p.portada, imagenes } };
                  })
                }
              />
            ))}
          </div>
          <Texto etiqueta="Texto del botón" valor={pagina.portada.boton} max={30} onCambio={(v) => cambiar((p) => ({ ...p, portada: { ...p.portada, boton: v } }))} />
        </Grupo>

        <Grupo titulo="Servicios destacados">
          <Texto etiqueta="Título" valor={pagina.destacados.titulo} max={80} onCambio={(v) => cambiar((p) => ({ ...p, destacados: { titulo: v } }))} />
          <p className="text-xs text-neutral-500">Los servicios se editan en la sección Servicios del menú.</p>
        </Grupo>

        {(
          [
            ["bloqueImagenTexto", "Bloque foto + texto"],
            ["bloqueTextoImagen", "Bloque texto + foto"],
          ] as const
        ).map(([clave, titulo]) => (
          <Grupo key={clave} titulo={titulo}>
            <SubirImagen negocioId={negocio.id} etiqueta="Foto" valor={pagina[clave].imagen} onCambio={(url) => bloque(clave, "imagen", url)} />
            <Texto etiqueta="Título" valor={pagina[clave].titulo} max={80} onCambio={(v) => bloque(clave, "titulo", v)} />
            <AreaTexto etiqueta="Texto" valor={pagina[clave].texto} max={400} onCambio={(v) => bloque(clave, "texto", v)} />
            <Texto etiqueta="Texto del botón" valor={pagina[clave].boton} max={30} onCambio={(v) => bloque(clave, "boton", v)} />
          </Grupo>
        ))}

        <Grupo titulo="Galería">
          <Texto etiqueta="Título manuscrito" valor={pagina.galeria.titulo} max={80} onCambio={(v) => cambiar((p) => ({ ...p, galeria: { ...p.galeria, titulo: v } }))} />
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <SubirImagen
                key={i}
                negocioId={negocio.id}
                etiqueta={`Foto ${i + 1}`}
                valor={pagina.galeria.imagenes[i]}
                proporcion="aspect-[4/5]"
                onCambio={(url) =>
                  cambiar((p) => {
                    const imagenes = [...p.galeria.imagenes] as [string, string, string];
                    imagenes[i] = url;
                    return { ...p, galeria: { ...p.galeria, imagenes } };
                  })
                }
              />
            ))}
          </div>
          <AreaTexto etiqueta="Texto" valor={pagina.galeria.texto} max={400} onCambio={(v) => cambiar((p) => ({ ...p, galeria: { ...p.galeria, texto: v } }))} />
          <Texto etiqueta="Texto del botón (lleva a tu Instagram)" valor={pagina.galeria.boton} max={30} onCambio={(v) => cambiar((p) => ({ ...p, galeria: { ...p.galeria, boton: v } }))} />
        </Grupo>

        <div className="sticky bottom-0 z-10 space-y-2 border-t border-neutral-200 bg-neutral-100 py-3">
          {estado && (
            <p className={`px-3 py-2 text-sm ${estado.tipo === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
              {estado.texto}
            </p>
          )}
          <button
            type="button"
            onClick={publicar}
            disabled={guardando || !sinGuardar}
            className="w-full bg-neutral-900 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white hover:bg-neutral-700 disabled:opacity-40"
          >
            {guardando ? "Publicando…" : sinGuardar ? "Guardar y publicar" : "Todo publicado"}
          </button>
        </div>
      </div>

      <VistaPrevia negocio={vistaNegocio} />
    </div>
  );
}

function VistaPrevia({ negocio }: { negocio: PaginaNegocio }) {
  const [dispositivo, setDispositivo] = useState<"computadora" | "celular">("computadora");
  const iframe = useRef<HTMLIFrameElement>(null);
  const caja = useRef<HTMLDivElement>(null);
  const [anchoCaja, setAnchoCaja] = useState(800);
  const ultimo = useRef(negocio);

  const enviar = useCallback(() => {
    iframe.current?.contentWindow?.postMessage({ tipo: "vista-previa", negocio: ultimo.current }, window.location.origin);
  }, []);

  useEffect(() => {
    function lista(e: MessageEvent) {
      if (e.origin === window.location.origin && e.data?.tipo === "vista-previa-lista") enviar();
    }
    window.addEventListener("message", lista);
    return () => window.removeEventListener("message", lista);
  }, [enviar]);

  useEffect(() => {
    ultimo.current = negocio;
    enviar();
  }, [negocio, enviar]);

  useLayoutEffect(() => {
    if (!caja.current) return;
    const observador = new ResizeObserver(([e]) => setAnchoCaja(e.contentRect.width));
    observador.observe(caja.current);
    return () => observador.disconnect();
  }, []);

  const anchoReal = dispositivo === "computadora" ? 1280 : 390;
  const escala = Math.min(1, anchoCaja / anchoReal);
  const alto = 760;

  return (
    <div className="lg:sticky lg:top-4 lg:self-start">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Vista previa</p>
        <div className="flex border border-neutral-300 bg-white text-[11px] uppercase tracking-[0.12em]">
          {(["computadora", "celular"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDispositivo(d)}
              className={`px-3 py-1.5 ${dispositivo === d ? "bg-neutral-900 text-white" : ""}`}
            >
              {d === "computadora" ? "💻 Computadora" : "📱 Celular"}
            </button>
          ))}
        </div>
      </div>
      <div ref={caja} className="flex justify-center overflow-hidden border border-neutral-200 bg-white" style={{ height: alto * escala }}>
        <iframe
          ref={iframe}
          src="/panel/vista-previa"
          title="Vista previa de tu página"
          style={{ width: anchoReal, height: alto, transform: `scale(${escala})`, transformOrigin: "top center" }}
          className="shrink-0 border-0"
        />
      </div>
    </div>
  );
}

function Grupo({ titulo, abierto = false, children }: { titulo: string; abierto?: boolean; children: ReactNode }) {
  return (
    <details open={abierto} className="group bg-white">
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.18em]">
        {titulo}
        <span className="transition group-open:rotate-180">⌄</span>
      </summary>
      <div className="space-y-4 px-5 pb-5">{children}</div>
    </details>
  );
}

const claseCampo =
  "mt-1 w-full border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-900";

function Texto({ etiqueta, valor, max, onCambio }: { etiqueta: string; valor: string; max: number; onCambio: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-600">{etiqueta}</span>
      <input value={valor} maxLength={max} onChange={(e) => onCambio(e.target.value)} className={claseCampo} />
    </label>
  );
}

function AreaTexto({ etiqueta, valor, max, onCambio }: { etiqueta: string; valor: string; max: number; onCambio: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-600">{etiqueta}</span>
      <textarea value={valor} maxLength={max} rows={4} onChange={(e) => onCambio(e.target.value)} className={claseCampo} />
    </label>
  );
}

function SelectorFuente({ etiqueta, valor, onCambio }: { etiqueta: string; valor: FuenteId; onCambio: (v: FuenteId) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-600">{etiqueta}</span>
      <select value={valor} onChange={(e) => onCambio(e.target.value as FuenteId)} className={claseCampo}>
        {(Object.keys(FUENTES) as FuenteId[]).map((id) => (
          <option key={id} value={id}>
            {FUENTES[id].nombre}
          </option>
        ))}
      </select>
    </label>
  );
}
