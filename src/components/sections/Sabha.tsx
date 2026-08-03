import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { EmptyState, Section } from '@/components/layout/Section'
import { whatsappHref } from '@/lib/whatsapp'
import { getPastEvents, getUpcomingEvents } from '@/data/content'

/**
 * Sabha — the events section, named the way the tradition names things.
 *
 * Degradation ladder: upcoming events → three most recent past ("Recent
 * kutcheris") → a single card inviting the reader to be told first. It never
 * renders an empty calendar.
 *
 * Only PHYSICAL events are eligible for Event JSON-LD — a purely virtual
 * kutcheri is not. That gate lives in the schema builder, not here.
 */
export async function Sabha() {
  const upcoming = await getUpcomingEvents()
  const past = await getPastEvents(3)
  const shown = upcoming.length > 0 ? upcoming : past
  const isPast = upcoming.length === 0 && past.length > 0

  return (
    <Section
      id="sabha"
      eyebrow="Sabha"
      title={isPast ? 'Recent kutcheris.' : 'What’s coming up.'}
      lede={
        <p>
          <em>Kutcheri</em>, our concerts. <em>Sangama</em>, our workshops.{' '}
          <em>Open Baithak</em>, our free demo mornings. And{' '}
          <em>Sangeeta Sandhya</em>, our annual evening.
        </p>
      }
      renderIf={shown.length > 0}
      fallback={
        <EmptyState
          action={
            <ButtonLink variant="secondary" href={whatsappHref('SABHA-EMPTY')}>
              <WhatsAppIcon />
              Tell me about the next one
            </ButtonLink>
          }
        >
          Our next Open Baithak is announced monthly — a free morning where you
          can sit in, listen, and sing a little if you want to. Message us and
          we’ll tell you first.
        </EmptyState>
      }
    >
      <ul className="grid gap-px border border-border bg-border md:grid-cols-3">
        {shown.map((e) => (
          <li key={e.id} className="bg-bg p-7">
            <p className="u-eyebrow">{e.kind.replace(/-/g, ' ')}</p>
            <p className="mt-3 font-[var(--font-display)] text-[length:var(--text-step-1)]">
              {new Date(e.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <h3 className="mt-2 text-[length:var(--text-step-1)] font-[400]">
              {e.title}
            </h3>
            <p className="mt-2 text-[length:var(--text-step--1)] text-text-muted">
              {e.venue}
            </p>
            {e.blurb && (
              <p className="mt-4 text-[length:var(--text-step--1)] text-text-secondary">
                {e.blurb}
              </p>
            )}
          </li>
        ))}
      </ul>
    </Section>
  )
}
