import type { MetadataRoute } from 'next'
import { getAreas, getLearningGuides, getSeoLandingPages } from '@/data/content'

const BASE = 'https://theraaga.in'

/**
 * `lastModified` is the date a page's content last changed, not the build
 * date. Bing uses it to decide what to recrawl for its AI answers, and Google
 * ignores it on a site where every date is always today. Move a date when the
 * page itself says something new; a code refactor does not count.
 */
type Route = [path: string, lastModified: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']]

const ROUTES: Route[] = [
  ['', '2026-11-12', 1, 'weekly'],
  ['/learning', '2026-10-09', 0.9, 'monthly'],
  ['/getting-started', '2026-10-09', 0.8, 'monthly'],
  ['/guides', '2026-10-25', 0.7, 'monthly'],
  ['/online-classes', '2026-10-15', 0.8, 'weekly'],
  ['/music-classes', '2026-11-12', 0.8, 'monthly'],
  ['/music-classes/jubilee-hills', '2026-11-12', 0.8, 'monthly'],
  ['/music-classes/hitech-city', '2026-11-12', 0.8, 'monthly'],
  ['/gurus', '2026-10-25', 0.7, 'monthly'],
  ['/gurus/suryanarayana-polaki', '2026-10-25', 0.7, 'monthly'],
  ['/about', '2026-10-09', 0.6, 'monthly'],
  ['/events', '2026-10-09', 0.6, 'monthly'],
  ['/journal', '2026-10-09', 0.5, 'monthly'],
  ['/gallery', '2026-10-09', 0.5, 'monthly'],
  ['/contact', '2026-10-03', 0.7, 'monthly'],
  ['/privacy', '2026-10-09', 0.2, 'yearly'],
  ['/terms', '2026-10-09', 0.2, 'yearly'],
  ['/refund-policy', '2026-10-09', 0.2, 'yearly'],
  ['/child-safeguarding', '2026-10-09', 0.3, 'yearly'],
]

/** The intent pages share one seed file, so they share its date. */
const INTENT_PAGES_UPDATED = '2026-10-09'

/** The neighbourhood pages likewise share `content/seed/areas.ts`. */
const AREA_PAGES_UPDATED = '2026-11-12'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [seoPages, guides, areas] = await Promise.all([getSeoLandingPages(), getLearningGuides(), getAreas()])

  const core = ROUTES.map(([path, lastModified, priority, changeFrequency]) => ({
    url: `${BASE}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }))

  const intents = seoPages.map((page) => ({
    url: `${BASE}/carnatic-music-classes/${page.slug}`,
    lastModified: INTENT_PAGES_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const neighbourhoods = areas.map((area) => ({
    url: `${BASE}/music-classes/${area.slug}`,
    lastModified: AREA_PAGES_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  return [...core, ...neighbourhoods, ...intents, ...guides.map((guide) => ({
    url: `${BASE}/guides/${guide.slug}`,
    lastModified: guide.updated,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))]
}
