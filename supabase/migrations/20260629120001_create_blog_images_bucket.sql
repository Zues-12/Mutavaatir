-- Blog images storage bucket (public reads, admin writes)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-images',
  'blog-images',
  true,
  10485760,
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do nothing;

create policy "Admins can upload blog images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'blog-images'
    and public.is_admin(auth.uid())
  );

create policy "Anyone can view blog images"
  on storage.objects
  for select
  to public
  using (bucket_id = 'blog-images');

create policy "Admins can update blog images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'blog-images'
    and public.is_admin(auth.uid())
  );

create policy "Admins can delete blog images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'blog-images'
    and public.is_admin(auth.uid())
  );
