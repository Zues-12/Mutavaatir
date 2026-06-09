-- =============================================================================
-- Mutavaatir subscription applications
-- -----------------------------------------------------------------------------
-- Stores monthly book subscription sign-ups from the public /subscribe form.
-- Payment screenshots live in the `payment-screenshots` storage bucket.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table
-- -----------------------------------------------------------------------------
create table if not exists public.subscription_applications (
  id                      uuid primary key default gen_random_uuid(),
  created_at              timestamptz not null default now(),
  status                  text not null default 'pending'
                          check (status in ('pending', 'verified', 'rejected')),
  email                   text not null,
  full_name               text not null,
  phone                   text not null,
  address                 text not null,
  delivery_notes          text,
  plan_id                 text not null
                          check (plan_id in ('monthly', 'quarterly', 'biannual', 'yearly')),
  reading_preferences     text,
  books_read              text,
  referral_source         text,
  instagram_username      text,
  suggestions             text,
  payment_screenshot_path text not null,
  terms_accepted          boolean not null default true
);

comment on table public.subscription_applications is
  'Public subscription sign-ups submitted via /subscribe. '
  'Admins verify payment and update status.';

create index if not exists subscription_applications_created_at_idx
  on public.subscription_applications (created_at desc);

create index if not exists subscription_applications_status_idx
  on public.subscription_applications (status);

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.subscription_applications enable row level security;

-- Anyone can submit a subscription application (no auth required).
drop policy if exists "subscription_applications_insert" on public.subscription_applications;
create policy "subscription_applications_insert"
  on public.subscription_applications
  for insert
  to anon, authenticated
  with check (terms_accepted = true);

-- Only admins can read and manage applications.
drop policy if exists "subscription_applications_select" on public.subscription_applications;
create policy "subscription_applications_select"
  on public.subscription_applications
  for select
  to authenticated
  using (public.is_admin(auth.uid()));

drop policy if exists "subscription_applications_update" on public.subscription_applications;
create policy "subscription_applications_update"
  on public.subscription_applications
  for update
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

grant insert on public.subscription_applications to anon, authenticated;
grant select, update on public.subscription_applications to authenticated;

-- -----------------------------------------------------------------------------
-- Storage: payment screenshots
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'payment-screenshots',
  'payment-screenshots',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "payment_screenshots_insert" on storage.objects;
create policy "payment_screenshots_insert"
  on storage.objects
  for insert
  to anon, authenticated
  with check (bucket_id = 'payment-screenshots');

drop policy if exists "payment_screenshots_select_admin" on storage.objects;
create policy "payment_screenshots_select_admin"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'payment-screenshots'
    and public.is_admin(auth.uid())
  );
