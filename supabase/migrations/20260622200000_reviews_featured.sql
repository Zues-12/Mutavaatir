-- =============================================================================
-- Feature reviews on the homepage (must also be published)
-- =============================================================================

alter table public.reviews
  add column if not exists featured boolean not null default false;

comment on column public.reviews.featured is
  'When true (and published), the review may appear on the homepage (up to 5).';

create index if not exists reviews_featured_published_created_at_idx
  on public.reviews (created_at desc)
  where featured = true and published = true;
