"use client";

import Link from "next/link";
import { useActionState } from "react";
import { guardarContacto, type Resultado } from "@/app/panel/actions";
import { Caja, ErrorMessage, Field, SubmitButton } from "@/components/ui";
import type { Contacto } from "@/lib/pagina/tipos";

export function FormContacto({ slug, contacto }: { slug: string; contacto: Contacto }) {
  const [estado, action, pending] = useActionState<Resultado, FormData>(guardarContacto, {});

  return (
    <div className="mx-auto max-w-xl">
      <Caja titulo="Datos de contacto">
        <p className="mb-6 text-sm text-neutral-600">
          Aparecen en la sección Contacto y al pie de tu página. Los campos vacíos no se muestran.
        </p>
        <form action={action} className="space-y-5">
          <Field label="Dirección" name="direccion" defaultValue={contacto.direccion} maxLength={200} placeholder="Av. Principal 123, local 4, Ciudad" />
          <Field label="Horario" name="horario_texto" defaultValue={contacto.horarioTexto} maxLength={200} placeholder="Lunes a viernes 10:00–19:00 · Sábado 10:00–14:00" />
          <Field label="WhatsApp" name="whatsapp" defaultValue={contacto.whatsapp} maxLength={30} inputMode="tel" placeholder="+56 9 1234 5678" hint="Con el código del país, para que funcione el botón de WhatsApp." />
          <Field label="Correo" name="correo" type="email" defaultValue={contacto.correo} maxLength={120} placeholder="hola@tunegocio.com" />
          <Field label="Instagram" name="instagram" defaultValue={contacto.instagram} maxLength={60} placeholder="@tunegocio" />
          {estado.ok && <p className="bg-emerald-50 px-3 py-2 text-sm text-emerald-800">¡Contacto publicado!</p>}
          <ErrorMessage message={estado.error} />
          <SubmitButton pending={pending}>Guardar y publicar</SubmitButton>
        </form>
        <Link href={`/${slug}/contacto`} target="_blank" className="mt-4 block text-center text-[11px] uppercase tracking-[0.15em] text-neutral-600 underline-offset-4 hover:underline">
          Ver en mi página ↗
        </Link>
      </Caja>
    </div>
  );
}
