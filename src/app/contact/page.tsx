import type { Metadata } from 'next'
import { EnquirySection } from '@/components/sections/EnquirySection'
import { ContactBlock } from '@/components/sections/ContactBlock'
import { TrialProcess } from '@/components/sections/TrialProcess'
import { Faq } from '@/components/sections/Faq'

export const metadata: Metadata = {
  title: 'Book a Carnatic Music Trial Class',
  description:
    'Book a Carnatic music and vocal trial class with RAAGA in Hyderabad. Choose Jubilee Hills, Phoenix Arena in Hitech City or live online.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Prārambham: Book a trial at RAAGA',
    description:
      'Carnatic vocal classes for children and adults. Jubilee Hills, Hitech City, or online.',
    url: 'https://theraaga.in/contact',
  },
}

/**
 * No PageHero. It restated the form's own promise directly above the form —
 * two intros, one task — and pushed the first field most of a screen down.
 * EnquirySection carries the h1 here instead; elsewhere it stays an h2 under
 * that page's own heading.
 */
export default function ContactPage() {
  return (
    <>
      <EnquirySection headingAs="h1" />
      <TrialProcess />
      <ContactBlock />
      <Faq />
    </>
  )
}
