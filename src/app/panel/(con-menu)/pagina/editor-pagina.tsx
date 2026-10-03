"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { guardarPagina } from "@/app/panel/actions";
import { SubirImagen } from "@/components/panel/subir-imagen";
import { AvisoBorrador, NotaBorrador } from "@/components/panel/aviso-borrador";
import { borrarBorrador, guardarBorrador, leerBorrador } from "@/lib/borrador";
import { FUENTES, type FuenteId } from "@/lib/pagina/fuentes";
import { MAX_BLOQUES, type Bloque, type PaginaConfig, type PaginaNegocio } from "@/lib/pagina/tipos";

type Colores = PaginaConfig["colores"];

const PALETAS: { nombre: string; colores: Colores }[] = [
  { nombre: "Editorial", colores: { fondo: "#ffffff", fondoSuave: "#f4f4f5", texto: "#111111", titulos: "#111111", acento: "#d2234d", boton: "#111111", botonTexto: "#ffffff", anuncioFondo: "#111111", anuncioTexto: "#ffffff" } },
  { nombre: "Rosa palo", colores: { fondo: "#fffafa", fondoSuave: "#f9e4e6", texto: "#3b2a2c", titulos: "#3b2a2c", acento: "#c45a6b", boton: "#c45a6b", botonTexto: "#ffffff", anuncioFondo: "#c45a6b", anuncioTexto: "#ffffff" } },
  { nombre: "Nude", colores: { fondo: "#faf7f2", fondoSuave: "#efe6da", texto: "#3d342c", titulos: "#3d342c", acento: "#a47148", boton: "#3d342c", botonTexto: "#faf7f2", anuncioFondo: "#3d342c", anuncioTexto: "#faf7f2" } },
  { nombre: "Lavanda", colores: { fondo: "#fbfaff", fondoSuave: "#ece8f7", texto: "#2e2a3d", titulos: "#2e2a3d", acento: "#7c5cbf", boton: "#2e2a3d", botonTexto: "#ffffff", anuncioFondo: "#2e2a3d", anuncioTexto: "#ffffff" } },
  { nombre: "Salvia", colores: { fondo: "#f9faf7", fondoSuave: "#e4eadf", texto: "#2b3327", titulos: "#2b3327", acento: "#6b8f5e", boton: "#2b3327", botonTexto: "#ffffff", anuncioFondo: "#2b3327", anuncioTexto: "#ffffff" } },
  { nombre: "Noche", colores: { fondo: "#141414", fondoSuave: "#222222", texto: "#f4f1ec", titulos: "#f4f1ec", acento: "#e8b4b8", boton: "#e8b4b8", botonTexto: "#141414", anuncioFondo: "#e8b4b8", anuncioTexto: "#141414" } },
];

const NOMBRES_COLORES: { clave: keyof Colores; nombre: string; ayuda: string }[] = [
  { clave: "fondo", nombre: "Fondo", ayuda: "Color principal de la página" },
  { clave: "fondoSuave", nombre: "Fondo secundario", ayuda: "Bloques grises y galería" },
  { clave: "titulos", nombre: "Títulos", ayuda: "Títulos, nombres de servicios y del negocio" },
  { clave: "texto", nombre: "Texto", ayuda: "Párrafos y descripciones" },
  { clave: "acento", nombre: "Acento", ayuda: "Título manuscrito de la galería" },
  { clave: "boton", nombre: "Botones", ayuda: "Fondo de los botones" },
  { clave: "botonTexto", nombre: "Texto de botones", ayuda: "Letras dentro de los botones" },
  { clave: "anuncioFondo", nombre: "Barra de anuncio", ayuda: "Fondo de la barra de arriba" },
  { clave: "anuncioTexto", nombre: "Texto de la barra", ayuda: "Letras de la barra de arriba" },
];

type DatosBorrador = { nombre: string; pagina: PaginaConfig };

// A draft saved by an older version may lack newer fields: fill them from the published page.
function mezclarConPublicada(publicada: PaginaConfig, borrador: Partial<PaginaConfig>): PaginaConfig {
  const resultado = { ...publicada } as Record<string, unknown>;
  for (const [clave, valor] of Object.entries(borrador)) {
    const base = resultado[clave];
    resultado[clave] =
      base && typeof base === "object" && !Array.isArray(base) && valor && typeof valor === "object" && !Array.isArray(valor)
        ? { ...base, ...valor }
        : valor;
  }
  return resultado as PaginaConfig;
}

