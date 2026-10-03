import Image from 'next/image'
import type { EventPhoto } from '@/content/types'

/**
 * Photographs from past RAAGA events, one subsection per occasion.
 *
 * The consent gate has already run in the DAL (`getEventPhotos`), so anything
 * depicting a minor without recorded guardian consent never reaches this
 * component. It renders whatever it is given; the caller renders nothing at
 * all when there is nothing to give.
 *
 * Each occasion is laid out so that no count leaves a hole or a panoramic
 * sliver. On a desktop (a six-column grid) the first photograph is the feature
 * and either two stacked tiles sit beside it, or one equal tile when that keeps
 * the remainder tidy. Whatever follows runs in rows of three, and the last two
 * tiles go half-width each if the count would otherwise leave one on its own.
 * A panoramic feature (aspect 49/20) instead spans the full width at its own
 * ratio, so nobody in it is cropped, with the rest in rows of three below.
 * On a phone it is two columns, with a lone last tile full width.
 *
 * All tiles are 3:2 crops via `object-cover`; the photographs are 3:2, 4:3,
 * 16:9, square or portrait, and `focus` keeps an off-centre subject in frame.
 * Every photograph is lazy: the section sits below the hero and the
 * ledger, so none of it is needed for the first paint.
 */

const frame =
  'group relative overflow-hidden rounded-[var(--radius-sm)] border border-border bg-surface shadow-[0_8px_20px_rgba(71,49,34,0.05)]'
const zoom =
  'object-cover transition-transform duration-500 ease-[var(--ease-raaga)] motion-safe:group-hover:scale-[1.035] motion-reduce:transition-none'

function Photo({ photo, sizes }: { photo: EventPhoto; sizes: string }) {
  return (
    <Image
      src={photo.media.src}
      alt={photo.media.alt}
      fill
      sizes={sizes}
      loading="lazy"
      style={photo.focus ? { objectPosition: photo.focus } : undefined}
      className={zoom}
    />
  )
}

function monthYear(iso: string): string {
  // An ISO month ("2026-09") parses as UTC; format in UTC so it cannot slip a
  // month with the viewer's timezone.
  return new Date(iso).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function Occasion({
  occasion,
  date,
  photos,
}: {
  occasion: string
  date?: string
  photos: EventPhoto[]
}) {
  const [feature, ...others] = photos
  // Choose how many sit beside the feature so the rest divides into rows of
  // three, or into rows of three plus a final pair.
  // A panoramic feature takes the whole width, shown uncropped at its own
  // ratio, and everything else runs in rows beneath it.
  const wide = feature.media.aspect === '49/20'
  const besideCount = wide
    ? 0
    : others.length <= 2
      ? others.length
      : (others.length - 2) % 3 === 1
        ? 1
        : 2
  const beside = others.slice(0, besideCount)
  const rest = others.slice(besideCount)
  const pairAtEnd = rest.length % 3 === 2
  const featureClass = wide
    ? 'aspect-[49/20] md:col-span-6'
    : besideCount === 1
      ? 'aspect-[3/2] md:col-span-3'
      : besideCount === 0
        ? 'aspect-[3/2] md:col-span-4'
        : 'aspect-[3/2] md:col-span-4 md:row-span-2 md:aspect-auto'

  return (
    <div>
      <h3 className="font-[var(--font-display)] text-[length:var(--text-step-2)] font-[300] leading-[var(--lh-snug)] text-text-primary">
        {occasion}
      </h3>
      {date && (
        <p className="mt-2 font-[var(--font-ui)] text-[length:var(--text-step--1)] text-text-muted">
          <time dateTime={date}>{monthYear(date)}</time>
        </p>
      )}
      <span aria-hidden="true" className="mt-3 block h-0.5 w-10 bg-accent" />

      <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-4">
        <li className={`${frame} col-span-2 ${featureClass}`}>
          <Photo
            photo={feature}
            sizes={
              wide
                ? '(min-width: 1280px) 1136px, 100vw'
                : '(min-width: 1280px) 740px, (min-width: 768px) 60vw, 100vw'
            }
          />
        </li>
        {beside.map((p) => (
          <li
            key={p.id}
            className={`${frame} aspect-[3/2] ${
              besideCount === 1 ? 'col-span-2 md:col-span-3' : 'md:col-span-2'
            }`}
          >
            <Photo
              photo={p}
              sizes={
                besideCount === 1
                  ? '(min-width: 1280px) 540px, (min-width: 768px) 45vw, 100vw'
                  : '(min-width: 1280px) 360px, (min-width: 768px) 30vw, 50vw'
              }
            />
          </li>
        ))}
      </ul>

      {rest.length > 0 && (
        <ul className="mt-3 grid grid-cols-2 gap-3 md:mt-4 md:grid-cols-6 md:gap-4">
          {rest.map((p, i) => {
            const half = pairAtEnd && i >= rest.length - 2
            const loneOnPhone = rest.length % 2 === 1 && i === rest.length - 1
            return (
              <li
                key={p.id}
                className={`${frame} aspect-[3/2] ${
                  half ? 'md:col-span-3' : 'md:col-span-2'
                } ${loneOnPhone ? 'col-span-2' : ''}`}
              >
                <Photo
                  photo={p}
                  sizes={
                    half
                      ? '(min-width: 1280px) 540px, (min-width: 768px) 45vw, 50vw'
                      : '(min-width: 1280px) 360px, (min-width: 768px) 30vw, 50vw'
                  }
                />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export function EventMoments({
  groups,
}: {
  groups: { occasion: string; date?: string; photos: EventPhoto[] }[]
}) {
  return (
    <div className="space-y-14 md:space-y-20">
      {groups.map((g) => (
        <Occasion
          key={g.occasion}
          occasion={g.occasion}
          date={g.date}
          photos={g.photos}
        />
      ))}
    </div>
  )
}
