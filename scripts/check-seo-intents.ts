import { seoLandingPages } from '../src/content/seed/seo-pages'

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

  if (!page.h1 || !page.intro || page.highlights.length < 3 || page.sections.length < 3) {
    issues.push(`${label}: requires an H1, intro, three highlights and three content sections`)
  }
  if (page.related.length < 3) {
    issues.push(`${label}: requires at least three useful related links`)
  }

  const uniqueSections = new Set(page.sections.map((section) => section.title))
  if (uniqueSections.size !== page.sections.length) {
    issues.push(`${label}: duplicate content-section title`)
  }
}

console.log(`\n  Focused SEO pages — ${seoLandingPages.length} records\n`)
if (issues.length) {
  for (const issue of issues) console.error(`  ✗ ${issue}`)
  process.exit(1)
}

console.log('  ✓ unique slugs, titles and descriptions')
console.log('  ✓ title and description length budgets')
console.log('  ✓ every page has distinct, complete content and internal links')
