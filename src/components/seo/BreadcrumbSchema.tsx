type BreadcrumbItem = {
  name: string
  href: string
}

const BASE_URL = 'https://theraaga.in'

/**
 * Search engines can infer a URL's hierarchy, but explicit breadcrumbs make
 * the intended parent-child relationship unambiguous without adding visible
 * UI or duplicate copy to the page.
 */
export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.href}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
