import type { LineageReference } from '@/content/seed'

/**
 * The maestros the Gurus trained under, as a two-up set of cards.
 *
 * Each card is complete as TEXT: an accent rule, the name with its honorific,
 * and the client-approved note. There is no portrait frame waiting to be
 * filled, so an entry without a photograph is a finished card and not a card
 * with something missing.
 *
 * Nothing here may attach a maestro to a specific Guru; the notes say what the
 * client's content master says and no more.
 */
export function LineageCards({ entries }: { entries: LineageReference[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:max-w-4xl lg:gap-8">
      {entries.map((entry) => (
        <li
          key={entry.order}
          className="flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-border bg-elevated shadow-[var(--shadow-soft)]"
        >
          <div className="flex flex-1 flex-col p-7 md:p-9">
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
