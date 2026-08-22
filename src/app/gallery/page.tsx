import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { GalleryGrid } from '@/components/sections/GalleryGrid'
import { FinalCta } from '@/components/sections/FinalCta'
import { getGalleryByCategory } from '@/data/content'

export const metadata: Metadata = {
  title: 'Gallery: Moments and Memories',
  description:
    'Anubhava: classes, kutcheris, workshops and student performances at RAGA, the Carnatic vocal school in Jubilee Hills and Hitech City, Hyderabad.',
  alternates: { canonical: '/gallery' },
  openGraph: {
    title: 'Anubhava: Moments and memories at RAGA',
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
            Moments from classes, performances, festivals, workshops and
            celebrations. We publish only our own photographs, and only with the
            permission of everyone in them.
          </p>
        }
      />

      {/* No dummy photography and no placeholder cards — but a nav item that
          leads to a hero and nothing else reads as broken rather than as
          restraint. One honest line, the same treatment /journal uses, says
          where the page is without substituting for the work. */}
      {!hasMedia && (
        <Section id="gathering" eyebrow="Anubhava">
          <p className="u-measure border-l-2 border-gold-hairline/50 pl-5 font-[var(--font-display)] text-[length:var(--text-step-1)] font-[300] italic leading-[var(--lh-snug)] text-text-secondary">
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
            tone={i % 2 === 1 ? 'surface' : 'default'}
          >
            <GalleryGrid items={g.items} />
          </Section>
        ))}

      <FinalCta />
    </>
  )
}
