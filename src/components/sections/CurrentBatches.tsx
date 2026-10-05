import { ButtonLink } from '@/components/ui/Button'
import { Section } from '@/components/layout/Section'
import { getBatches } from '@/data/content'
import type { Mode } from '@/content/types'

// Typed as Record<Mode, string> so adding a delivery mode is a compile error
// here rather than an `undefined` in a table cell.
const MODE_LABEL: Record<Mode, string> = {
  'jubilee-hills': 'Jubilee Hills',
  'phoenix-arena': 'Phoenix Arena, Hitech City',
  online: 'Online',
  community: 'Your community',
}

/**
 * "When is it?" is the second question every parent asks, right after "where
 * is it?" — and a batch table is the highest-converting artefact this content
 * model can produce: *Saturday 10:00, Jubilee Hills, 4 seats left*.
 *
 * With no batches the section renders nothing at all, rather than an empty
 * state: the enquiry form already asks for preferred times, so a second ask
 * here only repeated it.
 *
 * NO FEE COLUMN. Prices never appear on this site; fees are a WhatsApp
 * conversation. See plan §3.
 */
export async function CurrentBatches() {
  const batches = await getBatches()

  return (
    <Section
      id="batches"
      eyebrow="Open now"
      title="Current batches."
      renderIf={batches.length > 0}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[42rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-border-strong">
              {['Day', 'Time', 'Where', 'Ages', 'Seats'].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="u-eyebrow py-4 pr-6 font-medium"
                >
                  {h}
                </th>
              ))}
              <th scope="col" className="sr-only">
                Enquire
              </th>
            </tr>
          </thead>
          <tbody>
            {batches.map((b) => {
              const left = b.seatsTotal - b.seatsFilled
              return (
                <tr key={b.id} className="border-b border-border">
                  <td className="py-5 pr-6">{b.dayOfWeek}</td>
                  <td className="py-5 pr-6">{b.time}</td>
                  <td className="py-5 pr-6 text-text-secondary">
                    {MODE_LABEL[b.mode]}
                    {b.locationLabel ? ` · ${b.locationLabel}` : ''}
                  </td>
                  <td className="py-5 pr-6 text-text-secondary">{b.ageBand}</td>
                  <td className="py-5 pr-6">
                    {left > 0 ? (
                      <span className="text-accent">{left} left</span>
                    ) : (
                      <span className="text-text-muted">Full</span>
                    )}
                  </td>
                  <td className="py-5">
                    <ButtonLink variant="ghost" href="/contact">
                      Enquire
                    </ButtonLink>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Section>
  )
}
