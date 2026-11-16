import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Arrow } from '@/components/ui/Button'
import type { GuruProfile } from '@/content/seed'

/**
 * The Gurus who teach here, one entry each, linking to the profile page.
 *
 * Each entry is complete as TEXT: the title as a label, the name at display
 * size, and one line of what the teacher has stated (qualification, years in
 * music, years teaching). A portrait is added only when the profile has one;
 * there is no frame waiting for a photograph, so a teacher without one is a
 * finished entry and not a silhouette. The photographs are to follow and
 * adding one costs an import in `content/seed/gurus.ts`.
 *
 * The facts are the teacher's own, supplied to the owner; see the provenance
 * note on each profile page.
 */
export function GuruCards({ profiles }: { profiles: GuruProfile[] }) {
  return (
    <ul className="grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
      {profiles.map((g, i) => {
        const fullName = g.honorific ? `${g.honorific} ${g.name}` : g.name
        const line = [
          g.qualification,
          g.experience ? `${g.experience.music} in music` : null,
          g.experience ? `${g.experience.teaching} teaching` : null,
        ].filter(Boolean)
        return (
          <li key={g.slug} className="reveal" style={{ '--i': i } as CSSProperties}>
            <Link href={`/gurus/${g.slug}`} className="group block no-underline">
              {g.photo && (
                <div className="plate mb-8 max-w-[20rem]">
                  <Image
                    src={g.photo}
                    alt={`Portrait of ${fullName}`}
                    sizes="(min-width: 1024px) 20rem, (min-width: 768px) 45vw, calc(100vw - 3.5rem)"
                    placeholder="blur"
                    loading="lazy"
                    className="h-auto w-full"
                  />
                </div>
              )}
              <span className="t-label block text-kicker">{g.role}</span>
              <span className="t-subhead mt-4 block text-balance text-fg transition-colors duration-[var(--dur-2)] group-hover:text-kicker">
                {fullName}
              </span>
              {line.length > 0 && (
                <span className="t-small mt-5 block max-w-[34ch] text-fg-2">{line.join(' · ')}</span>
              )}
              <span className="link-arrow mt-6">
                Read the profile
                <Arrow className="group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
