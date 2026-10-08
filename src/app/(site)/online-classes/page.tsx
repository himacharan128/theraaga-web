import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { LinkRows, ProgrammeList } from '@/components/layout/Editorial'
import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { FinalCta } from '@/components/sections/FinalCta'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { whatsappHref } from '@/lib/whatsapp'
import { defaultOgImages } from '@/lib/og-image'

/**
 * The NRI page: timezone-first, because that is the actual objection.
 *
 * This is the highest revenue-per-student segment in the research. But no
 * prices appear here, by standing instruction: the WhatsApp path carries that
 * conversation.
 *
 * It opens on the dark stage, then reads as a timetable board, a programme of
 * what is needed, a quiet interlude on sand and a rail of places to begin.
 */
export const metadata: Metadata = {
  title: 'Online Carnatic Music & Vocal Classes',
  description:
    'Live online Carnatic singing classes from RAAGA, Hyderabad, for children and adults. Explore the vocal syllabus, lesson setup and trial enquiry.',
  alternates: { canonical: '/online-classes' },
  openGraph: {
    title: 'Online Carnatic music classes at RAAGA, Hyderabad',
    description:
      'Live classes over video, never recordings. The same guru and syllabus at a time that works where you live.',
    url: 'https://theraaga.in/online-classes',
    images: defaultOgImages,
  },
}

const SLOTS = [
  { region: 'India', detail: 'Weekday evenings and weekend mornings IST' },
  { region: 'Gulf (UAE, Qatar, Oman)', detail: 'Evening IST, early evening your time' },
  { region: 'United Kingdom', detail: 'Late afternoon IST, mid morning your time' },
  { region: 'US East', detail: 'Early morning IST, evening your time' },
  { region: 'US West', detail: 'Early morning IST, late afternoon your time' },
  { region: 'Singapore & Australia', detail: 'Morning IST, afternoon your time' },
]

export default function OnlineClassesPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Online Carnatic Music Classes', href: '/online-classes' },
        ]}
      />
      <PageHero
        variant="night"
        eyebrow="Online · Anywhere in the world"
        title="Learn Carnatic vocal from Hyderabad, wherever you are."
        lede={
          <p>
            Live classes over video, never recordings. The same guru and
            syllabus, and a time that works where you actually live.
          </p>
        }
      >
        <ButtonLink href="/contact">Book a trial</ButtonLink>
        <ButtonLink variant="secondary" href={whatsappHref('ONLINE-PAGE')}>
          <WhatsAppIcon />
          Ask about your time zone
        </ButtonLink>
      </PageHero>

      {/* Set as a timetable board: each region under a brass rule, its hours
          beneath, three to a row on a wide screen. */}
      <Section id="timezones" eyebrow="Timings" title="When we teach, where you are." tone="paper" layout="split">
        <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {SLOTS.map((s, i) => (
            <div key={s.region} className="reveal border-t border-mark pt-5" style={{ '--i': i % 3 } as CSSProperties}>
              <dt className="t-subhead text-fg">{s.region}</dt>
              <dd className="t-body mt-3 max-w-[30ch] text-fg-2">{s.detail}</dd>
            </div>
          ))}
        </dl>
        <p className="reveal t-caption mt-12 max-w-[52ch] border-l border-mark pl-5 text-fg-2 md:text-[1.0625rem]">
          Exact slots vary by term and by teacher availability. Tell us your city
          and we’ll send you what is open now.
        </p>
      </Section>

      <Section
        id="online-how"
        eyebrow="How online classes work"
        title="What you need, and what you don’t."
        layout="split"
      >
        <ProgrammeList
          numbered={false}
          items={[
            {
              key: 'device',
              title: 'A phone or laptop is enough',
              body: 'No special equipment. Wired earphones help more than an expensive microphone because they stop the echo that makes a teacher unable to hear pitch.',
            },
            {
              key: 'shruti',
              title: 'A free shruti app, not a tanpura',
              body: 'For the first year an app on a phone is genuinely fine, and it is what most of our students use. We’ll tell you when it is worth buying a shruti box.',
            },
            {
              key: 'batches',
              title: 'Smaller batches than in person',
              body: 'A teacher cannot hear individual voices over a shared connection in a large group, so online batches are kept deliberately small.',
            },
            {
              key: 'parent',
              title: 'A parent nearby, for younger children',
              body: 'For children under about eight, having an adult in the room for the first few weeks makes a real difference. After that, rarely.',
            },
          ]}
        />
      </Section>

      <Section
        id="sadhana"
        eyebrow="Sādhana · The learning journey"
        title="The same journey, wherever you learn from."
        tone="sand"
        layout="center"
      >
        <div className="reveal mx-auto flex max-w-[46ch] flex-col items-center text-center">
          <p className="t-standfirst text-fg-2">
            Online students follow the same traditional progression as students
            at our Hyderabad centres, from their first swaras through to
            advanced artistry.
          </p>
          <ButtonLink variant="secondary" href="/learning" className="mt-8">
            Explore the learning journey
          </ButtonLink>
        </div>
      </Section>

      <Section id="online-learning-paths" title="Start at your own level." layout="rail">
        <p className="reveal t-standfirst max-w-[52ch] text-fg-2">Online lessons follow the Carnatic vocal curriculum taught at our Hyderabad centres. Tell the team whether you are new to singing, returning after a break, or arranging lessons for a child.</p>
        <LinkRows
          className="reveal mt-10"
          links={[
            { label: 'Beginner Carnatic classes', href: '/carnatic-music-classes/beginners' },
            { label: 'Adult learning and returning to music', href: '/carnatic-music-classes/adults' },
            { label: 'Children’s lessons', href: '/carnatic-music-classes/children' },
          ]}
        />
        <p className="reveal t-caption mt-10 max-w-[52ch] border-l border-mark pl-5 text-fg-2 md:text-[1.0625rem]">Not sure which format will suit you? <Link href="/guides/online-or-in-person-carnatic-classes" className="link">Compare live online and in-person lessons</Link> by sound, feedback, travel and the space you have at home.</p>
      </Section>

      <FinalCta />
    </>
  )
}
