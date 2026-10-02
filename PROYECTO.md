# Plan de proyecto: plataforma de reservas y fidelización para salones de belleza

2 oct 2026 · @Daniela

## Visión

Construir una plataforma de reservas y fidelización para negocios de belleza (uñas, peluquería, maquillaje, spa), que se vende por suscripción mensual a cada negocio.

Cada negocio tiene su propia cuenta, con su marca, su equipo y su agenda, separados de los demás. La clienta reserva sola en una página pública, la hora se bloquea al instante y recibe confirmación y recordatorio. Así el negocio ahorra tiempo y pierde menos citas.

Ya existe un prototipo de una sola página (HTML) que sirve como demo y como referencia de diseño y comportamiento. Este proyecto lo reemplaza con una base de datos real.

## Cómo trabajar conmigo

Soy emprendedora y nunca he programado. Estas reglas valen durante todo el proyecto:

- Explícame cada paso en palabras simples. Si usas un término técnico, defínelo en una frase.
- Trabaja por las etapas de este documento. Al terminar cada una, dime exactamente cómo probarla y qué debería ver.
- Antes de instalar algo, crear cuentas o ejecutar comandos que cambien cosas, dime qué hará y pídeme confirmación.
- Nunca me pidas pegar contraseñas o claves en el chat. Dime en qué archivo guardarlas (un archivo .env) y cómo.
- Si hay varias opciones, recomienda una y explica por qué en dos frases.
- Los textos que ve el público van en español. Los nombres internos del código pueden ir en inglés.
- Si algo falla, explica qué pasó y arréglalo tú. No me pidas depurar.
- Mantén un archivo README con cómo iniciar el proyecto y qué se hizo en cada etapa.

## Tecnología

La recomendación es usar herramientas ya hechas y con plan gratuito para empezar, para no mantener servidores propios.

| Pieza | Herramienta | Para qué sirve |
|---|---|---|
| Páginas y lógica | Next.js con TypeScript | Página pública de reservas y panel del negocio |
| Base de datos y cuentas | Supabase (PostgreSQL y Auth) | Guardar datos separados por negocio y manejar el inicio de sesión |
| Publicación | Vercel | Poner la página en internet |
| Correos | Resend | Confirmaciones de reserva |
| WhatsApp | API oficial de WhatsApp Business (Meta) o un proveedor como Twilio | Recordatorios automáticos |
| Cobro de la suscripción | Stripe u otra pasarela según el país | Etapa posterior |
| Código | GitHub | Respaldo e historial del proyecto |

Cuentas que hay que crear al empezar: GitHub, Supabase, Vercel y Resend. Verificar las condiciones del plan gratuito de cada una al registrarse.

La API de WhatsApp exige verificar el negocio y aprobar las plantillas de mensajes, y eso puede tardar. Conviene iniciar el trámite pronto. Mientras tanto, los recordatorios pueden salir como enlace de WhatsApp para enviar a mano.

**Decisión pendiente:** la pasarela de cobro de la suscripción depende del país donde se venda.

## Usuarios y permisos

Hay cuatro tipos de usuario. La clienta nunca necesita crear una cuenta ni una contraseña.

| Rol | Qué puede hacer |
|---|---|
| Dueña del negocio | Todo en su negocio: marca, servicios, equipo, horarios de todas, agenda completa, clientas, premios, reportes y pagos |
| Profesional | Ver su propia agenda, editar sus horarios y días libres, marcar citas como hechas |
| Clienta (sin cuenta) | Ver servicios y horas libres, reservar, cancelar o reprogramar con un enlace personal, ver su tarjeta de sellos con otro enlace |
| Administradora de la plataforma | Crear y gestionar negocios, ver el uso y dar soporte (es quien vende el producto) |

**Regla principal:** cada negocio solo ve sus propios datos y los de nadie más.

## Funciones y reglas del negocio

El prototipo ya probó estas ideas. Aquí quedan como reglas para construirlas de verdad.

### Reservas

- La clienta elige servicio, profesional (o "cualquiera"), fecha y una hora de la lista de horas libres.
- Horas libres = horario de la profesional, menos sus días libres, menos las citas ya tomadas, ajustado a la duración del servicio.
- Al confirmar, la hora se bloquea al instante. Dos clientas no pueden tomar la misma hora, aunque reserven a la vez: la base de datos debe impedirlo.
- Datos de la clienta: nombre, teléfono, correo (opcional) y notas.
- La clienta puede cancelar o reprogramar con su enlace personal hasta cierto número de horas antes (configurable por negocio).
- Opción por negocio para atender a domicilio: en ese caso se pide la dirección al reservar.

### Equipo y horarios

- Cada profesional tiene sus días de atención, hora de inicio y fin, cada cuántos minutos atiende y sus días libres.
- Cada profesional edita su propio horario sin pedir permiso a la dueña.

### Tarjeta de fidelización (una por clienta)

- Cantidad de sellos configurable por negocio.
- Varios premios, cada uno en un sello concreto (por ejemplo, 10% de descuento en el sello 4 y servicio gratis en el 8).
- Se puede cambiar el emoji del sello, la forma (círculo o cuadrado redondeado) y los colores de la tarjeta y de los sellos.
- Al marcar una cita como hecha, se suma un sello. La profesional entrega cada premio con un botón, y la tarjeta se reinicia al completarla.
- Cada clienta tiene un enlace personal para ver sus sellos y premios.

### Precios y pagos

- Mostrar u ocultar precios, para todo el negocio o servicio por servicio.
- Enlace de pago o adelanto opcional, visible al reservar y en el correo de confirmación.

