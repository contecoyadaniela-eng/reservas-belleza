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

### Etapa 2: Cuentas y negocios ✅ (2 oct 2026)
- Tablas `negocios` y `equipo_usuarios` con seguridad por filas: cada usuaria solo ve y cambia su propio negocio.
- Los visitantes sin cuenta solo ven el nombre y la dirección del negocio (función `negocio_publico`).
- Páginas: `/registro`, `/ingresar`, `/panel` (crear negocio, ver equipo, cerrar sesión) y `/[dirección-del-negocio]`.
- "Confirm email" está apagado en Supabase mientras construimos.
- **Prueba automática:** `npm run prueba:aislamiento` crea dos negocios de prueba, comprueba que ninguno ve al otro y los borra.
- **Prueba manual:** crear dos cuentas con dos negocios; en el panel, la "Prueba de privacidad" debe mostrar 1 negocio y 1 persona en cada una.

### Etapa 3: Personalización (en prueba)
- Página pública con estructura fija para todos los negocios, estilo editorial: **Inicio · Servicios · Reservar · Mi tarjeta · Contacto**.
- Panel con menú **Resumen · Mi página · Servicios · Contacto**.
- **Mi página:** nombre, logo, 6 paletas listas o 9 colores a mano, 3 tipos de letra, barra de anuncio, portada de una o dos fotos, **secciones de contenido libres** (agregar, quitar y ordenar hasta 8, con foto a la izquierda o a la derecha) y galería, con vista previa en vivo (computadora o celular) y botón "Guardar y publicar".
- Los cambios sin publicar se guardan como borrador en el navegador y se recuperan al recargar.
- **Servicios:** agregar, quitar y ordenar; nombre, descripción, foto, duración y precio opcional (vacío = no se muestra); moneda de cualquier país de Sudamérica.
- **Contacto:** dirección, horario, WhatsApp, correo e Instagram (los vacíos no se muestran).
- Fotos en Supabase Storage (carpeta por negocio); se achican en el navegador antes de subir.
- Un negocio nuevo empieza con textos y fotos de ejemplo (Unsplash) para que su página nunca se vea vacía.
- Reservar y Mi tarjeta muestran contenido provisorio hasta las Etapas 5 y 7.
- **Prueba automática:** `npm run prueba:aislamiento` ahora revisa 21 reglas (páginas, servicios, fotos y dirección web).
- **Prueba manual:** cambiar un color y un servicio en el panel de Ana y verlos en su página pública.

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

## Datos de prueba
- Negocios de prueba creados en la Etapa 2: **Uñas de Ana** (/unas-de-ana) y **peluqueria bea** (/peluqueria-bea), con correos contecoyadaniela+ana@gmail.com y contecoyadaniela+bea@gmail.com. Se borrarán antes del piloto.
