import { createSupabaseServerClient } from '@/lib/supabase/server'

export type BlogPostStatus = 'draft' | 'published'

export type BlogPost = {
  id: string
  title: string
  slug: string
  subtitle: string | null
  excerpt: string | null
  content: string | null
  cover_image_url: string | null
  cover_image_alt: string | null
  author_name: string
  author_bio: string | null
  author_avatar_url: string | null
  author_twitter: string | null
  author_instagram: string | null
  author_website: string | null
  categories: string[]
  tags: string[]
  language: string
  status: BlogPostStatus
  featured: boolean
  seo_title: string | null
  seo_description: string | null
  publish_date: string | null
  created_at: string
  updated_at: string
  created_by: string | null
}

export type BlogPostListItem = Pick<
  BlogPost,
  | 'id'
  | 'title'
  | 'slug'
  | 'author_name'
  | 'categories'
  | 'language'
  | 'status'
  | 'featured'
  | 'publish_date'
  | 'created_at'
  | 'updated_at'
>

export async function listBlogPosts(): Promise<BlogPostListItem[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select(
      'id, title, slug, author_name, categories, language, status, featured, publish_date, created_at, updated_at',
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.error('listBlogPosts', error)
    return []
  }

  return (data ?? []) as BlogPostListItem[]
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error('getBlogPost', error)
    return null
  }

  return data as BlogPost | null
}
