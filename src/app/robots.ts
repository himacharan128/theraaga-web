import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Let crawlers read the thank-you page's noindex directive.
        // Private admin routes remain blocked and require authentication.
        disallow: ['/admin'],
      },
    ],
    sitemap: 'https://theraaga.in/sitemap.xml',
    host: 'https://theraaga.in',
  }
}
