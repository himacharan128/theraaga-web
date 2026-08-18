import Image from 'next/image'
import type { GalleryItem } from '@/content/types'

/**
 * The data-driven gallery. Renders REAL assets only.
 *
 * Three rules, and the first two are the ones that make or break how finished
 * the page looks:
 *
 *  1. Never a placeholder card, a grey box or dummy photography. If an item
 *     has no media it is not in the array; if the array is empty this component
 *     is not rendered at all. The caller owns the empty state.
 *  2. Never a bare YouTube iframe. web.dev measures those at 500 KB+ and up to
 *     2 MB of JavaScript; this renders a poster facade that links out, which is
 *     ~0 KB until tapped.
 *  3. The consent gate has already run in the DAL — anything depicting a minor
 *     without recorded guardian consent never reaches this component. That
 *     filter lives in the query on purpose, so no UI change can bypass it.
 *
 * Loading: the first six items are eager with real `sizes`, everything after is
 * lazy. On a 360px Android over mobile data, a 40-image masonry that all loads
 * at once is the single most expensive mistake this page could make.
 */
const EAGER_COUNT = 6

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  if (items.length === 0) return null

  return (
    <ul className="columns-2 gap-3 md:columns-3 md:gap-5 [&>li]:mb-3 md:[&>li]:mb-5">
      {items.map((item, i) => (
        <li key={item.id} className="group break-inside-avoid">
          <figure>
            <div
              style={{ aspectRatio: item.media.aspect }}
              className="relative w-full overflow-hidden rounded-[var(--radius-sm)] border border-border bg-surface shadow-[0_8px_20px_rgba(71,49,34,0.05)]"
            >
              <Image
                src={item.media.src}
                alt={item.media.alt}
                fill
                sizes="(min-width: 768px) 33vw, 50vw"
                loading={i < EAGER_COUNT ? 'eager' : 'lazy'}
                className="object-cover transition-transform duration-500 ease-[var(--ease-raaga)] group-hover:scale-[1.035] motion-reduce:transition-none"
              />
              {item.kind === 'video' && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="flex size-14 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-accent)_88%,transparent)] text-on-accent shadow-[0_10px_24px_rgba(32,27,26,0.22)] transition-transform duration-[var(--dur)] group-hover:scale-110 motion-reduce:transition-none">
                    <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
                      <path d="M2 1.5l12 7.5-12 7.5V1.5Z" fill="currentColor" />
                    </svg>
                  </span>
                </span>
              )}
            </div>
            {item.caption && (
              <figcaption className="mt-2 px-1 text-[length:var(--text-step--1)] leading-[var(--lh-body)] text-text-muted">
                {item.caption}
              </figcaption>
            )}
          </figure>
        </li>
      ))}
    </ul>
  )
}
