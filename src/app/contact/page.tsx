import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { EnquirySection } from '@/components/sections/EnquirySection'
import { ContactBlock } from '@/components/sections/ContactBlock'
import { TrialProcess } from '@/components/sections/TrialProcess'
import { Faq } from '@/components/sections/Faq'

export const metadata: Metadata = {
  title: 'Book a Carnatic Music Trial Class',
  description:
    'Book a Carnatic music and vocal trial class with RAGA in Hyderabad. Choose Jubilee Hills, Phoenix Arena in Hitech City or live online.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Prārambham: Book a trial at RAGA',
    description:
      'Carnatic vocal classes for children and adults. Jubilee Hills, Hitech City, or online.',
    url: 'https://theraaga.in/contact',
  },
}

/**
 * The PageHero carries this route's single <h1>. EnquirySection deliberately
 * renders an <h2>, because it is also embedded on five other pages where it
 * must sit under that page's own heading — so without a hero here the contact
 * page had no <h1> at all.
 */
export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Prārambham · प्रारम्भम् · Begin your journey"
        title="Come and sing with us."
        lede={
          <p>
            Tell us who is learning and where suits you, and we will arrange a
            trial class. If you would rather just ask a question, WhatsApp
            reaches us fastest.
          </p>
        }
      />
      <EnquirySection />
      <TrialProcess />
      <ContactBlock />
      <Faq />
    </>
  )
}
