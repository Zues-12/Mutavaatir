import type { Metadata } from 'next'
import Footer from '@/components/footer'
import BlogPageHero from '@/components/blog-page-hero'
import BlogListing from '@/components/blog-listing'
import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld'
import { WebPageJsonLd } from '@/components/web-page-json-ld'
import { listPublicBlogPosts } from '@/lib/blog-queries'
import { publicPageMetadata } from '@/lib/seo'

const blogTitle = 'Reading Notes — Essays & Reflections by Mutavaatir'
const blogDescription =
  'Essays, reflections, and letters on books, reading, and the stories that stay with you — from the Mutavaatir team.'

export const metadata: Metadata = publicPageMetadata({
  title: blogTitle,
  description: blogDescription,
  path: '/blog',
  extraKeywords: ['Mutavaatir blog', 'book essays', 'reading notes', 'book reviews Pakistan'],
})

export default async function BlogPage() {
  const posts = await listPublicBlogPosts()

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
        ]}
      />
      <WebPageJsonLd path="/blog" name={blogTitle} description={blogDescription} />
      <BlogPageHero />
      <BlogListing posts={posts} />
      <Footer />
    </>
  )
}
