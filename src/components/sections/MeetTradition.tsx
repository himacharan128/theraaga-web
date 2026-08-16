import Link from 'next/link'
import { Section } from '@/components/layout/Section'
import { SwaraDivider } from '@/components/ui/Ornament'

/**
 * The Guru–Shishya positioning, in brief.
 *
 * The full lineage, the scholarly work and the teaching principles live on
 * /teachers. This is the homepage's short form: enough to establish why the
 * teaching is what it is, then a route onward. Deliberately no portrait and no
 * placeholder frame — with no client photography, a person-shaped hole is what
 * makes a school site look abandoned.
 *
 * No superlatives. "Best" and "unmatched" are exactly the words a discerning
 * Carnatic parent reads as a lack of confidence.
 */
export function MeetTradition() {
  return (
    <Section id="tradition" eyebrow="Parampara · Meet the tradition">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <h2 className="text-[length:var(--text-step-3)] max-w-[18ch]">
            Learned in a line, from your first Sa.
          </h2>
          <div className="u-measure mt-7 space-y-5 text-[length:var(--text-step-0)] leading-[var(--lh-body)] text-text-secondary">
            <p>
              Carnatic music is transmitted, not delivered. It passes from
              teacher to student by ear and by repetition — a phrase sung, a
              phrase returned, corrected, returned again. That is the
              Guru–Shishya Parampara, and it is how every student here is
              taught.
            </p>
            <p>
              Students stay with their teacher rather than being handed between
              instructors as they progress. In this music that continuity is not
              a nicety; it is how phrasing, gamakas and the discipline of a
              particular line are actually passed on.
            </p>
          </div>
          <Link
            href="/teachers"
            className="mt-8 inline-flex items-center gap-2 font-[var(--font-ui)] text-[length:var(--text-step--1)] font-medium text-accent underline-offset-4"
          >
            The teaching lineage
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
              <path d="M9 1l4 4-4 4M13 5H0" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </Link>
        </div>

        {/* Text-led, not a photo slot. An intentional composition rather than a
            frame waiting for an asset that may not arrive. */}
        <aside className="flex flex-col justify-center border border-border bg-surface px-8 py-12 text-center md:px-12">
          <p className="deva text-[length:var(--text-step-4)] leading-none text-accent">
            नादब्रह्म
          </p>
          <p className="mt-4 font-[var(--font-display)] text-[length:var(--text-step-1)] italic text-text-secondary">
            Nāda Brahma
          </p>
          <div className="my-8">
            <SwaraDivider index={4} />
          </div>
          <p className="u-measure mx-auto font-[var(--font-display)] text-[length:var(--text-step-1)] font-[300] leading-[var(--lh-snug)] text-text-secondary">
            Sound is the divine. Every note carries a tradition, and every
            student carries it forward.
          </p>
        </aside>
      </div>
    </Section>
  )
}
