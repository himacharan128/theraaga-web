import Image, { type StaticImageData } from 'next/image'
import type { CSSProperties, ReactNode } from 'react'

/**
 * The inner-page hero: one family, five compositions, chosen per page so no
 * two neighbouring pages open the same way. All share the programme header.
 *
 *   editorial  the title large on the left; the lede and actions held in an
 *              offset column beneath it, so the page opens asymmetrically.
 *   statement  the title at hero scale with almost nothing beside it, for a
 *              page whose heading is its argument (About, 404).
 *   night      the dark stage. On the Gurus page it carries one fine
 *              ornament (`thread`): a brass thread with three nodes down the
 *              right margin, the lineage drawn rather than described. Wide
 *              screens only.
 *   image      immersive: an authentic photograph fills the right of a dark
 *              stage and fades into it, the title set on the dark beside it.
 *              On a phone the photograph comes first, full bleed, and the
 *              title rises over its faded foot.
 *   archive    a publication masthead: the title and its context on the left,
 *              a ruled index of what the page holds on the right.
 *
 * The dark compositions slide up under the transparent header and say so with
 * data-hero-tone, so the header takes the night ink from the first paint (see
 * app/styles/tones.css).
 *
 * The eyebrow keeps its words exactly. Where it is a run of parts separated by
 * " · " it is set as a programme header, one cell per part, with any
 * Devanagari in Tiro rather than in a system fallback.
 */
type Variant = 'editorial' | 'statement' | 'night' | 'image' | 'archive'

export type HeroMedia = {
  src: string | StaticImageData
  alt: string
  /** CSS object-position, for a subject that sits off-centre. */
  focus?: string
  /** What and when, set beneath the title as the photograph's credit line. */
  caption?: ReactNode
}

export type HeroIndexEntry = { href: string; label: string; detail?: string }

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

