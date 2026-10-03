import Image from 'next/image'
import type { LineageReference } from '@/content/seed'

/**
 * The maestros the Gurus trained under, as cards.
 *
 * Each card is complete as TEXT: an accent rule, the name with its honorific,
 * and the client-approved note. A portrait, when an entry has one, is added
 * above or beside that. There is no frame waiting to be filled, so an entry
 * without a photograph is a finished card and not a card with something
 * missing.
 *
 * Two or more entries sit in a two-up grid, portrait above text. A lone entry
 * would be half of that grid with a hole beside it, so it gets one wider
 * horizontal card instead: portrait left, text right, stacked on a phone.
 *
 * Nothing here may attach a maestro to a specific Guru; the notes say what the
 * client's content master says and no more.
 */
export function LineageCards({ entries }: { entries: LineageReference[] }) {
  const single = entries.length === 1

  return (
    <ul
      className={
        single
          ? 'max-w-4xl'
          : 'grid gap-6 sm:grid-cols-2 lg:max-w-4xl lg:gap-8'
      }
    >
      {entries.map((entry) => (
        <li
          key={entry.order}
          className={`flex overflow-hidden rounded-[var(--radius-md)] border border-border bg-elevated shadow-[var(--shadow-soft)] ${
            single ? 'flex-col md:flex-row' : 'flex-col'
          }`}
        >
          {entry.photo ? (
            <figure className={single ? 'md:w-[19rem] md:shrink-0' : undefined}>
              <Image
                src={entry.photo}
                alt={`Portrait of ${entry.honorific ? `${entry.honorific} ` : ''}${entry.name}`}
                sizes={
                  single
                    ? '(min-width: 768px) 304px, calc(100vw - 2rem)'
                    : '(min-width: 1024px) 432px, (min-width: 640px) 45vw, calc(100vw - 2rem)'
                }
                placeholder="blur"
                loading="lazy"
                className="h-auto w-full"
              />
            </figure>
          ) : null}
          <div
            className={`flex flex-1 flex-col p-7 md:p-9 ${
              single ? 'md:justify-center md:p-12' : ''
            }`}
          >
            <span
              aria-hidden="true"
              className="mb-5 block h-0.5 w-10 bg-accent"
            />
            <h3 className="font-[var(--font-display)] text-[length:var(--text-step-2)] font-[400] leading-[var(--lh-snug)] text-text-primary">
              {entry.honorific ? `${entry.honorific} ` : ''}
              {entry.name}
            </h3>
            {entry.note ? (
              <p className="mt-4 text-[length:var(--text-step--1)] text-text-secondary">
                {entry.note}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  )
}
