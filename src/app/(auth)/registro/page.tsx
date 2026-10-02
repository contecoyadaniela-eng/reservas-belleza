"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registrarse, type FormState } from "../actions";
import { Card, ErrorMessage, Field, SubmitButton } from "@/components/ui";

export default function RegistroPage() {
  const [state, action, pending] = useActionState<FormState, FormData>(registrarse, {});

  return (
    <Card>
      <h1 className="text-2xl font-semibold text-neutral-800">Crea tu cuenta</h1>
      <p className="mt-1 text-sm text-neutral-600">Para dueñas de negocios de belleza.</p>

      <form action={action} className="mt-6 space-y-4">
        <Field label="Tu nombre" name="nombre" required autoComplete="name" />
        <Field label="Correo" name="correo" type="email" required autoComplete="email" />
        <Field
          label="Contraseña"
          name="contrasena"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          hint="Mínimo 8 caracteres."
        />
        <ErrorMessage message={state.error} />
        <SubmitButton pending={pending}>Crear cuenta</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-600">
        ¿Ya tienes cuenta?{" "}
        <Link href="/ingresar" className="font-medium text-neutral-900 underline hover:underline">
          Inicia sesión
        </Link>
      </p>
    </Card>
  );
}
