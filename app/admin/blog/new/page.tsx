import type { Metadata } from 'next'
import BlogPostForm from '@/components/admin/blog-post-form'

export const metadata: Metadata = {
  title: 'New Post · Blog',
  description: 'Create a new blog post.',
  robots: { index: false, follow: false },
}

export default function AdminBlogNewPage() {
  return <BlogPostForm />
}
