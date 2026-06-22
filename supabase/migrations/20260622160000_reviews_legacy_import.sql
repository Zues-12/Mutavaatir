-- =============================================================================
-- Support legacy Google Form reviews (may not link to subscription_orders)
-- =============================================================================

alter table public.reviews
  alter column order_id drop not null;

alter table public.reviews
  add column if not exists submitter_email text,
  add column if not exists source text not null default 'verified_form';

alter table public.reviews
  drop constraint if exists reviews_source_check;

alter table public.reviews
  add constraint reviews_source_check
  check (source in ('verified_form', 'legacy_import'));

alter table public.reviews
  drop constraint if exists reviews_order_id_key;

create unique index if not exists reviews_order_id_unique_idx
  on public.reviews (order_id)
  where order_id is not null;

comment on column public.reviews.submitter_email is
  'Email from the review form; used for legacy imports without a linked order.';
comment on column public.reviews.source is
  'verified_form = parcel-code flow; legacy_import = historical Google Sheet data.';
