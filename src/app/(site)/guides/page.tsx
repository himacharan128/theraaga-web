import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { IndexList } from '@/components/layout/Editorial'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { FinalCta } from '@/components/sections/FinalCta'
import { getLearningGuides } from '@/data/content'
import { guideMeta } from '@/lib/reading'
import { defaultOgImages } from '@/lib/og-image'

const title = 'Carnatic Music Learning Guides'
const description = 'Practical guides to choosing singing classes in Hyderabad, comparing online and in-person Carnatic lessons, and building a home practice routine.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/guides' },
  openGraph: { title, description, url: 'https://theraaga.in/guides', images: defaultOgImages },
}

/**
 * The guides on their own: a short title at full scale, then a contents page,
 * one ruled row per guide with what it covers and how long it takes to read.
 */
export default async function GuidesPage() {
  const guides = await getLearningGuides()
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Learning guides', href: '/guides' }]} />
      <PageHero
        variant="statement"
        eyebrow="Before and between lessons"
        title="Make room for music."
        lede={<p>Questions to ask before choosing a class, ways to compare learning formats, and a place to start with practice at home.</p>}
      />
      <Section id="guides" title="Find the answer you need." renderIf={guides.length > 0}>
        <IndexList
          items={guides.map((guide) => ({
            href: `/guides/${guide.slug}`,
            title: guide.title,
            body: guide.description,
            meta: guideMeta(guide),
            action: 'Read the guide',
          }))}
        />
      </Section>
      <FinalCta />
    </>
  )
}
