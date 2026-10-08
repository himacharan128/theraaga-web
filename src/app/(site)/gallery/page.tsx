import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { GalleryGrid } from '@/components/sections/GalleryGrid'
import { FinalCta } from '@/components/sections/FinalCta'
import { getGalleryByCategory } from '@/data/content'
import { defaultOgImages } from '@/lib/og-image'

export const metadata: Metadata = {
  title: 'Gallery: Moments and Memories',
  description:
    'Anubhava: classes, kutcheris, workshops and student performances at RAAGA, the Carnatic vocal school in Jubilee Hills and Hitech City, Hyderabad.',
  alternates: { canonical: '/gallery' },
  openGraph: {
    title: 'Anubhava: Moments and memories at RAAGA',
    description:
      'Classes, performances and workshops at our Carnatic vocal school in Hyderabad.',
    url: 'https://theraaga.in/gallery',
    images: defaultOgImages,
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
            Moments from classes, performances, festivals, workshops and
            celebrations. We publish only our own photographs, and only with the
            permission of everyone in them.
          </p>
        }
      />

      {/* No dummy photography and no placeholder cards, but a nav item that
          leads to a hero and nothing else reads as broken rather than as
          restraint. One honest line, set as a programme note, says where the
          page is without substituting for the work. */}
      {!hasMedia && (
        <Section id="gathering" eyebrow="Anubhava" compact>
          <p className="reveal t-statement max-w-[34ch] border-l border-mark pl-6 italic text-fg-2 md:pl-8">
            Our photographs are being gathered and cleared with the families in
            them, which takes as long as it takes. We would rather show you
            nothing than show you someone else’s stock photograph of a music
            lesson.
          </p>
        </Section>
      )}

      {hasMedia &&
        groups.map((g, i) => (
          <Section
            key={g.category}
            id={g.category}
            eyebrow={i === 0 ? 'The gallery' : undefined}
            title={g.label}
            tone={i % 2 === 1 ? 'paper' : 'default'}
          >
            <GalleryGrid items={g.items} />
          </Section>
        ))}

      <FinalCta />
    </>
  )
}
