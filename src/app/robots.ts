import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The success route must not be indexed — it is a conversion endpoint,
        // not a landing page, and an indexed thank-you page is a classic
        // analytics contaminant.
        disallow: ['/thank-you', '/admin'],
      },
    ],
    sitemap: 'https://theraaga.in/sitemap.xml',
    host: 'https://theraaga.in',
  }
}
