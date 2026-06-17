-- Track when and by whom a subscription was reviewed.
alter table public.subscription_applications
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by uuid references auth.users(id) on delete set null;

comment on column public.subscription_applications.reviewed_at is
  'Timestamp when an admin verified or rejected the application.';
comment on column public.subscription_applications.reviewed_by is
  'Admin user who last changed status away from pending.';
