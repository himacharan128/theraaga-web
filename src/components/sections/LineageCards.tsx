import Image from 'next/image'
import type { CSSProperties } from 'react'
import type { LineageReference } from '@/content/seed'

/**
 * The maestros the Gurus trained under, set like an archive's portrait
 * plates: the photograph mounted on paper, and beside it a museum label (the
 * honorific in small capitals, the name at display size, the client-approved
 * note beneath a brass rule).
 *
 * Each entry is complete as TEXT. A portrait is added when an entry has one;
 * there is no frame waiting to be filled, so an entry without a photograph is
 * a finished label and not a plate with something missing.
 *
 * A lone entry is set wide, portrait left and label right (stacked on a
 * phone). Two or more sit two-up, portrait above label, so a second maestro
 * never leaves a hole beside the first.
 *
 * Nothing here may attach a maestro to a specific Guru; the notes say what the
 * client's content master says and no more.
 */
export function LineageCards({ entries }: { entries: LineageReference[] }) {
  const single = entries.length === 1

  return (
    <ul className={single ? '' : 'grid gap-x-10 gap-y-16 md:grid-cols-2'}>
      {entries.map((entry, i) => {
        const fullName = `${entry.honorific ? `${entry.honorific} ` : ''}${entry.name}`
        return (
          <li
            key={entry.order}
            className={`reveal grid gap-y-8 ${single ? 'md:grid-cols-12 md:items-center md:gap-x-10' : ''}`}
            style={{ '--i': i } as CSSProperties}
          >
            {entry.photo ? (
              <figure className={single ? 'md:col-span-5 lg:col-span-4' : ''}>
                <div className="plate max-w-[26rem]">
                  <Image
                    src={entry.photo}
                    alt={`Portrait of ${fullName}`}
                    sizes="(min-width: 768px) 26rem, calc(100vw - 3.5rem)"
                    placeholder="blur"
                    loading="lazy"
                    className="h-auto w-full"
                  />
                </div>
              </figure>
            ) : null}
            <div className={single ? 'md:col-span-7 md:col-start-6 lg:col-span-6 lg:col-start-6' : ''}>
              <h3>
                {entry.honorific && (
                  <span className="t-label block text-kicker">{entry.honorific}</span>
                )}
                <span className="t-display mt-4 block text-balance text-fg">{entry.name}</span>
              </h3>
              {entry.note ? (
                <>
                  <span aria-hidden="true" className="mt-8 block h-px w-16 bg-mark" />
                  <p className="t-standfirst mt-8 max-w-[38ch] text-fg-2">{entry.note}</p>
                </>
              ) : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
