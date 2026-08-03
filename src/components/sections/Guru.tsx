import { Section } from '@/components/layout/Section'
import { PlaceholderFrame } from '@/components/ui/Ornament'
import { getFaculty } from '@/data/content'

/**
 * In Carnatic music the lineage IS the credential. Kalakshetra puts its
 * founder's quote at position 3, above any programme content.
 *
 * The zero-data path matters more here than anywhere else on the page, because
 * the founder may not have a nameable parampara at all (an open question in the
 * plan). So the empty state leads with the TEACHING PRINCIPLE rather than with
 * a person — and it never, ever renders a silhouette placeholder or an unnamed
 * faculty carousel, which is what makes a school site look abandoned.
 */
export async function Guru() {
  const faculty = await getFaculty()
  const lead = faculty[0]

  return (
    <Section
      id="guru"
      eyebrow="Parampara · The lineage"
      title="Learn from one guru, from your first Sa."
      renderIf={true}
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div className="order-2 lg:order-1">
          {lead?.portrait ? null : (
            <PlaceholderFrame
              aspect="4/5"
              label="Portrait to follow"
              className="max-w-sm"
            />
          )}
        </div>

        <div className="order-1 lg:order-2">
          <p className="u-measure text-[length:var(--text-step-1)] font-[300] leading-[var(--lh-snug)] text-text-secondary">
            You are not assigned a rotating teacher from a panel. At Raaga you
            learn in a line — the way this music has always been taught: slowly,
            by ear, one phrase at a time, until it is yours.
          </p>

          {lead ? (
            <div className="mt-9">
              <h3 className="text-[length:var(--text-step-2)] font-[300]">
                {lead.honorific ? `${lead.honorific} ` : ''}
                {lead.name}
              </h3>
              <p className="mt-1 font-[var(--font-ui)] text-[length:var(--text-step--1)] text-text-muted">
                {lead.role}
              </p>

              {lead.lineage.length > 0 && (
                <ol className="relative mt-8 space-y-5 pl-6">
                  {/* The lineage thread — the same tanpura string as the ladder spine. */}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-2 left-[3px] top-2 w-px bg-gold-hairline/40"
                  />
                  {lead.lineage.map((entry) => (
                    <li key={entry.order} className="relative">
                      <span
                        aria-hidden="true"
                        className="absolute -left-6 top-2 size-[7px] rounded-full bg-accent"
                      />
                      <p className="font-[400]">
                        {entry.honorific ? `${entry.honorific} ` : ''}
                        {entry.name}
                      </p>
                      {entry.note && (
                        <p className="text-[length:var(--text-step--1)] text-text-muted">
                          {entry.note}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              )}

              {lead.philosophy && (
                <blockquote className="u-measure mt-9 border-l-2 border-gold-hairline pl-5 font-[var(--font-display)] text-[length:var(--text-step-1)] italic text-text-secondary">
                  {lead.philosophy}
                </blockquote>
              )}
            </div>
          ) : (
            /* Zero-data state: the principle, with the motif — never a person-shaped hole. */
            <div className="mt-10 border-t border-border pt-8">
              <p className="u-measure text-text-secondary">
                Every student here is taught by the same guru from the first
                lesson to the last — not handed between instructors as they
                progress. That continuity is not a nicety in Carnatic music; it
                is how the phrasing, the gamakas and the discipline of a
                particular line are actually transmitted.
              </p>
              <p className="mt-6 font-[var(--font-display)] italic text-text-muted">
                Full teaching lineage and credentials to follow.
              </p>
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}
