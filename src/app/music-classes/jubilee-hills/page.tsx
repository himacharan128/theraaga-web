import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { CurrentBatches } from '@/components/sections/CurrentBatches'
import { Faq } from '@/components/sections/Faq'
import { EnquirySection } from '@/components/sections/EnquirySection'
import { ContactBlock } from '@/components/sections/ContactBlock'
import { whatsappHref } from '@/lib/whatsapp'

/**
 * Locality page. The Hyderabad organic SERP is technically weak — Philips School
 * of Music runs a locality×instrument URL grid with no structured data and no
 * meta descriptions, and Sangeet Music Academy's Hyderabad page is ~400 words
 * with no schema. This is winnable, but it is a months-2-3 play: for the first
 * leads, the Google Business Profile and WhatsApp will out-deliver organic.
 */
export const metadata: Metadata = {
  title: 'Music classes in Jubilee Hills',
  description:
    'Carnatic vocal classes in Jubilee Hills, Hyderabad — for children and adults, beginners welcome, batches capped at six. Also online and at gated-community clubhouses nearby.',
  alternates: { canonical: '/music-classes/jubilee-hills' },
}

const NEARBY = [
  'Banjara Hills',
  'Film Nagar',
  'Madhapur',
  'Gachibowli',
  'Kondapur',
  'Manikonda',
  'Kokapet',
  'Financial District',
  'Hitec City',
  'Narsingi',
]

export default function JubileeHillsPage() {
  return (
    <>
      <PageHero
        eyebrow="Jubilee Hills, Hyderabad"
        title="Carnatic vocal classes in Jubilee Hills."
        lede={
          <p>
            Small batches at our studio, for children from five and adults
            beginning at any age. If getting here is the problem, we also teach
            in clubhouses across the neighbouring communities.
          </p>
        }
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/contact">Book a free trial class</ButtonLink>
          <ButtonLink variant="secondary" href={whatsappHref('JUBILEE-HILLS')}>
            <WhatsAppIcon />
            Ask on WhatsApp
          </ButtonLink>
        </div>
      </PageHero>

      <CurrentBatches />

      <Section
        id="nearby"
        eyebrow="Also serving"
        title="Communities we travel to."
        tone="surface"
      >
        <ul className="flex flex-wrap gap-x-3 gap-y-2">
          {NEARBY.map((n) => (
            <li
              key={n}
              className="border border-border bg-bg px-4 py-2 font-[var(--font-ui)] text-[length:var(--text-step--1)] text-text-secondary"
            >
              {n}
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-[52ch] text-text-secondary">
          If your gated community is on this list — or near it — we can usually
          open a clubhouse batch once six families are interested.{' '}
          <a
            href="/communities"
            className="text-accent underline underline-offset-4"
          >
            How community batches work →
          </a>
        </p>
      </Section>

      <Faq />
      <ContactBlock />
      <EnquirySection />
    </>
  )
}
