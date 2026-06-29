import { createSupabasePublicClient } from '@/lib/supabase/server'

export type PublicBlogPost = {
  id: string
  title: string
  slug: string
  subtitle: string | null
  excerpt: string | null
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
  featured: boolean
  publish_date: string | null
  created_at: string
}

export type PublicBlogPostFull = PublicBlogPost & {
  content: string | null
  seo_title: string | null
  seo_description: string | null
}

const LIST_SELECT =
  'id, title, slug, subtitle, excerpt, cover_image_url, cover_image_alt, author_name, author_bio, author_avatar_url, author_twitter, author_instagram, author_website, categories, tags, language, featured, publish_date, created_at'

export async function listPublicBlogPosts(): Promise<PublicBlogPost[]> {
  const supabase = createSupabasePublicClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select(LIST_SELECT)
    .eq('status', 'published')
    .order('publish_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('listPublicBlogPosts', error)
    return []
  }

  return (data ?? []) as PublicBlogPost[]
}

export async function getPublicBlogPost(slug: string): Promise<PublicBlogPostFull | null> {
  const supabase = createSupabasePublicClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error) {
    console.error('getPublicBlogPost', error)
    return null
  }

  return data as PublicBlogPostFull | null
}

export async function listPublishedBlogSlugs(): Promise<{ slug: string }[]> {
  const supabase = createSupabasePublicClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('status', 'published')

  if (error) {
    console.error('listPublishedBlogSlugs', error)
    return []
  }

  return (data ?? []) as { slug: string }[]
}

export function estimateReadingTime(html: string | null): number {
  if (!html) return 1
  const wordCount = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 200))
}
