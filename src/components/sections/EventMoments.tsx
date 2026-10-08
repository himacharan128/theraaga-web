import Image from 'next/image'
import type { EventPhoto } from '@/content/types'
import { monthYear } from '@/lib/dates'

/**
 * Photographs from past RAAGA events, told occasion by occasion.
 *
 * The consent gate has already run in the DAL (`getEventPhotos`), so anything
 * depicting a minor without recorded guardian consent never reaches this
 * component. It renders whatever it is given; the caller renders nothing at
 * all when there is nothing to give.
 *
 * On a wide screen the occasions are listed in a sticky index beside the
 * photographs, so a long run of pictures can be navigated like a chronology;
 * on a phone each occasion simply opens with its heading.
 *
 * Each occasion is laid out so that no count leaves a hole or a panoramic
 * sliver. On a desktop (a six-column grid) the first photograph is the feature
 * and either two stacked tiles sit beside it, or one equal tile when that keeps
 * the remainder tidy. Whatever follows runs in rows of three, and the last two
 * tiles go half-width each if the count would otherwise leave one on its own.
 * A panoramic feature (aspect 49/20) instead spans the full width at its own
 * ratio, so nobody in it is cropped, with the rest in rows of three below.
 * An occasion with a single photograph is a smaller entry, set as a plate with
 * its heading beside it. On a phone it is two columns, with a lone last tile
 * full width.
 *
 * All tiles are 3:2 crops via `object-cover`; `focus` keeps an off-centre
 * subject in frame. Every photograph is lazy: none of it is needed for the
 * first paint.
 *
 * `skip` leaves out the photograph the page has already set in its hero, so
 * nothing is shown twice; an occasion left with no photographs is dropped.
 */

type Group = { occasion: string; date?: string; photos: EventPhoto[] }

const tile = 'media group'
const zoom =
  'object-cover transition-transform duration-[var(--dur-3)] ease-[var(--ease-raaga)] motion-safe:lg:group-hover:scale-[1.025]'

const SIZES = {
  wide: '(min-width: 1280px) 880px, (min-width: 1024px) 70vw, 100vw',
  feature: '(min-width: 1280px) 590px, (min-width: 1024px) 48vw, (min-width: 768px) 66vw, 100vw',
  half: '(min-width: 1280px) 440px, (min-width: 1024px) 36vw, (min-width: 768px) 50vw, 100vw',
  third: '(min-width: 1280px) 295px, (min-width: 1024px) 24vw, (min-width: 768px) 33vw, 50vw',
}

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

/** A stable in-page anchor for an occasion. */
export function occasionAnchor(occasion: string) {
  return `occasion-${occasion
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`
}

function OccasionHeading({ group, n }: { group: Group; n: number }) {
  return (
    <>
      <span aria-hidden="true" className="t-numeral text-[1.25rem] text-kicker">
        {String(n).padStart(2, '0')}
      </span>
      <div>
        <h3 className="t-subhead text-balance text-fg">{group.occasion}</h3>
        {group.date && (
          <p className="t-meta mt-2 text-fg-3">
            <time dateTime={group.date}>{monthYear(group.date)}</time>
          </p>
        )}
      </div>
    </>
  )
}

/**
 * An occasion with one photograph is a smaller entry: the picture at two
 * thirds of the measure with its heading beside it, like a plate and its
 * caption, rather than one photograph stretched across the page.
 */
function SingleOccasion({ group, n }: { group: Group; n: number }) {
  const [photo] = group.photos
  return (
    <article
      id={occasionAnchor(group.occasion)}
      className="reveal grid scroll-mt-[calc(var(--header-h)+1.5rem)] gap-y-6 border-t border-line pt-6 md:grid-cols-6 md:gap-x-3 md:pt-8"
    >
      <header className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-3 md:order-2 md:col-span-2 md:grid-cols-[2.25rem_1fr] md:pl-4">
        <OccasionHeading group={group} n={n} />
      </header>
      <div className={`${tile} aspect-[3/2] md:order-1 md:col-span-4`}>
        <Photo photo={photo} sizes={SIZES.feature} />
      </div>
    </article>
  )
}

