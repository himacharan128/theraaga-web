import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { PathCard } from '@/components/sections/ExploreLearningGoals'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { FinalCta } from '@/components/sections/FinalCta'
import { getLearningGuides } from '@/data/content'
import { defaultOgImages } from '@/lib/og-image'

const title = 'Carnatic Music Learning Guides'
const description = 'Practical guides to choosing singing classes in Hyderabad, comparing online and in-person Carnatic lessons, and building a home practice routine.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/guides' },
  openGraph: { title, description, url: 'https://theraaga.in/guides', images: defaultOgImages },
}

export default async function GuidesPage() {
  const guides = await getLearningGuides()
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Learning guides', href: '/guides' }]} />
      <PageHero eyebrow="Before and between lessons" title="Make room for music."
        lede={<p>Questions to ask before choosing a class, ways to compare learning formats, and a place to start with practice at home.</p>} />
      <Section id="guides" title="Find the answer you need.">
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {guides.map((guide) => <li key={guide.slug} className="group">
            <PathCard title={guide.title} body={guide.description} href={`/guides/${guide.slug}`} cta="Read the guide" />
          </li>)}
        </ul>
      </Section>
      <FinalCta />
    </>
  )
}
