import Image, { type StaticImageData } from 'next/image'
import type { CSSProperties, ReactNode } from 'react'

/**
 * The inner-page hero: every page opens the way the homepage does, on the
 * deep maroon chapter between two zari borders, so the site reads as one
 * programme from cover to cover (the owner asked for uniform colour across
 * the site on 2026-11-12). Within that, four compositions, chosen per page so
 * no two neighbouring pages open the same way:
 *
 *   editorial  the title large on the left; the lede and actions held in an
 *              offset column beneath it, so the page opens asymmetrically.
 *   statement  the title at hero scale with almost nothing beside it, for a
 *              page whose heading is its argument (About, 404).
 *   image      an authentic photograph stands in a brass niche at the right,
 *              as the carving does on the homepage; on a phone it follows
 *              the lede. Without a photograph it is `editorial`.
 *   archive    a publication masthead: the title and its context on the left,
 *              a ruled index of what the page holds on the right.
 *
 * `night` is accepted for older call sites and reads as `editorial`.
 *
 * The header sits on the parchment above the chapter, so no hero tone is
 * declared. The eyebrow keeps its words exactly. Where it is a run of parts
 * separated by " · " it is set as a programme header, one cell per part, with
 * any Devanagari in Tiro rather than in a system fallback.
 */
type Variant = 'editorial' | 'statement' | 'night' | 'image' | 'archive'

export type HeroMedia = {
  src: string | StaticImageData
  alt: string
  /** CSS object-position, for a subject that sits off-centre. */
  focus?: string
  /** What and when, set beneath the photograph as its credit line. */
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
}: {
  eyebrow: string
  title: ReactNode
  lede?: ReactNode
  children?: ReactNode
  aside?: ReactNode
  variant?: Variant
  /** The photograph for the `image` composition. Without one it falls back to `editorial`. */
  media?: HeroMedia
  /** The ruled index for the `archive` composition: in-page links to its chapters. */
  index?: HeroIndexEntry[]
}) {
  const kind: Variant =
    variant === 'night' || (variant === 'image' && !media) ? 'editorial' : variant
  const withNiche = kind === 'image' && media
  const twoColumn = kind === 'archive' || withNiche

  return (
    <section data-tone="dark" className="tone-maroon relative">
      <div aria-hidden="true" className="zari" />
      <div
        className={`u-shell relative py-[clamp(2.5rem,6vw,5rem)] ${twoColumn ? 'lg:grid lg:grid-cols-12 lg:gap-x-10' : ''}`}
      >
        <div className={twoColumn ? 'lg:col-span-8' : ''}>
          <ProgrammeHeader text={eyebrow} />

          <h1
            className={`on-load mt-6 text-fg md:mt-8 ${
              kind === 'statement' ? 't-hero max-w-[16ch]' : 't-display max-w-[18ch]'
            }`}
            style={d(60)}
          >
            {title}
          </h1>

          {twoColumn && lede && (
            <div className="on-load t-standfirst mt-8 max-w-[46ch] text-fg-2 md:mt-10" style={d(240)}>
              {lede}
            </div>
          )}
          {twoColumn && children && (
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

        {withNiche && (
          <figure
            className="on-load mt-12 w-full max-w-60 justify-self-center text-center lg:col-span-4 lg:col-start-9 lg:mt-0 lg:max-w-[300px] lg:justify-self-end lg:self-center"
            style={d(200)}
          >
            <div className="niche">
              <div className="media relative h-[320px] lg:h-[420px]">
                <Image
                  src={media.src}
                  alt={media.alt}
                  fill
                  preload
                  sizes="(min-width: 1024px) 300px, 240px"
                  className="object-cover"
                  style={media.focus ? { objectPosition: media.focus } : undefined}
                />
              </div>
            </div>
            {media.caption && (
              <figcaption className="t-meta mt-5 flex items-center justify-center gap-3 text-fg-3">
                <span aria-hidden="true" className="size-1.5 shrink-0 rotate-45 bg-mark" />
                <span>{media.caption}</span>
              </figcaption>
            )}
          </figure>
        )}

        {!twoColumn && (lede || children || aside) && (
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
      </div>
      <div aria-hidden="true" className="zari" />
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
