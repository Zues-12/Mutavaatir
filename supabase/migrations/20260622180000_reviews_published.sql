-- =============================================================================
-- Publish toggle for public reviews page
-- Set published = true in Supabase to show a review on the site.
-- =============================================================================

alter table public.reviews
  add column if not exists published boolean not null default false;

comment on column public.reviews.published is
  'When true, the review appears on the public reviews page and in rating stats.';

create index if not exists reviews_published_created_at_idx
  on public.reviews (created_at desc)
  where published = true;

drop policy if exists "reviews_select_public" on public.reviews;
create policy "reviews_select_public"
  on public.reviews
  for select
  to anon, authenticated
  using (published = true);
