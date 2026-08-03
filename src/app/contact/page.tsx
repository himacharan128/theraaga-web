import type { Metadata } from 'next'
import { EnquirySection } from '@/components/sections/EnquirySection'
import { ContactBlock } from '@/components/sections/ContactBlock'
import { HowToStart } from '@/components/sections/HowToStart'
import { Faq } from '@/components/sections/Faq'

export const metadata: Metadata = {
  title: 'Book a free trial class',
  description:
    'Book a free Carnatic vocal trial class in Jubilee Hills, Hyderabad — at our institute, online, or at your community clubhouse. Four questions, about thirty seconds.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <>
      <EnquirySection />
      <HowToStart />
      <ContactBlock />
      <Faq />
    </>
  )
}
