-- =============================================================================
-- Mutavaatir admins
-- -----------------------------------------------------------------------------
-- Adds a `public.admins` allow-list keyed to `auth.users(id)`. A user is an
-- admin iff a row in this table exists for them. A SECURITY DEFINER helper
-- `public.is_admin(uid)` is exposed so app code (and other RLS policies) can
-- gate on admin status without leaking the table itself.
--
-- Bootstrap: the very first admin must be inserted with the `postgres` /
-- service role (e.g. via the Supabase SQL editor) because RLS only lets
-- existing admins promote new ones.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table
-- -----------------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'admin'
             check (role in ('admin', 'superadmin')),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  notes      text
);

comment on table public.admins is
  'Allow-list of users with access to the Mutavaatir admin panel. '
  'Row presence grants access; row absence denies it.';

comment on column public.admins.user_id    is 'FK to auth.users(id). Cascades on user deletion.';
comment on column public.admins.role       is 'Admin role tier. ''admin'' or ''superadmin''.';
comment on column public.admins.created_by is 'Admin who promoted this user (nullable for bootstrap).';

-- -----------------------------------------------------------------------------
-- Helper: public.is_admin(uid)
-- -----------------------------------------------------------------------------
-- SECURITY DEFINER so non-admin callers can ask "am I an admin?" without
-- needing direct read access to the table. `search_path = ''` prevents
-- search_path hijacking attacks against SECURITY DEFINER functions.
create or replace function public.is_admin(uid uuid default auth.uid())
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.admins
    where user_id = uid
  );
$$;

comment on function public.is_admin(uuid) is
  'Returns true if the given user id (defaults to auth.uid()) is in public.admins.';

revoke all on function public.is_admin(uuid) from public;
grant execute on function public.is_admin(uuid) to anon, authenticated;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.admins enable row level security;

-- Admins can see who else is an admin.
drop policy if exists "admins_select" on public.admins;
create policy "admins_select"
  on public.admins
  for select
  to authenticated
  using (public.is_admin(auth.uid()));

-- Admins can promote new admins. created_by is forced to the caller.
drop policy if exists "admins_insert" on public.admins;
create policy "admins_insert"
  on public.admins
  for insert
  to authenticated
  with check (
    public.is_admin(auth.uid())
    and (created_by is null or created_by = auth.uid())
  );

-- Admins can edit admin metadata (role, notes).
drop policy if exists "admins_update" on public.admins;
create policy "admins_update"
  on public.admins
  for update
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Admins can demote others, but not themselves (last-admin lockout safety).
drop policy if exists "admins_delete" on public.admins;
create policy "admins_delete"
  on public.admins
  for delete
  to authenticated
  using (
    public.is_admin(auth.uid())
    and user_id <> auth.uid()
  );

-- -----------------------------------------------------------------------------
-- Privileges
-- -----------------------------------------------------------------------------
-- RLS already gates row access, but be explicit about table-level grants.
grant select, insert, update, delete on public.admins to authenticated;
