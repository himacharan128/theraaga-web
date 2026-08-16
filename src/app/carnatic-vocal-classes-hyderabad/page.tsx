import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { Centres } from '@/components/sections/Centres'
import { CurriculumTimeline } from '@/components/sections/CurriculumTimeline'
import { CurrentBatches } from '@/components/sections/CurrentBatches'
import { Faq } from '@/components/sections/Faq'
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
 * This page and /courses share the curriculum module deliberately: /courses is
 * the syllabus in full, this is the same content framed for the city query. It
 * carries its own H1, canonical and intent, so it is a distinct page rather
 * than a duplicate.
 */
export const metadata: Metadata = {
  title: 'Carnatic vocal classes in Hyderabad',
  description:
    'Carnatic vocal classes for children and adults in Hyderabad — at Jubilee Hills, at Phoenix Arena in Hitech City, or online. Beginners to advanced, taught in the traditional order. First class free.',
  alternates: { canonical: '/carnatic-vocal-classes-hyderabad' },
  openGraph: {
    title: 'Carnatic vocal classes in Hyderabad · RAAGA',
    description:
      'For children and adults, beginners welcome. Jubilee Hills, Hitech City, or online. The first class is free.',
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
          <ButtonLink href="/contact">Book a free trial</ButtonLink>
          <ButtonLink variant="secondary" href={whatsappHref('VOCAL-PAGE')}>
            <WhatsAppIcon />
            Ask on WhatsApp
          </ButtonLink>
        </div>
      </PageHero>

      <Centres />
      <CurriculumTimeline />
      <CurrentBatches />
      <Faq />
      <EnquirySection />
    </>
  )
}
