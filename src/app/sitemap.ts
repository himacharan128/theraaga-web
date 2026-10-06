import type { MetadataRoute } from 'next'
import { getLearningGuides, getSeoLandingPages } from '@/data/content'

const BASE = 'https://theraaga.in'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seoPages = await getSeoLandingPages()
  const guides = await getLearningGuides()

  const routes: [string, number, MetadataRoute.Sitemap[number]['changeFrequency']][] = [
    ['', 1, 'weekly'],
    ['/learning', 0.9, 'monthly'],
    ['/getting-started', 0.8, 'monthly'],
    ['/guides', 0.7, 'monthly'],
    ['/online-classes', 0.8, 'weekly'],
    ['/music-classes/jubilee-hills', 0.8, 'monthly'],
    ['/music-classes/hitech-city', 0.8, 'monthly'],
    ['/gurus', 0.7, 'monthly'],
    ['/about', 0.6, 'monthly'],
    ['/events', 0.6, 'monthly'],
    ['/journal', 0.5, 'monthly'],
    ['/gallery', 0.5, 'monthly'],
    ['/contact', 0.7, 'monthly'],
    ['/privacy', 0.2, 'yearly'],
    ['/terms', 0.2, 'yearly'],
    ['/refund-policy', 0.2, 'yearly'],
    ['/child-safeguarding', 0.3, 'yearly'],
  ]

  const core = routes.map(([path, priority, changeFrequency]) => ({
    url: `${BASE}${path}`,
    changeFrequency,
    priority,
  }))

  const intents = seoPages.map((page) => ({
    url: `${BASE}/carnatic-music-classes/${page.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  return [...core, ...intents, ...guides.map((guide) => ({
    url: `${BASE}/guides/${guide.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))]
}
