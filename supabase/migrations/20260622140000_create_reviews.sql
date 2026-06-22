-- =============================================================================
-- Verified subscriber reviews (linked to monthly order tracking IDs)
-- =============================================================================

create table if not exists public.reviews (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  order_id          uuid not null
                      references public.subscription_orders (id) on delete restrict,
  tracking_id       text not null,
  rating            int not null check (rating >= 1 and rating <= 5),
  feedback          text not null,
  would_recommend   text not null
                      check (would_recommend in ('yes', 'no', 'maybe')),
  display_name      text,
  comments          text,
  unique (order_id)
);

create index if not exists reviews_created_at_idx
  on public.reviews (created_at desc);

create index if not exists reviews_tracking_id_idx
  on public.reviews (tracking_id);

comment on table public.reviews is
  'Verified reviews submitted by subscribers using their monthly parcel tracking ID.';

alter table public.reviews enable row level security;

drop policy if exists "reviews_insert" on public.reviews;
create policy "reviews_insert"
  on public.reviews
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "reviews_select_admin" on public.reviews;
create policy "reviews_select_admin"
  on public.reviews
  for select
  to authenticated
  using (public.is_admin(auth.uid()));

grant insert on public.reviews to anon, authenticated;
grant select on public.reviews to authenticated;
