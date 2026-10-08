import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Section } from '@/components/layout/Section'
import { Arrow } from '@/components/ui/Button'
import { getEventPhotos, getPillars } from '@/data/content'
import { monthYear } from '@/lib/dates'

/**
 * All six of the client's draft pillars were replaced.
 *
 * Five of them appeared near-verbatim on Shankar Mahadevan Academy's homepage:
 * "Performance Opportunities" was word-for-word identical, and "All Age Groups
 * Welcome" mirrored their "for all age groups". A differentiator that your
 * largest competitor already prints is not a differentiator.
 *
 * These lead with the two claims no national player can make: delivery into
 * how it teaches, how closely, in what order, and where that order leads.
 *
 * The chapter closes on one of the school's own photographs, a kutcheri at the
 * Aani Thirumanjanam festival, captioned with its real occasion and month. It
 * is fetched through `getEventPhotos`, so the consent gate decides whether it
 * appears at all; it shows adults only, and if it is ever withdrawn the
 * chapter simply ends at the list.
 */
const KUTCHERI = 'event-img-8744'

export async function Pillars() {
  const [pillars, occasions] = await Promise.all([getPillars(), getEventPhotos()])
  const occasion = occasions.find((o) => o.photos.some((p) => p.id === KUTCHERI))
  const photo = occasion?.photos.find((p) => p.id === KUTCHERI)

  return (
    <Section
      id="why-raaga"
      tone="sand"
      eyebrow="Why RAAGA"
      title="What you get here that you won’t get elsewhere."
      renderIf={pillars.length > 0}
    >
      <ol className="grid gap-x-10 md:grid-cols-2 xl:grid-cols-4">
        {pillars.map((p, i) => (
          <li
            key={p.order}
            className="reveal grid grid-cols-[3.25rem_1fr] border-t border-line-strong/40 py-7 md:block md:pt-6 md:pb-12"
            style={{ '--i': i } as CSSProperties}
          >
            <span aria-hidden="true" className="t-numeral text-[2rem] text-kicker md:text-[3.25rem]">
              {String(p.order).padStart(2, '0')}
            </span>
            <div>
              <h3 className="t-title text-fg md:mt-8">{p.title}</h3>
              <p className="t-body mt-3 max-w-[40ch] text-fg-2">{p.body}</p>
            </div>
          </li>
        ))}
      </ol>

      {photo && occasion && (
        <figure className="mt-[clamp(2rem,5vw,4rem)] grid gap-x-10 gap-y-5 lg:grid-cols-12 lg:items-end">
          <div className="media reveal reveal-unveil -mx-[var(--gutter)] aspect-[49/20] sm:mx-0 lg:col-span-9 lg:col-start-4 lg:row-start-1">
            <Image
              src={photo.media.src}
              alt={photo.media.alt}
              fill
              sizes="(min-width: 1024px) 70vw, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="reveal lg:col-span-3 lg:row-start-1 lg:pb-1">
            <p className="t-caption max-w-[30ch] text-fg-2">{occasion.occasion}</p>
            {occasion.date && (
              <p className="t-meta mt-2 text-fg-3">
                <time dateTime={occasion.date}>{monthYear(occasion.date)}</time>
              </p>
            )}
            <Link href="/events#moments" className="link-arrow mt-5">
              From our gatherings
              <Arrow />
            </Link>
          </figcaption>
        </figure>
      )}
    </Section>
  )
}
