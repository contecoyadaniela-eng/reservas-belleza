# Reservas de belleza

Plataforma de reservas y fidelización para negocios de belleza. El plan completo está en [PROYECTO.md](PROYECTO.md).

## Cómo iniciar el proyecto en tu computadora

1. Abre la carpeta `C:\proyectos\reservas-belleza` en una terminal.
2. La primera vez (o si cambian las piezas instaladas), ejecuta:
   ```
   npm install
   ```
3. Asegúrate de tener el archivo `.env.local` con tus claves (ver abajo).
4. Inicia el proyecto:
   ```
   npm run dev
   ```
5. Abre http://localhost:3000 en el navegador.

## Claves secretas (.env.local)

Las claves van en el archivo `.env.local`, que **nunca** se sube a GitHub. El archivo `.env.example` muestra qué claves se necesitan, sin sus valores.

| Clave | Dónde se encuentra |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → tu proyecto → botón **Connect** (arriba) → pestaña **App Frameworks**; o **Project Settings → Data API** |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → **Project Settings → API Keys** → *Publishable key* (empieza con `sb_publishable_`) |

En Vercel, las mismas claves se cargan en **Settings → Environment Variables** del proyecto.

## Historial por etapa

### Etapa 1: Base (en curso)
- Proyecto Next.js con TypeScript y Tailwind (estilos) creado.
- Instaladas las piezas oficiales de Supabase (`@supabase/supabase-js` y `@supabase/ssr`).
- Página de inicio en español que comprueba la conexión con Supabase y muestra ✅ o ❌.
- Pendiente: subir a GitHub y publicar en Vercel.
