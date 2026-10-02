-- Etapa 2: negocios, equipo y seguridad por filas.

create table public.negocios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(nombre) between 2 and 80),
  slug text not null unique
    check (char_length(slug) between 3 and 40 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  creado_en timestamptz not null default now()
);

create table public.equipo_usuarios (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references public.negocios (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  rol text not null check (rol in ('duena', 'profesional')),
  nombre text not null,
  correo text not null,
  creado_en timestamptz not null default now(),
  unique (negocio_id, user_id)
);

create index equipo_usuarios_user_id_idx on public.equipo_usuarios (user_id);

-- Row level security: nothing is readable unless a policy allows it.
alter table public.negocios enable row level security;
alter table public.equipo_usuarios enable row level security;

-- Visitors without an account never touch these tables directly.
revoke all on public.negocios from anon;
revoke all on public.equipo_usuarios from anon;

-- Helpers run as definer so policies can check membership without
-- recursing into equipo_usuarios' own policies.
create function public.es_miembro(p_negocio_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.equipo_usuarios
    where negocio_id = p_negocio_id and user_id = (select auth.uid())
  );
$$;

create function public.es_duena(p_negocio_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.equipo_usuarios
    where negocio_id = p_negocio_id and user_id = (select auth.uid()) and rol = 'duena'
  );
$$;

create policy "miembros ven su negocio" on public.negocios
  for select to authenticated using (public.es_miembro(id));

create policy "duena edita su negocio" on public.negocios
  for update to authenticated using (public.es_duena(id)) with check (public.es_duena(id));

create policy "miembros ven su equipo" on public.equipo_usuarios
  for select to authenticated using (public.es_miembro(negocio_id));

-- Creating a business inserts into both tables atomically, so it goes
-- through this function instead of direct insert policies.
create function public.crear_negocio(p_nombre text, p_slug text, p_nombre_duena text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_correo text := auth.jwt() ->> 'email';
  v_negocio uuid;
begin
  if v_user is null then
    raise exception 'sin_sesion';
  end if;

  if exists (select 1 from public.equipo_usuarios where user_id = v_user and rol = 'duena') then
    raise exception 'ya_tiene_negocio';
  end if;

  if p_slug in ('panel', 'ingresar', 'registro', 'salir', 'api', 'admin', 'reservar', 'cita', 'tarjeta') then
    raise exception 'slug_reservado';
  end if;

  begin
    insert into public.negocios (nombre, slug)
    values (trim(p_nombre), p_slug)
    returning id into v_negocio;
  exception when unique_violation then
    raise exception 'slug_ocupado';
  end;

  insert into public.equipo_usuarios (negocio_id, user_id, rol, nombre, correo)
  values (v_negocio, v_user, 'duena', trim(p_nombre_duena), coalesce(v_correo, ''));

  return p_slug;
end;
$$;

revoke execute on function public.crear_negocio(text, text, text) from public, anon;
grant execute on function public.crear_negocio(text, text, text) to authenticated;

-- Public booking page: exposes only the public columns of one business.
create function public.negocio_publico(p_slug text)
returns table (nombre text, slug text)
language sql
stable
security definer
set search_path = ''
as $$
  select n.nombre, n.slug from public.negocios n where n.slug = p_slug;
$$;

grant execute on function public.negocio_publico(text) to anon, authenticated;
