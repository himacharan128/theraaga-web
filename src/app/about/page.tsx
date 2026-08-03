import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { SwaraDivider } from '@/components/ui/Ornament'
import { Guru } from '@/components/sections/Guru'
import { Pillars } from '@/components/sections/Pillars'
import { EnquirySection } from '@/components/sections/EnquirySection'

export const metadata: Metadata = {
  title: 'About the school',
  description:
    'RAAGA is a school of Indian classical music in Jubilee Hills, Hyderabad — teaching Carnatic vocal in the traditional order, in small batches, at our institute, online, and in gated-community clubhouses.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Parampara · The lineage"
        title="A school built around how this music is actually learned."
        lede={
          <p>
            Not a syllabus invented for a website. The order below has been the
            order for centuries, and we teach it that way because it works.
          </p>
        }
      />

      <Section id="philosophy" eyebrow="Why we teach this way">
        <div className="u-measure space-y-6 text-[length:var(--text-step-1)] font-[300] leading-[var(--lh-snug)] text-text-secondary">
          <p>
            Carnatic music is transmitted, not delivered. It moves from one
            person to another by ear and by repetition — a phrase sung, a phrase
            returned, corrected, returned again — and almost nothing about that
            process has needed to change.
          </p>
          <p>
            What has changed is access. A family in a gated community in
            Gachibowli should not lose a Sunday morning to traffic to reach a
            teacher. A child in New Jersey should not have to wait for a
            December visit to India to continue. So the teaching stays
            traditional and the delivery does not.
          </p>
          <p>
            We say what stage a student is at, what comes next, and roughly how
            long it takes. We cap batches so that every student sings alone in
            every class. And we put students on a stage every term, because a
            student who has performed once practises differently forever.
          </p>
        </div>

        <div className="my-14">
          <SwaraDivider index={3} />
        </div>

        <blockquote className="u-measure font-[var(--font-display)] text-[length:var(--text-step-2)] font-[300] italic leading-[var(--lh-snug)]">
          “Every note carries a tradition. Every student carries it forward.”
        </blockquote>
      </Section>

      <Guru />
      <Pillars />
      <EnquirySection />
    </>
  )
}
