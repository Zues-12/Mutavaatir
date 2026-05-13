import { getSiteUrl } from '@/lib/site'

type Path = `/${string}` | '/'

export function WebPageJsonLd({
  path,
  name,
  description,
}: {
  path: Path
  name: string
  description: string
}) {
  const siteUrl = getSiteUrl()
  const pathSegment = path === '/' ? '' : path
  const url = `${siteUrl}${pathSegment}`

  const payload = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { '@id': `${siteUrl}/#website` },
    publisher: { '@id': `${siteUrl}/#organization` },
    inLanguage: 'en-PK',
    about: { '@id': `${siteUrl}/#subscription` },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  )
}