export function PageHero({
  eyebrow,
  title,
  lede,
  children,
  aside,
  variant = 'editorial',
  media,
  index,
  thread = false,
}: {
  eyebrow: string
  title: ReactNode
  lede?: ReactNode
  children?: ReactNode
  aside?: ReactNode
  variant?: Variant
  /** The photograph for the `image` composition. Without one it falls back to `night`. */
  media?: HeroMedia
  /** The ruled index for the `archive` composition: in-page links to its chapters. */
  index?: HeroIndexEntry[]
  /** The lineage thread down the night hero's margin. For the page about the lineage. */
  thread?: boolean
}) {
  if (variant === 'image' && media) {
    return <ImageHero eyebrow={eyebrow} title={title} lede={lede} media={media} actions={children} />
  }
  const kind: Variant = variant === 'image' ? 'night' : variant
  const night = kind === 'night'

  return (
    <section
      data-hero-tone={night ? 'dark' : undefined}
      data-tone={night ? 'dark' : undefined}
      className={
        night
          ? 'tone-night relative -mt-[var(--header-h)] pt-[calc(var(--header-h)+clamp(3rem,8vw,7rem))] pb-[clamp(3.5rem,8vw,7rem)]'
          : 'relative pt-[clamp(2.5rem,6vw,5.5rem)]'
      }
    >
      <div className={`u-shell relative ${kind === 'archive' ? 'lg:grid lg:grid-cols-12 lg:gap-x-10' : ''}`}>
        <div className={kind === 'archive' ? 'lg:col-span-8' : night && thread ? 'lg:pr-28' : ''}>
          <ProgrammeHeader text={eyebrow} />

          <h1
            className={`on-load mt-6 text-fg md:mt-8 ${
              kind === 'statement' ? 't-hero max-w-[16ch]' : 't-display max-w-[18ch]'
            }`}
            style={d(60)}
          >
            {title}
          </h1>

          {kind === 'archive' && lede && (
            <div className="on-load t-standfirst mt-8 max-w-[46ch] text-fg-2 md:mt-10" style={d(240)}>
              {lede}
            </div>
          )}
          {kind === 'archive' && children && (
            <div className="on-load mt-8 flex flex-wrap gap-3 md:mt-10" style={d(320)}>
              {children}
            </div>
          )}
        </div>

        {kind === 'archive' && index && index.length > 0 && (
          <nav
            aria-label="On this page"
            className="on-load mt-12 lg:col-span-4 lg:col-start-9 lg:mt-0 lg:self-end xl:col-span-3 xl:col-start-10"
            style={d(360)}
          >
            <p className="t-label text-fg-3">On this page</p>
            <ol className="mt-4 border-t border-line-strong/50">
              {index.map((entry, i) => (
                <li key={entry.href} className="border-b border-line">
                  <a
                    href={entry.href}
                    className="group flex min-h-12 items-baseline gap-4 py-3 no-underline"
                  >
                    <span aria-hidden="true" className="t-meta w-5 text-fg-3">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="t-title flex-1 text-fg transition-colors duration-[var(--dur-1)] group-hover:text-kicker">
                      {entry.label}
                    </span>
                    {entry.detail && <span className="t-meta text-fg-3">{entry.detail}</span>}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {kind !== 'archive' && (lede || children || aside) && (
          <div className="mt-8 grid gap-x-10 gap-y-8 md:mt-12 lg:grid-cols-12">
            {(lede || children) && (
              <div
                className={`on-load ${aside ? 'lg:col-span-7' : 'lg:col-span-7 lg:col-start-5'}`}
                style={d(240)}
              >
                {lede && <div className="t-standfirst max-w-[46ch] text-fg-2">{lede}</div>}
                {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
              </div>
            )}
            {aside && (
              <div className="on-load lg:col-span-4 lg:col-start-9" style={d(360)}>
                {aside}
              </div>
            )}
          </div>
        )}

        {night && thread && <LineageThread />}
      </div>
      {!night && (
        <div className="u-shell mt-[clamp(3rem,6vw,5.5rem)]" aria-hidden="true">
          <div className="on-load-draw draw-x h-px bg-line" />
        </div>
      )}
    </section>
  )
}

/**
 * The night hero's one ornament: a brass hairline down the right margin with
 * three nodes on it, a lineage drawn as a line of succession. Decorative, so
 * hidden from assistive technology; wide screens only, where the margin is
 * empty anyway.
 */
function LineageThread() {
  return (
    <div
      aria-hidden="true"
      className="on-load pointer-events-none absolute inset-y-0 right-[var(--gutter)] hidden w-3 lg:block"
      style={d(700)}
    >
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[linear-gradient(to_bottom,transparent,var(--mark)_18%,var(--mark)_82%,transparent)]" />
      {['22%', '50%', '78%'].map((top) => (
        <span
          key={top}
          className="absolute left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-[var(--mark)] bg-[var(--tone-bg)]"
          style={{ top }}
        />
      ))}
    </div>
  )
}

/** The immersive composition. See PageHero. */
function ImageHero({
  eyebrow,
  title,
  lede,
  media,
  actions,
}: {
  eyebrow: string
  title: ReactNode
  lede?: ReactNode
  media: HeroMedia
  actions?: ReactNode
}) {
  return (
    <section
      data-hero-tone="dark"
      data-tone="dark"
      className="tone-night relative -mt-[var(--header-h)] overflow-hidden lg:flex lg:min-h-[min(100svh,54rem)] lg:items-end"
    >
      {/* The photograph: full bleed on a phone, the right of the stage on a
          wide screen. Two scrims fade it into the dark, so the type never sits
          on the busy part of the picture: on a phone or tablet the foot of the
          photograph is solid night for the height the title overlaps it. */}
      <div className="media on-load-unveil relative aspect-[4/5] sm:aspect-[3/2] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[58%]">
        <Image
          src={media.src}
          alt={media.alt}
          fill
          preload
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="on-load-settle object-cover"
          style={media.focus ? { objectPosition: media.focus } : undefined}
        />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,var(--color-night)_40%,transparent)] lg:inset-y-0 lg:left-0 lg:h-auto lg:w-1/2 lg:bg-[linear-gradient(to_right,var(--color-night),transparent)]"
        />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(to_bottom,rgb(29_23_20/0.7),transparent)]"
        />
      </div>

      <div className="u-shell relative -mt-20 pb-[clamp(3rem,7vw,6rem)] sm:-mt-24 lg:mt-0 lg:w-full lg:pt-[calc(var(--header-h)+4rem)]">
        <div className="lg:max-w-[46%]">
          <ProgrammeHeader text={eyebrow} />
          <h1 className="t-display on-load mt-6 max-w-[14ch] text-fg md:mt-8" style={d(60)}>
            {title}
          </h1>
          {lede && (
            <div className="on-load t-standfirst mt-8 max-w-[40ch] text-fg-2" style={d(240)}>
              {lede}
            </div>
          )}
          {actions && (
            <div className="on-load mt-8 flex flex-wrap gap-3" style={d(320)}>
              {actions}
            </div>
          )}
          {media.caption && (
            <p className="on-load t-meta mt-10 flex items-center gap-3 text-fg-3 md:mt-14" style={d(420)}>
              <span aria-hidden="true" className="size-1.5 shrink-0 rotate-45 bg-mark" />
              <span>{media.caption}</span>
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

const DEVANAGARI = /[ऀ-ॿ]/

/**
 * "Parampara · परम्परा · Our heritage" set as a ruled programme header: each
 * part in its own cell, Devanagari in Tiro and marked as Sanskrit.
 *
 * Each diamond travels with the part before it, as punctuation does, so a
 * narrow screen breaks after a diamond and never opens a line on one; the
 * wrapped line aligns with the text, not the rule. The diamonds are hidden
 * from assistive technology, so a spoken pause stands in for each.
 */
export function ProgrammeHeader({ text, className = '' }: { text: string; className?: string }) {
  const parts = text.split(' · ')
  return (
    <p className={`on-load flex items-center gap-x-3 text-kicker ${className}`} style={{ '--d': '0ms' } as CSSProperties}>
      <span aria-hidden="true" className="h-px w-6 shrink-0 bg-mark" />
      <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {parts.map((part, i) => (
          <span key={part} className="flex items-center gap-x-3">
            {DEVANAGARI.test(part) ? (
              <span lang="sa" className="deva text-[1.05rem] leading-none">
                {part}
              </span>
            ) : (
              <span className="t-label">{part}</span>
            )}
            {i < parts.length - 1 && (
              <>
                <span aria-hidden="true" className="size-1 shrink-0 rotate-45 bg-mark" />
                <span className="sr-only">, </span>
              </>
            )}
          </span>
        ))}
      </span>
    </p>
  )
}
