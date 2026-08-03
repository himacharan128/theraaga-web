import { Section } from '@/components/layout/Section'
import { getTestimonials } from '@/data/content'

/**
 * HIDDEN AT ZERO — and that is a legal position, not a design preference.
 *
 * A fabricated testimonial is a misleading advertisement under the CCPA
 * Misleading Advertisements Guidelines 2022: ₹10 lakh first offence, ₹50 lakh
 * repeat, and a 1–3 year endorser ban. We do not seed placeholder quotes.
 *
 * At 1–2 items, a single centred pull-quote — never a carousel with two slides,
 * which is the tell that a site is empty.
 *
 * No AggregateRating or Review JSON-LD anywhere: Google makes self-controlled
 * reviews on Organization/LocalBusiness ineligible for stars, and it carries
 * manual-action risk. Real ratings belong on the Google Business Profile.
 */
export async function Testimonials() {
  const items = await getTestimonials()
  if (items.length === 0) return null

  const single = items.length <= 2

  return (
    <Section
      id="testimonials"
      eyebrow="Voices along the journey"
      title="Families who started this year."
      renderIf={items.length > 0}
    >
      {single ? (
        <figure className="mx-auto max-w-3xl text-center">
          <blockquote className="font-[var(--font-display)] text-[length:var(--text-step-2)] font-[300] italic leading-[var(--lh-snug)]">
            “{items[0].quote}”
          </blockquote>
          <figcaption className="mt-7 font-[var(--font-ui)] text-[length:var(--text-step--1)] text-text-muted">
            {items[0].attribution} · {items[0].context}
            {items[0].tenure ? ` · ${items[0].tenure}` : ''}
          </figcaption>
        </figure>
      ) : (
        <ul className="grid gap-10 md:grid-cols-2">
          {items.map((t) => (
            <li key={t.id} className="border-t border-accent pt-6">
              <blockquote className="u-measure font-[var(--font-display)] text-[length:var(--text-step-1)] font-[300] italic leading-[var(--lh-snug)]">
                “{t.quote}”
              </blockquote>
              <p className="mt-5 font-[var(--font-ui)] text-[length:var(--text-step--1)] text-text-muted">
                {t.attribution} · {t.context}
                {t.tenure ? ` · ${t.tenure}` : ''}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}
