import type { Metadata } from 'next'
import { EnquirySection } from '@/components/sections/EnquirySection'
import { ContactBlock } from '@/components/sections/ContactBlock'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
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
 * EnquirySection carries the h1 here instead.
 */
export default function ContactPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Contact', href: '/contact' },
        ]}
      />
      <EnquirySection />
      <ContactBlock />
      <Faq />
    </>
  )
}