### Personalización por negocio

- Nombre, logo, paletas de colores, color de fondo, foto de portada, galería de trabajos y foto por servicio.
- Datos de contacto: dirección, horario en texto, WhatsApp, correo e Instagram.

### Panel del negocio

- Agenda del día y de la semana, con opciones para marcar hecha, cancelada o "no vino".
- Lista de clientas con sus sellos.
- Reporte simple: citas por semana, ausencias y clientas más frecuentes.

## Modelo de datos

Todas las tablas llevan el campo negocio_id, y la base de datos aplica seguridad por filas: una usuaria solo lee y escribe filas de su propio negocio.

| Tabla | Campos principales |
|---|---|
| negocios | id, nombre, slug (la dirección web propia), logo, colores, fondo, moneda, mostrar_precios, whatsapp, correo, link_de_pago, dirección, horario_texto, instagram, sellos_total, forma_sello, emoji_sello, color_tarjeta, color_sellos |
| equipo_usuarios | id, negocio_id, rol (dueña o profesional), nombre, correo |
| profesionales | id, negocio_id, nombre, emoji, activa |
| horarios | id, profesional_id, día_semana, desde, hasta, intervalo_min |
| dias_libres | id, profesional_id, fecha |
| servicios | id, negocio_id, nombre, emoji, duración_min, precio (0 = no mostrar), foto |
| imagenes | id, negocio_id, tipo (portada o galería), archivo |
| clientas | id, negocio_id, nombre, teléfono, correo, sellos, ciclo, token_enlace |
| citas | id, negocio_id, profesional_id, servicio_id, clienta_id, fecha, hora_inicio, hora_fin, estado, notas, dirección |
| premios | id, negocio_id, sello_número, emoji, texto |
| premios_entregados | id, clienta_id, premio_id, ciclo, fecha |

Estados de una cita: pendiente, confirmada, hecha, cancelada, no vino.

Para evitar dos reservas a la misma hora, la tabla citas debe tener una restricción en la base de datos que impida horarios que se solapen para la misma profesional.

## Notificaciones

Los mensajes automáticos son lo que más valor da al negocio, porque reducen las citas perdidas.

- Confirmación inmediata por correo a la clienta, con servicio, fecha, hora, profesional, enlace para cancelar y enlace de pago si existe.
- Aviso a la dueña y a la profesional cuando entra una reserva nueva.
- Recordatorio por WhatsApp 24 horas antes, con enlace para confirmar o cancelar.
- Opcional: mensaje al marcar la cita como hecha, con la tarjeta de sellos actualizada.
- Los envíos se programan con tareas automáticas y cada mensaje guarda su estado: enviado o fallido.

En WhatsApp hay tres condiciones: las plantillas de mensaje las aprueba Meta, la clienta debe aceptar recibir mensajes, y cada mensaje tiene un costo que se traslada al plan del negocio.

Mientras se aprueba la API de WhatsApp, el sistema puede mostrar un botón "Enviar recordatorio" que abre WhatsApp con el mensaje ya escrito.

## Seguridad y privacidad

El producto guardará nombres, teléfonos y correos de clientas de otras empresas, así que la privacidad es parte del producto.

- Seguridad por filas: un negocio nunca ve datos de otro. Probarlo con dos negocios de prueba.
- Los enlaces personales de las clientas usan un código aleatorio largo, nunca el número de teléfono.
- Las contraseñas del equipo las maneja Supabase Auth. Las clientas no tienen contraseña.
- Las claves y secretos van solo en variables de entorno, nunca dentro del código ni en GitHub.
- Copias de seguridad automáticas de la base de datos.
- Debe poder borrarse todos los datos de una clienta si lo pide.
- Pedir consentimiento a la clienta para contactarla por WhatsApp y correo.
- Redactar términos de servicio y política de privacidad antes de vender.

**Pendiente:** revisar con una persona experta la ley de protección de datos del país donde se venderá.

## Etapas de construcción

Se construye en diez etapas. Regla: no pasar a la siguiente hasta que la prueba de la actual funcione.

1. **Base.** Proyecto Next.js conectado a Supabase y publicado en Vercel con una página de inicio. Prueba: la página abre desde una dirección web pública.
2. **Cuentas y negocios.** Registro e inicio de sesión de la dueña; crear un negocio con su dirección propia. Prueba: dos negocios de prueba no ven los datos del otro.
3. **Personalización.** Marca, colores, servicios, precios opcionales y fotos. Prueba: cambiar un color y un servicio y verlos en la página pública.
4. **Equipo y horarios.** Profesionales, horarios y días libres editables por cada una. Prueba: una profesional cambia su horario y la página pública muestra las horas nuevas.
5. **Reservas.** Reserva pública con bloqueo de hora. Prueba: dos personas intentan reservar la misma hora a la vez y solo una lo logra.
6. **Agenda y panel.** Agenda diaria y semanal; marcar hecha, cancelada o "no vino". Prueba: cancelar una cita libera la hora.
7. **Tarjeta de fidelización.** Sellos, varios premios, entrega y enlace personal. Prueba: completar la tarjeta, entregar los premios y verla reiniciada.
8. **Notificaciones.** Correo de confirmación y recordatorio por WhatsApp. Prueba: hacer una reserva de prueba y recibir ambos mensajes.
9. **Pagos y reportes.** Enlace de pago o adelanto y reportes simples. Después, el cobro de la suscripción a cada negocio.
10. **Piloto.** Dos o tres negocios reales usan el sistema gratis por unas semanas. Se ajusta lo que falte y se fija el precio.
