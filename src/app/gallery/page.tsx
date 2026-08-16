import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { GalleryGrid } from '@/components/sections/GalleryGrid'
import { FinalCta } from '@/components/sections/FinalCta'
import { getGalleryByCategory } from '@/data/content'

export const metadata: Metadata = {
  title: 'Gallery — moments and memories',
  description:
    'Anubhava — classes, kutcheris, workshops and student performances at RAAGA, the Carnatic vocal school in Jubilee Hills and Hitech City, Hyderabad.',
  alternates: { canonical: '/gallery' },
  openGraph: {
    title: 'Anubhava — moments and memories at RAAGA',
    description:
      'Classes, performances and workshops at our Carnatic vocal school in Hyderabad.',
    url: 'https://theraaga.in/gallery',
  },
}

/**
 * Anubhava.
 *
 * The structure is complete and data-driven. Until there is real, consented
 * media to show, the page remains intentionally quiet: no dummy photography,
 * placeholder cards, progress updates or substitute content. The moment media
 * lands in the DAL, the categories below render automatically.
 */
export default async function GalleryPage() {
  const groups = await getGalleryByCategory()
  const hasMedia = groups.length > 0

  return (
    <>
      <PageHero
        eyebrow="Anubhava · अनुभव · Moments and memories"
        title="What learning here actually looks like."
        lede={
          <p>
            Classes, kutcheris, workshops and the evenings when students take
            the stage. We publish only our own photographs, and only with the
            permission of everyone in them.
          </p>
        }
      />

      {hasMedia &&
        groups.map((g, i) => (
          <Section
            key={g.category}
            id={g.category}
            eyebrow={i === 0 ? 'The gallery' : undefined}
            title={g.label}
            tone={i % 2 === 1 ? 'surface' : 'default'}
          >
            <GalleryGrid items={g.items} />
          </Section>
        ))}

      <FinalCta />
    </>
  )
}
