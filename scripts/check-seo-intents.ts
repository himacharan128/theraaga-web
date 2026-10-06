import { seoLandingPages } from '../src/content/seed/seo-pages'
import { learningGuides } from '../src/content/seed/learning-guides'

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

console.log(`\n  SEO content: ${seoLandingPages.length} intent pages, ${learningGuides.length} guides\n`)
if (issues.length) {
  for (const issue of issues) console.error(`  ✗ ${issue}`)
  process.exit(1)
}

console.log('  ✓ unique slugs, titles and descriptions')
console.log('  ✓ title and description length budgets')
console.log('  ✓ every page has distinct, complete content and internal links')
