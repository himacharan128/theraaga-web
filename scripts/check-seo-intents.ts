import { seoLandingPages } from '../src/content/seed/seo-pages'
import { learningGuides } from '../src/content/seed/learning-guides'
import { areas } from '../src/content/seed/areas'
import { centres } from '../src/content/seed/site'

const issues: string[] = []
const seenSlugs = new Set<string>()
const seenTitles = new Set<string>()
const seenDescriptions = new Set<string>()

for (const page of seoLandingPages) {
  const label = `/carnatic-music-classes/${page.slug}`

  if (!/^[a-z0-9-]+$/.test(page.slug)) {
    issues.push(`${label}: slug must be lowercase kebab-case`)
  }
  if (seenSlugs.has(page.slug)) issues.push(`${label}: duplicate slug`)
  seenSlugs.add(page.slug)

  // The layout appends " | RAAGA", so leave room for the brand in the title.
  if (page.title.length > 52) {
    issues.push(`${label}: title is too long before the RAAGA suffix (${page.title.length})`)
  }
  if (seenTitles.has(page.title)) issues.push(`${label}: duplicate title`)
  seenTitles.add(page.title)

  if (page.description.length < 120 || page.description.length > 160) {
    issues.push(`${label}: description must be 120–160 characters (${page.description.length})`)
  }
  if (seenDescriptions.has(page.description)) issues.push(`${label}: duplicate description`)
  seenDescriptions.add(page.description)

  // Two, not three: the location sections and highlights were removed from every
  // page because the centre pages and homepage router own location. What is
  // left is each page's genuinely distinct content, and padding it back to a
  // count would mean inventing claims.
  if (!page.h1 || !page.intro || page.highlights.length < 2 || page.sections.length < 2) {
    issues.push(`${label}: requires an H1, intro, two highlights and two content sections`)
  }
  // The trial link is no longer in `related`: every page ends on FinalCta.
  if (page.related.length < 3) {
    issues.push(`${label}: requires at least three useful related links`)
  }

  const uniqueSections = new Set(page.sections.map((section) => section.title))
  if (uniqueSections.size !== page.sections.length) {
    issues.push(`${label}: duplicate content-section title`)
  }
}

for (const guide of learningGuides) {
  const label = `/guides/${guide.slug}`
  if (!/^[a-z0-9-]+$/.test(guide.slug) || seenSlugs.has(guide.slug)) issues.push(`${label}: invalid or duplicate slug`)
  seenSlugs.add(guide.slug)
  if (seenTitles.has(guide.title)) issues.push(`${label}: duplicate title`)
  seenTitles.add(guide.title)
  if (guide.title.length > 60) issues.push(`${label}: title exceeds 60 characters before brand`)
  if (seenDescriptions.has(guide.description)) issues.push(`${label}: duplicate description`)
  seenDescriptions.add(guide.description)
  if (guide.description.length < 120 || guide.description.length > 160) issues.push(`${label}: description must be 120-160 characters`)
  if (!guide.intro || guide.sections.length < 3) issues.push(`${label}: guide needs an introduction and distinct sections`)
  const anchors = new Set<string>()
  for (const section of guide.sections) {
    if (!/^[a-z0-9-]+$/.test(section.id) || anchors.has(section.id) || section.id === 'next-steps') issues.push(`${label}: invalid or duplicate section anchor ${section.id}`)
    anchors.add(section.id)
    if (!section.title || !section.paragraphs.length) issues.push(`${label}: empty section`)
  }
  if (guide.related.length < 2) issues.push(`${label}: missing next steps`)
  for (const link of guide.related) {
    if (!link.href.startsWith('/') || link.href.startsWith('//')) issues.push(`${label}: related links must stay on site`)
  }
  for (const source of guide.sources) {
    if (!source.href.startsWith('https://')) issues.push(`${label}: source must use HTTPS`)
  }
  if (/[\u2013\u2014]/.test(JSON.stringify(guide))) issues.push(`${label}: use plain punctuation`)
}

// The neighbourhood pages share the centre route, so a slug may not collide
// with a centre, and each must carry its own journey rather than a renamed copy.
const centreSlugs = new Set(centres.map((c) => c.slug).filter(Boolean))
const centreKeys = new Set(centres.map((c) => c.key))
const seenAreaCopy = new Set<string>()
for (const area of areas) {
  const label = `/music-classes/${area.slug}`
  if (!/^[a-z0-9-]+$/.test(area.slug) || seenSlugs.has(area.slug) || centreSlugs.has(area.slug)) issues.push(`${label}: invalid, duplicate or centre-colliding slug`)
  seenSlugs.add(area.slug)
  if (area.title.length > 52) issues.push(`${label}: title is too long before the RAAGA suffix (${area.title.length})`)
  if (seenTitles.has(area.title)) issues.push(`${label}: duplicate title`)
  seenTitles.add(area.title)
  if (area.description.length < 120 || area.description.length > 160) issues.push(`${label}: description must be 120-160 characters (${area.description.length})`)
  if (seenDescriptions.has(area.description)) issues.push(`${label}: duplicate description`)
  seenDescriptions.add(area.description)
  if (!centreKeys.has(area.nearest) || (area.alsoNear && !centreKeys.has(area.alsoNear))) issues.push(`${label}: nearest centre is not a known centre`)
  for (const field of ['intro', 'travel', 'alternative'] as const) {
    const text = area[field]
    if (text.split(' ').length < 30) issues.push(`${label}: ${field} is too short to be specific`)
    if (seenAreaCopy.has(text)) issues.push(`${label}: ${field} repeats another area's copy`)
    seenAreaCopy.add(text)
    if (!text.includes(area.name) && field !== 'alternative') issues.push(`${label}: ${field} never names ${area.name}`)
  }
  if (!area.intro.includes(area.distance)) issues.push(`${label}: intro must state the distance to the nearest centre`)
  if (area.neighbours.length < 2) issues.push(`${label}: needs at least two neighbouring places to link`)
  for (const n of area.neighbours) {
    if (n === area.slug || !(centreSlugs.has(n) || areas.some((a) => a.slug === n))) issues.push(`${label}: neighbour ${n} has no page`)
  }
  if (/[\u2013\u2014]/.test(JSON.stringify(area))) issues.push(`${label}: use plain punctuation`)
}

console.log(`\n  SEO content: ${seoLandingPages.length} intent pages, ${learningGuides.length} guides, ${areas.length} neighbourhood pages\n`)
if (issues.length) {
  for (const issue of issues) console.error(`  ✗ ${issue}`)
  process.exit(1)
}

console.log('  ✓ unique slugs, titles and descriptions')
console.log('  ✓ title and description length budgets')
console.log('  ✓ every page has distinct, complete content and internal links')