export function EditorPagina({ negocio }: { negocio: PaginaNegocio }) {
  const claveBorrador = `borrador-pagina-${negocio.id}`;
  const [nombre, setNombre] = useState(negocio.nombre);
  const [pagina, setPagina] = useState<PaginaConfig>(negocio.pagina);
  const [sinGuardar, setSinGuardar] = useState(false);
  const [borradorDe, setBorradorDe] = useState<string | null>(null);
  const [estado, setEstado] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);
  const [guardando, setGuardando] = useState(false);

  // Restore unpublished edits from this browser after a reload.
  useEffect(() => {
    const b = leerBorrador<DatosBorrador>(claveBorrador);
    if (!b) return;
    /* eslint-disable react-hooks/set-state-in-effect -- localStorage only exists in the browser, after the first render */
    setNombre(b.datos.nombre ?? negocio.nombre);
    setPagina(mezclarConPublicada(negocio.pagina, b.datos.pagina ?? {}));
    setSinGuardar(true);
    setBorradorDe(b.fecha);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [claveBorrador, negocio]);

  useEffect(() => {
    if (sinGuardar) guardarBorrador<DatosBorrador>(claveBorrador, { nombre, pagina });
  }, [sinGuardar, nombre, pagina, claveBorrador]);

  const cambiar = useCallback((fn: (p: PaginaConfig) => PaginaConfig) => {
    setPagina(fn);
    setSinGuardar(true);
    setEstado(null);
  }, []);

  function descartar() {
    if (!confirm("¿Descartar los cambios sin publicar y volver a la versión publicada?")) return;
    borrarBorrador(claveBorrador);
    setNombre(negocio.nombre);
    setPagina(negocio.pagina);
    setSinGuardar(false);
    setBorradorDe(null);
    setEstado(null);
  }

  async function publicar() {
    setGuardando(true);
    const r = await guardarPagina({ nombre, pagina });
    setGuardando(false);
    if (r.ok) {
      borrarBorrador(claveBorrador);
      setSinGuardar(false);
      setBorradorDe(null);
      setEstado({ tipo: "ok", texto: "¡Publicado! Tus clientas ya ven los cambios." });
    } else {
      setEstado({ tipo: "error", texto: r.error ?? "No se pudo guardar." });
    }
  }

  const cambiarBloque = (i: number, cambios: Partial<Bloque>) =>
    cambiar((p) => ({ ...p, bloques: p.bloques.map((b, j) => (j === i ? { ...b, ...cambios } : b)) }));

  function agregarBloque() {
    cambiar((p) => {
      const ultimo = p.bloques[p.bloques.length - 1];
      const nuevo: Bloque = {
        id: `bloque-${crypto.randomUUID().slice(0, 8)}`,
        lado: ultimo?.lado === "izquierda" ? "derecha" : "izquierda",
        titulo: "Nuevo título",
        texto: "Escribe aquí el texto de esta sección.",
        boton: "Ver servicios",
        enlace: "servicios",
        imagen: ultimo?.imagen ?? negocio.pagina.portada.imagenes[0],
      };
      return { ...p, bloques: [...p.bloques, nuevo] };
    });
  }

  function quitarBloque(i: number) {
    if (!confirm(`¿Quitar la sección ${i + 1}? Se quitará de tu página cuando publiques.`)) return;
    cambiar((p) => ({ ...p, bloques: p.bloques.filter((_, j) => j !== i) }));
  }

  function moverBloque(i: number, direccion: -1 | 1) {
    cambiar((p) => {
      const destino = i + direccion;
      if (destino < 0 || destino >= p.bloques.length) return p;
      const copia = [...p.bloques];
      [copia[i], copia[destino]] = [copia[destino], copia[i]];
      return { ...p, bloques: copia };
    });
  }

  const vistaNegocio: PaginaNegocio = { ...negocio, nombre, pagina };

  return (
    <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
      <div className="space-y-3">
        {borradorDe && <AvisoBorrador fecha={borradorDe} onDescartar={descartar} />}
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
          <div className="flex border border-neutral-300 text-[11px] uppercase tracking-[0.12em]">
            {(["una", "dos"] as const).map((modo) => (
              <button
                key={modo}
                type="button"
                onClick={() => cambiar((p) => ({ ...p, portada: { ...p.portada, modo } }))}
                className={`flex-1 px-3 py-2 ${pagina.portada.modo === modo ? "bg-neutral-900 text-white" : "bg-white"}`}
              >
                {modo === "una" ? "Una foto" : "Dos fotos"}
              </button>
            ))}
          </div>
          <div className={`grid gap-3 ${pagina.portada.modo === "dos" ? "grid-cols-2" : ""}`}>
            {(pagina.portada.modo === "dos" ? [0, 1] : [0]).map((i) => (
              <SubirImagen
                key={i}
                vertical
                negocioId={negocio.id}
                etiqueta={pagina.portada.modo === "una" ? "Foto de portada" : i === 0 ? "Foto izquierda" : "Foto derecha"}
                valor={pagina.portada.imagenes[i]}
                proporcion={pagina.portada.modo === "una" ? "aspect-[16/9]" : "aspect-[4/5]"}
                aspecto={pagina.portada.modo === "una" ? 16 / 9 : 4 / 5}
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

        <Grupo titulo={`Secciones de contenido (${pagina.bloques.length})`}>
          <p className="text-xs text-neutral-500">
            Van entre los servicios y la galería. Agrega, quita u ordena las que quieras (hasta {MAX_BLOQUES}).
          </p>
          {pagina.bloques.map((b, i) => (
            <div key={b.id} className="space-y-4 border border-neutral-200 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em]">Sección {i + 1}</p>
                <div className="flex items-center gap-1 text-sm">
                  <button type="button" onClick={() => moverBloque(i, -1)} disabled={i === 0} className="px-2 py-1 hover:bg-neutral-100 disabled:opacity-30" title="Subir">↑</button>
                  <button type="button" onClick={() => moverBloque(i, 1)} disabled={i === pagina.bloques.length - 1} className="px-2 py-1 hover:bg-neutral-100 disabled:opacity-30" title="Bajar">↓</button>
                  <button type="button" onClick={() => quitarBloque(i)} className="ml-2 px-2 py-1 text-xs text-red-700 underline">Quitar</button>
                </div>
              </div>
              <Opciones
                valor={b.lado}
                opciones={[["izquierda", "Foto a la izquierda"], ["derecha", "Foto a la derecha"]]}
                onCambio={(v) => cambiarBloque(i, { lado: v })}
              />
              <SubirImagen
                negocioId={negocio.id}
                etiqueta="Foto"
                valor={b.imagen}
                proporcion={b.lado === "izquierda" ? "aspect-[4/3]" : "aspect-[4/5]"}
                aspecto={b.lado === "izquierda" ? 4 / 3 : 4 / 5}
                onCambio={(url) => cambiarBloque(i, { imagen: url })}
              />
              <Texto etiqueta="Título" valor={b.titulo} max={80} onCambio={(v) => cambiarBloque(i, { titulo: v })} />
              <AreaTexto etiqueta="Texto" valor={b.texto} max={400} onCambio={(v) => cambiarBloque(i, { texto: v })} />
              <div className="grid grid-cols-2 gap-3">
                <Texto etiqueta="Botón (vacío = sin botón)" valor={b.boton} max={30} onCambio={(v) => cambiarBloque(i, { boton: v })} />
                <label className="block">
                  <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-600">El botón lleva a</span>
                  <select value={b.enlace} onChange={(e) => cambiarBloque(i, { enlace: e.target.value as Bloque["enlace"] })} className={claseCampo}>
                    <option value="servicios">Servicios</option>
                    <option value="reservar">Reservar</option>
                    <option value="contacto">Contacto</option>
                  </select>
                </label>
              </div>
            </div>
          ))}
          {pagina.bloques.length < MAX_BLOQUES && (
            <button
              type="button"
              onClick={agregarBloque}
              className="w-full border border-dashed border-neutral-400 py-3 text-[11px] uppercase tracking-[0.18em] hover:border-neutral-900"
            >
              + Agregar sección
            </button>
          )}
        </Grupo>

        <Grupo titulo="Galería">
          <Texto etiqueta="Título manuscrito" valor={pagina.galeria.titulo} max={80} onCambio={(v) => cambiar((p) => ({ ...p, galeria: { ...p.galeria, titulo: v } }))} />
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <SubirImagen
                key={i}
                vertical
                negocioId={negocio.id}
                etiqueta={`Foto ${i + 1}`}
                valor={pagina.galeria.imagenes[i]}
                proporcion="aspect-[4/5]"
                aspecto={4 / 5}
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
          {sinGuardar && <NotaBorrador />}
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

function Opciones<T extends string>({
  valor,
  opciones,
  onCambio,
}: {
  valor: T;
  opciones: [T, string][];
  onCambio: (v: T) => void;
}) {
  return (
    <div className="flex border border-neutral-300 text-[11px] uppercase tracking-[0.12em]">
      {opciones.map(([v, texto]) => (
        <button
          key={v}
          type="button"
          onClick={() => onCambio(v)}
          className={`flex-1 px-3 py-2 ${valor === v ? "bg-neutral-900 text-white" : "bg-white"}`}
        >
          {texto}
        </button>
      ))}
    </div>
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
