"use client";

import { useEffect, useState } from "react";
import { Inicio } from "@/components/pagina/inicio";
import { MarcoNegocio } from "@/components/pagina/marco";
import type { PaginaNegocio } from "@/lib/pagina/tipos";

// Rendered inside an iframe in "Mi página": receives the unsaved page from
// the editor and shows it exactly as clients would see it.
export default function VistaPreviaPage() {
  const [negocio, setNegocio] = useState<PaginaNegocio | null>(null);

  useEffect(() => {
    function recibir(e: MessageEvent) {
      if (e.origin !== window.location.origin || e.data?.tipo !== "vista-previa") return;
      setNegocio(e.data.negocio);
    }
    window.addEventListener("message", recibir);
    window.parent.postMessage({ tipo: "vista-previa-lista" }, window.location.origin);
    return () => window.removeEventListener("message", recibir);
  }, []);

  if (!negocio) return null;

  return (
    // Links are disabled so the preview never navigates away.
    <div className="flex min-h-screen flex-col" onClickCapture={(e) => e.preventDefault()}>
      <MarcoNegocio negocio={negocio}>
        <Inicio negocio={negocio} />
      </MarcoNegocio>
    </div>
  );
}
