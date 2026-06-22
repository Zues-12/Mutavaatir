-- =============================================================================
-- Monthly subscription orders + simplified application statuses
-- =============================================================================

-- Link a subscription to a prior one (manual admin link).
alter table public.subscription_applications
  add column if not exists previous_application_id uuid
    references public.subscription_applications (id) on delete set null;

create index if not exists subscription_applications_previous_application_idx
  on public.subscription_applications (previous_application_id)
  where previous_application_id is not null;

-- -----------------------------------------------------------------------------
-- subscription_orders — one row per monthly book shipment
-- -----------------------------------------------------------------------------
create table if not exists public.subscription_orders (
  id                  uuid primary key default gen_random_uuid(),
  application_id      uuid not null
                        references public.subscription_applications (id) on delete cascade,
  month_number        int not null check (month_number >= 1),
  status              text not null default 'pending'
                        check (status in ('pending', 'in_transit', 'delivered')),
  old_read            text,
  options             text,
  sent_book           text,
  tracking_id         text,
  previous_order_id   uuid
                        references public.subscription_orders (id) on delete set null,
  in_transit_at       timestamptz,
  delivered_at        timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (application_id, month_number)
);

create index if not exists subscription_orders_application_idx
  on public.subscription_orders (application_id, month_number);

create index if not exists subscription_orders_status_idx
  on public.subscription_orders (status);

comment on table public.subscription_orders is
  'Monthly book shipments within a subscription application.';

alter table public.subscription_orders enable row level security;

drop policy if exists "subscription_orders_select" on public.subscription_orders;
create policy "subscription_orders_select"
  on public.subscription_orders
  for select
  to authenticated
  using (public.is_admin(auth.uid()));

drop policy if exists "subscription_orders_insert" on public.subscription_orders;
create policy "subscription_orders_insert"
  on public.subscription_orders
  for insert
  to authenticated
  with check (public.is_admin(auth.uid()));

drop policy if exists "subscription_orders_update" on public.subscription_orders;
create policy "subscription_orders_update"
  on public.subscription_orders
  for update
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

grant select, insert, update on public.subscription_orders to authenticated;

-- -----------------------------------------------------------------------------
-- Migrate legacy workflow statuses → accepted / completed
-- -----------------------------------------------------------------------------
update public.subscription_applications
set status = 'accepted'
where status in ('book_searching', 'book_confirmed', 'packaging', 'dispatched', 'delivered');

update public.subscription_applications
set status = 'completed'
where status = 'active';

alter table public.subscription_applications
  drop constraint if exists subscription_applications_status_check;

alter table public.subscription_applications
  add constraint subscription_applications_status_check
  check (status in ('pending', 'rejected', 'accepted', 'completed'));

-- Backfill orders from legacy workflow fields on accepted/completed applications.
insert into public.subscription_orders (
  application_id,
  month_number,
  status,
  sent_book,
  tracking_id,
  in_transit_at,
  delivered_at
)
select
  sa.id,
  1,
  case
    when sa.status = 'completed' then 'delivered'
    when sa.dispatched_at is not null and sa.delivered_at is null then 'in_transit'
    when sa.delivered_at is not null then 'delivered'
    else 'pending'
  end,
  nullif(trim(concat_ws(' — ', sa.book_title, sa.book_author)), ''),
  coalesce(sa.tracking_number, sa.package_id),
  sa.dispatched_at,
  sa.delivered_at
from public.subscription_applications sa
where sa.status in ('accepted', 'completed')
  and not exists (
    select 1 from public.subscription_orders so where so.application_id = sa.id
  );
