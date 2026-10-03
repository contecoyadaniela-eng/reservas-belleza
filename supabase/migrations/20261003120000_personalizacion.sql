-- Etapa 3: personalización de la página, servicios, contacto y fotos.

alter table public.negocios
  add column moneda text not null default 'CLP'
    check (moneda in ('ARS', 'BOB', 'BRL', 'CLP', 'COP', 'USD', 'PYG', 'PEN', 'UYU', 'VES')),
  add column pagina jsonb not null default '{}'::jsonb,
  add column direccion text not null default '' check (char_length(direccion) <= 200),
  add column horario_texto text not null default '' check (char_length(horario_texto) <= 200),
  add column whatsapp text not null default '' check (char_length(whatsapp) <= 30),
  add column correo text not null default '' check (char_length(correo) <= 120),
  add column instagram text not null default '' check (char_length(instagram) <= 60);

-- Owners may edit their page and contact data, but never the address (slug).
revoke update on public.negocios from authenticated;
grant update (nombre, moneda, pagina, direccion, horario_texto, whatsapp, correo, instagram)
  on public.negocios to authenticated;

create table public.servicios (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references public.negocios (id) on delete cascade,
  nombre text not null check (char_length(nombre) between 1 and 80),
  descripcion text not null default '' check (char_length(descripcion) <= 300),
  duracion_min integer not null check (duracion_min between 5 and 600),
  precio numeric(12, 2) check (precio is null or precio >= 0), -- null = no mostrar precio
  foto text not null default '',
  orden integer not null default 0,
  creado_en timestamptz not null default now()
);

create index servicios_negocio_id_idx on public.servicios (negocio_id, orden);

alter table public.servicios enable row level security;

-- Services are public information shown on each business page.
create policy "servicios visibles al publico" on public.servicios
  for select to anon, authenticated using (true);

create policy "duena crea servicios" on public.servicios
  for insert to authenticated with check (public.es_duena(negocio_id));

create policy "duena edita servicios" on public.servicios
  for update to authenticated using (public.es_duena(negocio_id)) with check (public.es_duena(negocio_id));

create policy "duena borra servicios" on public.servicios
  for delete to authenticated using (public.es_duena(negocio_id));

revoke insert, update, delete, truncate on public.servicios from anon;

-- Public page data: only what clients should see.
drop function public.negocio_publico(text);

create function public.negocio_publico(p_slug text)
returns table (
  id uuid,
  nombre text,
  slug text,
  moneda text,
  pagina jsonb,
  direccion text,
  horario_texto text,
  whatsapp text,
  correo text,
  instagram text
)
language sql
stable
security definer
set search_path = ''
as $$
  select n.id, n.nombre, n.slug, n.moneda, n.pagina, n.direccion, n.horario_texto,
         n.whatsapp, n.correo, n.instagram
  from public.negocios n
  where n.slug = p_slug;
$$;

grant execute on function public.negocio_publico(text) to anon, authenticated;

-- Photos: public bucket, each business writes only inside its own folder (negocio_id/...).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('imagenes', 'imagenes', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']);

create function public.es_duena_carpeta(p_carpeta text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.equipo_usuarios
    where negocio_id::text = p_carpeta and user_id = (select auth.uid()) and rol = 'duena'
  );
$$;

create policy "duena sube fotos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'imagenes' and public.es_duena_carpeta((storage.foldername(name))[1]));

create policy "duena cambia fotos" on storage.objects
  for update to authenticated
  using (bucket_id = 'imagenes' and public.es_duena_carpeta((storage.foldername(name))[1]));

create policy "duena borra fotos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'imagenes' and public.es_duena_carpeta((storage.foldername(name))[1]));
