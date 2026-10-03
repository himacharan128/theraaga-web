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
 * Each occasion is laid out so that no count leaves a hole in the grid:
 *   - the first photograph is the feature, two thirds wide on a desktop;
 *   - up to two more sit beside it (one tall one if only one follows);
 *   - anything after that flows in rows of fixed height that stretch to fill
 *     the last row, so an odd remainder is never an orphan with an empty cell.
 *
 * All tiles crop with `object-cover`; the photographs are 3:2, 4:3 or 16:9.
 * Every photograph is lazy: the section sits below the hero and the ledger, so
 * none of it is needed for the first paint.
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
      className={zoom}
    />
  )
}

function Occasion({
  occasion,
  photos,
}: {
  occasion: string
  photos: EventPhoto[]
}) {
  const [feature, ...others] = photos
  const beside = others.slice(0, 2)
  const rest = others.slice(2)

  return (
    <div>
      <h3 className="font-[var(--font-display)] text-[length:var(--text-step-2)] font-[300] leading-[var(--lh-snug)] text-text-primary">
        {occasion}
      </h3>
      <span aria-hidden="true" className="mt-3 block h-0.5 w-10 bg-accent" />

      <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        <li
          className={`${frame} col-span-2 aspect-[3/2] ${
            beside.length === 0 ? 'md:col-span-3 md:mx-auto md:w-2/3' : 'md:row-span-2 md:aspect-auto'
          }`}
        >
          <Photo
            photo={feature}
            sizes="(min-width: 1280px) 740px, (min-width: 768px) 60vw, 100vw"
          />
        </li>
        {beside.map((p) => (
          <li
            key={p.id}
            className={`${frame} aspect-[3/2] ${
              beside.length === 1 ? 'col-span-2 md:col-span-1 md:row-span-2 md:aspect-auto' : ''
            }`}
          >
            <Photo
              photo={p}
              sizes="(min-width: 1280px) 360px, (min-width: 768px) 30vw, 50vw"
            />
          </li>
        ))}
      </ul>

      {rest.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-3 md:mt-4 md:gap-4">
          {rest.map((p) => (
            <li
              key={p.id}
              className={`${frame} h-36 grow basis-[calc(50%-0.375rem)] sm:h-48 md:h-60 md:basis-[calc(33.333%-0.7rem)]`}
            >
              <Photo
                photo={p}
                sizes="(min-width: 1280px) 400px, (min-width: 768px) 33vw, 50vw"
                />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function EventMoments({
  groups,
}: {
  groups: { occasion: string; photos: EventPhoto[] }[]
}) {
  return (
    <div className="space-y-14 md:space-y-20">
      {groups.map((g) => (
        <Occasion key={g.occasion} occasion={g.occasion} photos={g.photos} />
      ))}
    </div>
  )
}
