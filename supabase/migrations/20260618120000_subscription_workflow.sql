-- =============================================================================
-- Subscription operational workflow (book sourcing → delivery → active)
-- Extends subscription_applications beyond payment review.
-- =============================================================================

-- Migrate legacy payment-verified rows into the workflow.
update public.subscription_applications
set status = 'book_searching'
where status = 'verified';

alter table public.subscription_applications
  drop constraint if exists subscription_applications_status_check;

alter table public.subscription_applications
  add constraint subscription_applications_status_check
  check (
    status in (
      'pending',
      'rejected',
      'book_searching',
      'book_confirmed',
      'packaging',
      'dispatched',
      'delivered',
      'active'
    )
  );

alter table public.subscription_applications
  add column if not exists sourcing_result text
    check (sourcing_result is null or sourcing_result in ('found', 'not_available', 'alternative_suggested')),
  add column if not exists sourcing_notes text,
  add column if not exists book_title text,
  add column if not exists book_author text,
  add column if not exists book_notes text,
  add column if not exists package_id text,
  add column if not exists tracking_number text,
  add column if not exists courier text,
  add column if not exists estimated_delivery_date date,
  add column if not exists dispatched_at timestamptz,
  add column if not exists delivered_at timestamptz,
  add column if not exists workflow_updated_at timestamptz;

create index if not exists subscription_applications_workflow_status_idx
  on public.subscription_applications (status)
  where status not in ('pending', 'rejected');

comment on column public.subscription_applications.sourcing_result is
  'Outcome while status is book_searching: found, not_available, or alternative_suggested.';
comment on column public.subscription_applications.workflow_updated_at is
  'Last time an operational workflow field was updated.';
