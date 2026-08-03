import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { EmptyState, Section } from '@/components/layout/Section'
import { whatsappHref } from '@/lib/whatsapp'
import { getBatches } from '@/data/content'

const MODE_LABEL = {
  institute: 'Jubilee Hills',
  online: 'Online',
  community: 'Your clubhouse',
} as const

/**
 * "When is it?" is the second question every parent asks, right after "do you
 * come to my community?" — and a batch table is the highest-converting artefact
 * this content model can produce: *Saturday 10:00, your clubhouse, 4 seats left*.
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
      fallback={
        <EmptyState
          action={
            <ButtonLink variant="secondary" href={whatsappHref('BATCHES-EMPTY')}>
              <WhatsAppIcon />
              Tell us what suits you
            </ButtonLink>
          }
        >
          Batches for the coming term are being finalised. Tell us the days and
          times that suit you — we open new batches around our students, and in
          your community we can usually start once six families are interested.
        </EmptyState>
      }
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
