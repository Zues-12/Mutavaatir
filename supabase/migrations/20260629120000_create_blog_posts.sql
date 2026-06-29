-- Blog posts table
create table public.blog_posts (
  id                uuid        primary key default gen_random_uuid(),
  title             text        not null,
  slug              text        not null,
  subtitle          text,
  excerpt           text,
  content           text,
  cover_image_url   text,
  cover_image_alt   text,
  -- Author
  author_name       text        not null default '',
  author_bio        text,
  author_avatar_url text,
  author_twitter    text,
  author_instagram  text,
  author_website    text,
  -- Taxonomy
  categories        text[]      not null default '{}',
  tags              text[]      not null default '{}',
  language          text        not null default 'en',
  -- Status
  status            text        not null default 'draft'
                    check (status in ('draft', 'published')),
  featured          boolean     not null default false,
  -- SEO
  seo_title         text,
  seo_description   text,
  -- Timestamps
  publish_date      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid        references auth.users(id) on delete set null
);

create unique index blog_posts_slug_key on public.blog_posts (slug);

-- Auto-update updated_at on row change
create or replace function public.set_blog_post_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row
  execute function public.set_blog_post_updated_at();

-- RLS
alter table public.blog_posts enable row level security;

create policy "Admins can manage blog_posts"
  on public.blog_posts
  for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

create policy "Public can read published blog_posts"
  on public.blog_posts
  for select
  to anon
  using (status = 'published');
