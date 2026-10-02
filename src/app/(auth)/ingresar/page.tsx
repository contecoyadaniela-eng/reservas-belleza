"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ingresar, type FormState } from "../actions";
import { Card, ErrorMessage, Field, SubmitButton } from "@/components/ui";

export default function IngresarPage() {
  const [state, action, pending] = useActionState<FormState, FormData>(ingresar, {});

  return (
    <Card>
      <h1 className="text-2xl font-semibold text-stone-800">Inicia sesión</h1>
      <p className="mt-1 text-sm text-stone-600">Entra al panel de tu negocio.</p>

      <form action={action} className="mt-6 space-y-4">
        <Field label="Correo" name="correo" type="email" required autoComplete="email" />
        <Field
          label="Contraseña"
          name="contrasena"
          type="password"
          required
          autoComplete="current-password"
        />
        <ErrorMessage message={state.error} />
        <SubmitButton pending={pending}>Entrar</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-stone-600">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="font-medium text-rose-600 hover:underline">
          Créala aquí
        </Link>
      </p>
    </Card>
  );
}
