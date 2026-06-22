-- Allow admins to update reviews (e.g. published toggle).

drop policy if exists "reviews_update_admin" on public.reviews;
create policy "reviews_update_admin"
  on public.reviews
  for update
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

grant update on public.reviews to authenticated;
