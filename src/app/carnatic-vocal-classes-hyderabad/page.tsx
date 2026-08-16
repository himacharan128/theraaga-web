import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { Centres } from '@/components/sections/Centres'
import { CurrentBatches } from '@/components/sections/CurrentBatches'
import { EnquirySection } from '@/components/sections/EnquirySection'
import { whatsappHref } from '@/lib/whatsapp'

/**
 * The city-level search page. English keyword slug on purpose.
 *
 * Mueller calls URL keywords "a very very lightweight factor", so /sadhana
 * would not have *hurt* — but it forfeits the cheapest relevance lever a
 * zero-authority .in domain has, and gives a parent zero information scent when
 * the link is forwarded into a chat window. The Sanskrit lives in the nav
 * kicker and in the vanity paths, which 301 here.
 *
 * /courses owns the detailed syllabus. This page answers the local enrolment
 * question — where RAAGA teaches in Hyderabad and how to begin — then gives a
 * clear route into the learning journey for visitors who want more depth.
 */
export const metadata: Metadata = {
  title: 'Carnatic vocal classes in Hyderabad',
  description:
    'Carnatic vocal classes for children and adults in Hyderabad — at Jubilee Hills, at Phoenix Arena in Hitech City, or online. Beginners to advanced, taught in the traditional order.',
  alternates: { canonical: '/carnatic-vocal-classes-hyderabad' },
  openGraph: {
    title: 'Carnatic vocal classes in Hyderabad · RAAGA',
    description:
      'For children and adults, beginners welcome. Jubilee Hills, Hitech City, or online.',
    url: 'https://theraaga.in/carnatic-vocal-classes-hyderabad',
  },
}

export default function CarnaticVocalPage() {
  return (
    <>
      <PageHero
        eyebrow="Sādhana · Carnatic vocal"
        title="Carnatic vocal classes in Hyderabad."
        lede={
          <p>
            For children from five and adults beginning at any age. Taught in
            the traditional order, by ear, one phrase at a time — at our Jubilee
            Hills and Hitech City centres, or online from anywhere.
          </p>
        }
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/contact">Book a trial</ButtonLink>
          <ButtonLink variant="secondary" href={whatsappHref('VOCAL-PAGE')}>
            <WhatsAppIcon />
            Ask on WhatsApp
          </ButtonLink>
        </div>
      </PageHero>

      <Centres />

      <Section
        id="sadhana"
        eyebrow="Sādhana · The learning journey"
        title="A journey, taught in the traditional order."
        tone="surface"
      >
        <div className="u-measure">
          <p className="text-text-secondary">
            Students begin with the swaras, then build rhythm, repertoire and
            musical expression one stage at a time. The complete journey — from
            Sarali Swaras to Manodharma Sangeetham — lives on our courses page.
          </p>
          <ButtonLink variant="secondary" href="/courses" className="mt-7">
            Explore the learning journey
          </ButtonLink>
        </div>
      </Section>

      <CurrentBatches />
      <EnquirySection />
    </>
  )
}
