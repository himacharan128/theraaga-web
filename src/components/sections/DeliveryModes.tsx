import Link from 'next/link'
import { Section } from '@/components/layout/Section'
import { getDeliveryModes, getPublicCommunityCount } from '@/data/content'

/**
 * The single most important section on the page.
 *
 * 14 of 19 music-school homepages studied put a "router" immediately below the
 * hero — Yousician's 5 instrument cards, Pickup's "Choose your instrument",
 * Merit's 6 age-banded programme cards. Raaga's router is not instrument, it is
 * MODE, because that is the actual differentiator and the thing a parent
 * scrolling a WhatsApp forward is looking for: *do you come to my community?*
 *
 * Always renders — the three modes are facts about the business, not client data.
 */
export async function DeliveryModes() {
  const modes = await getDeliveryModes()
  const liveCommunities = await getPublicCommunityCount()

  return (
    <Section
      id="three-modes"
      eyebrow="Three ways to learn"
      title="Come to us, or we’ll come to you."
      tone="surface"
    >
      <ul className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
        {modes.map((m) => (
          <li key={m.key} className="bg-surface">
            {/* Whole card is the tap target — one thumb-scroll on mobile. */}
            <Link
              href={m.href}
              className="group flex h-full flex-col p-7 no-underline md:p-9"
            >
              <p className="u-eyebrow">{m.eyebrow}</p>
              <h3 className="mt-3 text-[length:var(--text-step-2)] font-[300] text-text-primary">
                {m.title}
              </h3>
              <p className="mt-4 flex-1 text-[length:var(--text-step--1)] leading-[var(--lh-body)] text-text-secondary">
                {m.body}
              </p>

              {/* Only shown once it is true — never "0 communities". */}
              {m.key === 'community' && liveCommunities > 0 && (
                <p className="mt-4 font-[var(--font-ui)] text-[length:var(--text-step--1)] text-accent-muted">
                  Already teaching inside {liveCommunities} Hyderabad{' '}
                  {liveCommunities === 1 ? 'community' : 'communities'}.
                </p>
              )}

              <span className="mt-7 inline-flex items-center gap-2 font-[var(--font-ui)] text-[length:var(--text-step--1)] font-medium text-accent underline decoration-transparent underline-offset-4 transition-[text-decoration-color] group-hover:decoration-current">
                {m.cta}
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                  <path d="M9 1l4 4-4 4M13 5H0" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  )
}
