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
 * is it?", and a batch table is the highest-converting artefact this content
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
            <tr className="border-b border-line-strong">
              {['Day', 'Time', 'Where', 'Ages', 'Seats'].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="t-label py-4 pr-6 text-fg-3"
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
                <tr key={b.id} className="t-body border-b border-line">
                  <td className="t-title py-5 pr-6 text-fg">{b.dayOfWeek}</td>
                  <td className="py-5 pr-6 tabular-nums text-fg">{b.time}</td>
                  <td className="py-5 pr-6 text-fg-2">
                    {MODE_LABEL[b.mode]}
                    {b.locationLabel ? ` · ${b.locationLabel}` : ''}
                  </td>
                  <td className="py-5 pr-6 text-fg-2">{b.ageBand}</td>
                  <td className="py-5 pr-6">
                    {left > 0 ? (
                      <span className="text-accent">{left} left</span>
                    ) : (
                      <span className="text-fg-3">Full</span>
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
