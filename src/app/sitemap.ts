import type { MetadataRoute } from 'next'

const BASE = 'https://theraaga.in'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const routes: [string, number, MetadataRoute.Sitemap[number]['changeFrequency']][] = [
    ['', 1, 'weekly'],
    ['/courses', 0.9, 'monthly'],
    ['/carnatic-vocal-classes-hyderabad', 0.9, 'weekly'],
    ['/online-classes', 0.8, 'weekly'],
    ['/music-classes/jubilee-hills', 0.8, 'monthly'],
    ['/music-classes/hitech-city', 0.8, 'monthly'],
    ['/teachers', 0.7, 'monthly'],
    ['/about', 0.6, 'monthly'],
    ['/gallery', 0.5, 'monthly'],
    ['/contact', 0.7, 'monthly'],
    ['/privacy', 0.2, 'yearly'],
    ['/terms', 0.2, 'yearly'],
    ['/refund-policy', 0.2, 'yearly'],
    ['/child-safeguarding', 0.3, 'yearly'],
  ]

  return routes.map(([path, priority, changeFrequency]) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))
}
