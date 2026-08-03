import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { SadhanaLadder } from '@/components/sections/SadhanaLadder'
import { DeliveryModes } from '@/components/sections/DeliveryModes'
import { CurrentBatches } from '@/components/sections/CurrentBatches'
import { Pillars } from '@/components/sections/Pillars'
import { Faq } from '@/components/sections/Faq'
import { EnquirySection } from '@/components/sections/EnquirySection'
import { whatsappHref } from '@/lib/whatsapp'

/**
 * The money page. English keyword slug on purpose.
 *
 * Mueller calls URL keywords "a very very lightweight factor", so /sadhana would
 * not have *hurt* — but it forfeits the cheapest relevance lever a
 * zero-authority .in domain has, and gives a parent zero information scent when
 * the link is forwarded into a chat window. The Sanskrit lives in the nav
 * kicker and in /sadhana, which 301s here.
 */
export const metadata: Metadata = {
  title: 'Carnatic vocal classes in Hyderabad',
  description:
    'Carnatic vocal classes for children and adults in Jubilee Hills, Hyderabad — beginners to advanced, batches capped at six, taught in the traditional order from Sarali Varisai to Manodharma. First class free.',
  alternates: { canonical: '/carnatic-vocal-classes-hyderabad' },
}

export default function CarnaticVocalPage() {
  return (
    <>
      <PageHero
        eyebrow="Sādhana · Carnatic vocal"
        title="Carnatic vocal classes in Jubilee Hills, Hyderabad."
        lede={
          <p>
            For children from five and adults beginning at any age. Taught in the
            traditional order, by ear, one phrase at a time — at our institute,
            online, or at your community clubhouse.
          </p>
        }
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/contact">Book a free trial class</ButtonLink>
          <ButtonLink variant="secondary" href={whatsappHref('VOCAL-PAGE')}>
            <WhatsAppIcon />
            Ask on WhatsApp
          </ButtonLink>
        </div>
      </PageHero>

      <DeliveryModes />
      <SadhanaLadder />
      <CurrentBatches />
      <Pillars />
      <Faq />
      <EnquirySection />
    </>
  )
}
