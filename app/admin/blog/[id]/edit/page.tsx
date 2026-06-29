import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogPostForm from '@/components/admin/blog-post-form'
import { getBlogPost } from '@/lib/admin/blog-queries'

type Params = Promise<{ id: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params
  const post = await getBlogPost(id)
  return {
    title: post ? `Edit: ${post.title}` : 'Edit Post',
    description: 'Edit a blog post.',
    robots: { index: false, follow: false },
  }
}

export default async function AdminBlogEditPage({ params }: { params: Params }) {
  const { id } = await params
  const post = await getBlogPost(id)

  if (!post) {
    notFound()
  }

  return <BlogPostForm post={post} />
}