function Occasion({ group, n }: { group: Group; n: number }) {
  const [feature, ...others] = group.photos
  // Choose how many sit beside the feature so the rest divides into rows of
  // three, or into rows of three plus a final pair. A panoramic feature takes
  // the whole width, shown uncropped at its own ratio.
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
      : 'aspect-[3/2] md:col-span-4 md:row-span-2 md:aspect-auto'

  return (
    <article id={occasionAnchor(group.occasion)} className="scroll-mt-[calc(var(--header-h)+1.5rem)]">
      <header className="reveal grid grid-cols-[2.5rem_1fr] items-baseline gap-x-3 border-t border-line pt-6 md:grid-cols-[3.5rem_1fr] md:pt-8">
        <OccasionHeading group={group} n={n} />
      </header>

      <ul className="reveal mt-6 grid grid-cols-2 gap-2 md:mt-8 md:grid-cols-6 md:gap-3">
        <li className={`${tile} col-span-2 ${featureClass}`}>
          <Photo
            photo={feature}
            sizes={wide ? SIZES.wide : besideCount === 1 ? SIZES.half : SIZES.feature}
          />
        </li>
        {beside.map((p) => (
          <li
            key={p.id}
            className={`${tile} aspect-[3/2] ${besideCount === 1 ? 'col-span-2 md:col-span-3' : 'md:col-span-2'}`}
          >
            <Photo photo={p} sizes={besideCount === 1 ? SIZES.half : SIZES.third} />
          </li>
        ))}
      </ul>

      {rest.length > 0 && (
        <ul className="reveal mt-2 grid grid-cols-2 gap-2 md:mt-3 md:grid-cols-6 md:gap-3">
          {rest.map((p, i) => {
            const half = pairAtEnd && i >= rest.length - 2
            const loneOnPhone = rest.length % 2 === 1 && i === rest.length - 1
            return (
              <li
                key={p.id}
                className={`${tile} aspect-[3/2] ${half ? 'md:col-span-3' : 'md:col-span-2'} ${
                  loneOnPhone ? 'col-span-2' : ''
                }`}
              >
                <Photo photo={p} sizes={half ? SIZES.half : SIZES.third} />
              </li>
            )
          })}
        </ul>
      )}
    </article>
  )
}

export function EventMoments({ groups, skip }: { groups: Group[]; skip?: string }) {
  const shown = groups
    .map((g) => ({ ...g, photos: g.photos.filter((p) => p.id !== skip) }))
    .filter((g) => g.photos.length > 0)

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-10">
      <nav aria-label="Occasions" className="hidden lg:col-span-3 lg:block">
        <div className="sticky top-[calc(var(--header-h)+2rem)]">
          <p className="t-label text-fg-3">Occasions</p>
          <ol className="mt-4 border-t border-line">
            {shown.map((g, i) => (
              <li key={g.occasion} className="border-b border-line">
                <a
                  href={`#${occasionAnchor(g.occasion)}`}
                  className="group grid grid-cols-[1.75rem_1fr] gap-x-2 py-3 no-underline"
                >
                  <span aria-hidden="true" className="t-meta text-fg-3">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="t-small text-fg-2 transition-colors duration-[var(--dur-1)] group-hover:text-kicker">
                    {g.occasion}
                    {g.date && <span className="block text-fg-3">{monthYear(g.date)}</span>}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      <div className="space-y-16 md:space-y-24 lg:col-span-9">
        {shown.map((g, i) =>
          g.photos.length === 1 && g.photos[0].media.aspect !== '49/20' ? (
            <SingleOccasion key={g.occasion} group={g} n={i + 1} />
          ) : (
            <Occasion key={g.occasion} group={g} n={i + 1} />
          ),
        )}
      </div>
    </div>
  )
}
