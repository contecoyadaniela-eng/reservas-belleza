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
| `DATABASE_URL` | Supabase → **Connect → Direct → Session pooler**. Solo se usa en tu computadora para aplicar cambios y correr pruebas; **no** va en Vercel |

En Vercel, las mismas claves se cargan en **Settings → Environment Variables** del proyecto.

## Historial por etapa

### Etapa 1: Base ✅ (2 oct 2026)
- Proyecto Next.js con TypeScript y Tailwind (estilos) creado.
- Instaladas las piezas oficiales de Supabase (`@supabase/supabase-js` y `@supabase/ssr`).
- Página de inicio en español que comprueba la conexión con Supabase y muestra ✅ o ❌.
- Código en GitHub: https://github.com/contecoyadaniela-eng/reservas-belleza (privado).
- Publicado en Vercel: https://reservas-belleza.vercel.app
- Cada vez que se sube un cambio a GitHub, Vercel publica la nueva versión solo.
- **Prueba:** abrir la dirección pública y ver "Conexión con la base de datos: ✅".

### Etapa 2: Cuentas y negocios
- Tablas `negocios` y `equipo_usuarios` con seguridad por filas: cada usuaria solo ve y cambia su propio negocio.
- Los visitantes sin cuenta solo ven el nombre y la dirección del negocio (función `negocio_publico`).
- Páginas: `/registro`, `/ingresar`, `/panel` (crear negocio, ver equipo, cerrar sesión) y `/[dirección-del-negocio]`.
- "Confirm email" está apagado en Supabase mientras construimos.
- **Prueba automática:** `npm run prueba:aislamiento` crea dos negocios de prueba, comprueba que ninguno ve al otro y los borra.
- **Prueba manual:** crear dos cuentas con dos negocios; en el panel, la "Prueba de privacidad" debe mostrar 1 negocio y 1 persona en cada una.

## Cambios en la base de datos
Cada cambio es un archivo en `supabase/migrations`. Para aplicarlos en Supabase:
```
npm run db:aplicar
```
Necesita `DATABASE_URL` en `.env.local` (Supabase → Connect → Direct → Session pooler, con la contraseña de la base de datos en lugar de `[YOUR-PASSWORD]`).

## Pendientes para antes de vender
- Reactivar "Confirm email" en Supabase y enviar los correos de inicio de sesión por Resend.
- Activar la verificación en dos pasos (2FA) en GitHub y en Vercel.
- Pasar Vercel al plan Pro (el plan Hobby no permite uso comercial).
- Pasar Supabase a un plan pago para tener copias de seguridad diarias.
- Comprar un dominio propio (necesario para enviar correos a clientas con Resend).
