import { getSiteUrl } from '@/lib/site'

type Path = `/${string}` | '/'

export type BreadcrumbItem = {
  name: string
  path: Path
}

export function BreadcrumbJsonLd({ items }: { items: readonly BreadcrumbItem[] }) {
  const siteUrl = getSiteUrl()

  const payload = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const pathSegment = item.path === '/' ? '' : item.path
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${siteUrl}${pathSegment}`,
      }
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  )
}
