import { Section } from '@/components/layout/Section'
import { getActiveDisciplines, getPlannedDisciplines } from '@/data/content'

/**
 * Carnatic vocal only at launch — which is what the client's own poster says.
 *
 * The "coming soon" strip is deliberately short. Listing seven future
 * instruments from a school with one teacher reads as padding to anyone who
 * counts; two or three reads as ambition. Adding a discipline later is an
 * INSERT, never a deploy.
 */
export async function WhatWeTeach() {
  const active = await getActiveDisciplines()
  const planned = await getPlannedDisciplines()

  return (
    <Section
      id="what-we-teach"
      eyebrow="Sādhana · What we teach"
      title="One discipline, taught properly."
      renderIf={active.length > 0}
    >
      <ul className="grid gap-8 md:grid-cols-2">
        {active.map((d) => (
          <li key={d.slug} className="border-t border-accent pt-6">
            <h3 className="text-[length:var(--text-step-2)] font-[300]">{d.name}</h3>
            {d.sanskrit && (
              <p className="mt-1 font-[var(--font-display)] italic text-text-muted">
                {d.sanskrit}
              </p>
            )}
            <p className="u-measure mt-4 text-text-secondary">{d.blurb}</p>
          </li>
        ))}
      </ul>

      {planned.length > 0 && (
        <div className="mt-14 border-t border-border pt-6">
          <p className="u-eyebrow mb-4">In preparation</p>
          <ul className="flex flex-wrap gap-x-3 gap-y-2">
            {planned.map((d) => (
              <li
                key={d.slug}
                className="border border-border px-3.5 py-1.5 font-[var(--font-ui)] text-[length:var(--text-step--1)] text-text-muted"
              >
                {d.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  )
}
