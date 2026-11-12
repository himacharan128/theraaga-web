import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Section } from '@/components/layout/Section'
import { Arrow } from '@/components/ui/Button'
import { getCentres, getSite } from '@/data/content'
import type { Centre } from '@/content/types'

/**
 * The router. 14 of 19 music schools studied put one immediately below the
 * hero, and RAAGA's router is not instrument, it is WHERE: a parent scrolling
 * a WhatsApp forward answers exactly one question first, "is this near me, or
 * can we do it from home?"
 *
 * The two centres are mounted on paper inside a double brass frame with
 * corner brackets, like plates in a programme; no photographs, by the owner's
 * decision on 2026-11-12. Online and community classes follow as a quieter
 * ruled pair.
 *
 * TITLES. The two centres read "RAAGA, Jubilee Hills" and "RAAGA, Phoenix
 * Arena", so the school's name is on each card a parent might screenshot.
 */
function Plate({ centre: c, title, index }: { centre: Centre; title: string; index: number }) {
  return (
    <li className="reveal" style={{ '--i': index } as CSSProperties}>
      <Link
        href={c.href}
        className="group frame-brass bracket tone-paper flex h-full flex-col p-7 no-underline md:p-9"
      >
        <p className="t-label text-accent-muted">{c.locality}</p>
        <h3 className="t-subhead mt-3 text-fg transition-colors duration-[var(--dur-2)] group-hover:text-kicker">
          {title}
        </h3>
        <p className="t-body mt-4 max-w-[44ch] flex-1 text-fg-2">{c.body}</p>
        <span className="link-arrow mt-6 self-start">
          {c.cta}
          <Arrow />
        </span>
      </Link>
    </li>
  )
}

function Route({ centre: c, index }: { centre: Centre; index: number }) {
  return (
    <li className="reveal border-t border-mark pt-5" style={{ '--i': index } as CSSProperties}>
      <Link href={c.href} className="group flex h-full flex-col no-underline">
        <p className="t-label text-accent-muted">{c.eyebrow}</p>
        <h3 className="t-title mt-2 text-fg transition-colors duration-[var(--dur-2)] group-hover:text-kicker">
          {c.name}
        </h3>
        <p className="t-body mt-3 max-w-[44ch] flex-1 text-fg-2">{c.body}</p>
        <span className="link-arrow mt-5 self-start">
          {c.cta}
          <Arrow />
        </span>
      </Link>
    </li>
  )
}

export async function Centres() {
  const [site, centres] = await Promise.all([getSite(), getCentres()])
  const physical = centres.filter((c) => c.slug)
  const remote = centres.filter((c) => !c.slug)

  return (
    <Section
      id="centres"
      layout="split"
      eyebrow="Sādhana · Where you learn"
      title="Two centres in Hyderabad."
      lede={
        <p>
          The syllabus, the Gurus and the standard are identical wherever you
          learn. Only the room changes.
        </p>
      }
    >
      <ul className="grid gap-6 md:grid-cols-2 md:gap-8">
        {physical.map((c, i) => (
          <Plate key={c.key} centre={c} index={i} title={`${site.shortName}, ${c.name}`} />
        ))}
      </ul>

      <p className="reveal t-label runhead mt-12 mb-5 flex items-center gap-4 text-kicker md:mt-14">
        Or learn from where you are
      </p>

      <ul className="grid gap-8 md:grid-cols-2 md:gap-x-10">
        {remote.map((c, i) => (
          <Route key={c.key} centre={c} index={i} />
        ))}
      </ul>
    </Section>
  )
}
