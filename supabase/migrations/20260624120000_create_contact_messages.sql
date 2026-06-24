-- =============================================================================
-- Public contact form messages
-- =============================================================================

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  full_name   text not null,
  email       text not null,
  subject     text not null,
  message     text not null
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

comment on table public.contact_messages is
  'Messages submitted through the public contact form.';

alter table public.contact_messages enable row level security;

drop policy if exists "contact_messages_insert" on public.contact_messages;
create policy "contact_messages_insert"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "contact_messages_select_admin" on public.contact_messages;
create policy "contact_messages_select_admin"
  on public.contact_messages
  for select
  to authenticated
  using (public.is_admin(auth.uid()));

grant insert on public.contact_messages to anon, authenticated;
grant select on public.contact_messages to authenticated;
