"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error?: string };

export async function registrarse(_prev: FormState, formData: FormData): Promise<FormState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const correo = String(formData.get("correo") ?? "").trim();
  const contrasena = String(formData.get("contrasena") ?? "");

  if (nombre.length < 2) return { error: "Escribe tu nombre." };
  if (contrasena.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: correo,
    password: contrasena,
    options: { data: { nombre } },
  });

  if (error) {
    if (error.code === "user_already_exists") {
      return { error: "Ya existe una cuenta con ese correo. Inicia sesión." };
    }
    if (error.code === "weak_password") return { error: "Esa contraseña es muy débil. Prueba con otra." };
    if (error.code === "over_email_send_rate_limit") {
      return { error: "Se enviaron demasiados correos. Espera unos minutos e intenta de nuevo." };
    }
    return { error: "No se pudo crear la cuenta. Revisa el correo e intenta de nuevo." };
  }

  // With email confirmation on, there is no session until the link is clicked.
  if (!data.session) {
    return { error: "Te enviamos un correo para confirmar tu cuenta. Ábrelo y luego inicia sesión." };
  }

  redirect("/panel");
}

export async function ingresar(_prev: FormState, formData: FormData): Promise<FormState> {
  const correo = String(formData.get("correo") ?? "").trim();
  const contrasena = String(formData.get("contrasena") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: correo, password: contrasena });

  if (error) {
    if (error.code === "email_not_confirmed") {
      return { error: "Primero confirma tu correo con el enlace que te enviamos." };
    }
    return { error: "Correo o contraseña incorrectos." };
  }

  redirect("/panel");
}

export async function salir() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/ingresar");
}
