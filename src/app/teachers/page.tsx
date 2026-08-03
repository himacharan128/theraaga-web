import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { Guru } from '@/components/sections/Guru'
import { ListenWatch } from '@/components/sections/ListenWatch'
import { EnquirySection } from '@/components/sections/EnquirySection'

export const metadata: Metadata = {
  title: 'Teachers',
  description:
    'Learn from one guru, from your first Sa — not a rotating panel. The teaching lineage and credentials behind RAAGA, Jubilee Hills, Hyderabad.',
  alternates: { canonical: '/teachers' },
}

export default function TeachersPage() {
  return (
    <>
      <PageHero
        eyebrow="Guru"
        title="You learn in a line."
        lede={
          <p>
            In Carnatic music the lineage is the credential. Who taught your
            teacher, and who taught them, is not trivia — it is what determines
            the phrasing you will inherit.
          </p>
        }
      />
      <Guru />
      <ListenWatch />
      <EnquirySection />
    </>
  )
}
