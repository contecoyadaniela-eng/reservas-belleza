"use client";

import { useActionState, useState } from "react";
import { crearNegocio } from "./actions";
import type { FormState } from "@/app/(auth)/actions";
import { ErrorMessage, Field, SubmitButton } from "@/components/ui";
import { toSlug } from "@/lib/slug";

export function CrearNegocioForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(crearNegocio, {});
  const [nombre, setNombre] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEditado, setSlugEditado] = useState(false);

  const slugMostrado = slugEditado ? slug : toSlug(nombre);

  return (
    <form action={action} className="mt-6 space-y-4">
      <Field
        label="Nombre del negocio"
        name="nombre"
        required
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Uñas de Sofí"
      />
      <Field
        label="Dirección de tu página"
        name="slug"
        required
        value={slugMostrado}
        onChange={(e) => {
          setSlugEditado(true);
          setSlug(toSlug(e.target.value));
        }}
        hint={`Tu página será: reservas-belleza.vercel.app/${slugMostrado || "tu-negocio"}`}
      />
      <ErrorMessage message={state.error} />
      <SubmitButton pending={pending}>Crear mi negocio</SubmitButton>
    </form>
  );
}
