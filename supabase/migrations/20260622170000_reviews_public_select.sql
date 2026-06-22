-- Allow public read access to reviews for the reviews page.

drop policy if exists "reviews_select_public" on public.reviews;
create policy "reviews_select_public"
  on public.reviews
  for select
  to anon, authenticated
  using (true);

grant select on public.reviews to anon;
