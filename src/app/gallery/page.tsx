import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { GalleryGrid } from '@/components/sections/GalleryGrid'
import { FinalCta } from '@/components/sections/FinalCta'
import { SwaraStrip } from '@/components/ui/SwaraStrip'
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
 * The structure is complete and data-driven; the assets are not here yet. That
 * combination is the whole design problem of this page, and it is solved by
 * REFUSING to fake it: no dummy photography, no grey placeholder cards, no
 * "coming soon" strip. A gallery of empty frames is the single clearest signal
 * a site is unfinished.
 *
 * Instead the empty state is something real the page can offer today — the seven
 * swaras, playable. It is the one artefact only a music school can make, it
 * costs nothing to load, and it is a better answer to "what is this school
 * like" than six grey rectangles would be.
 *
 * The moment real, consented media lands in the DAL, the categories below
 * render automatically and this fallback disappears. No code change.
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

      {hasMedia ? (
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
        ))
      ) : (
        <Section
          id="listen"
          eyebrow="Anubhava · Listen"
          title="In the meantime — hear what a first lesson sounds like."
          lede={
            <p>
              Our photographs are being gathered and cleared with the families
              in them, which takes as long as it takes. Until then, here is the
              thing every student here begins with.
            </p>
          }
        >
          <div className="border border-border bg-surface px-6 py-14 md:px-12 md:py-16">
            <SwaraStrip />
          </div>
        </Section>
      )}

      <FinalCta />
    </>
  )
}
