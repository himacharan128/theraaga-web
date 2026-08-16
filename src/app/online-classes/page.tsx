import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { CurriculumTimeline } from '@/components/sections/CurriculumTimeline'
import { Faq } from '@/components/sections/Faq'
import { EnquirySection } from '@/components/sections/EnquirySection'
import { whatsappHref } from '@/lib/whatsapp'

/**
 * The NRI page — timezone-first, because that is the actual objection.
 *
 * This is the highest revenue-per-student segment in the research: the Bay Area
 * comparable charges $145–210 per four classes. But no prices appear here, by
 * standing instruction — the WhatsApp path carries that conversation.
 */
export const metadata: Metadata = {
  title: 'Online Carnatic vocal classes',
  description:
    'Live one-to-one and small-group Carnatic vocal classes over video, from a Hyderabad school — with morning IST slots that work for the US, the UK and the Gulf. First class free.',
  alternates: { canonical: '/online-classes' },
  openGraph: {
    title: 'Online Carnatic vocal classes · RAAGA, Hyderabad',
    description:
      'Live classes over video — never recordings. The same guru and the same syllabus, at a time that works where you live.',
    url: 'https://theraaga.in/online-classes',
  },
}

const SLOTS = [
  { region: 'India', detail: 'Weekday evenings and weekend mornings IST' },
  { region: 'Gulf (UAE, Qatar, Oman)', detail: 'Evening IST — early evening your time' },
  { region: 'United Kingdom', detail: 'Late afternoon IST — mid-morning your time' },
  { region: 'US East', detail: 'Early morning IST — evening your time' },
  { region: 'US West', detail: 'Early morning IST — late afternoon your time' },
  { region: 'Singapore & Australia', detail: 'Morning IST — afternoon your time' },
]

export default function OnlineClassesPage() {
  return (
    <>
      <PageHero
        eyebrow="Online · Anywhere in the world"
        title="Learn Carnatic vocal from Hyderabad, wherever you are."
        lede={
          <p>
            Live classes over video — never recordings. The same guru, the same
            syllabus, and a time that works where you actually live.
          </p>
        }
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/contact">Book a free trial</ButtonLink>
          <ButtonLink variant="secondary" href={whatsappHref('ONLINE-PAGE')}>
            <WhatsAppIcon />
            Ask about your time zone
          </ButtonLink>
        </div>
      </PageHero>

      <Section
        id="timezones"
        eyebrow="Timings"
        title="When we teach, where you are."
        tone="surface"
      >
        <dl className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {SLOTS.map((s) => (
            <div key={s.region} className="bg-surface p-7">
              <dt className="font-[400] text-accent">{s.region}</dt>
              <dd className="mt-2 text-[length:var(--text-step--1)] text-text-secondary">
                {s.detail}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 text-[length:var(--text-step--1)] text-text-muted">
          Exact slots vary by term and by teacher availability. Tell us your city
          and we’ll send you what is open now.
        </p>
      </Section>

      <Section
        id="online-how"
        eyebrow="How online classes work"
        title="What you need, and what you don’t."
      >
        <ul className="grid gap-8 md:grid-cols-2">
          {[
            {
              t: 'A phone or laptop is enough',
              b: 'No special equipment. Wired earphones help more than an expensive microphone — they stop the echo that makes a teacher unable to hear pitch.',
            },
            {
              t: 'A free shruti app, not a tanpura',
              b: 'For the first year an app on a phone is genuinely fine, and it is what most of our students use. We’ll tell you when it is worth buying a shruti box.',
            },
            {
              t: 'Smaller batches than in person',
              b: 'A teacher cannot hear individual voices over a shared connection in a large group, so online batches are kept deliberately small.',
            },
            {
              t: 'A parent nearby, for younger children',
              b: 'For children under about eight, having an adult in the room for the first few weeks makes a real difference. After that, rarely.',
            },
          ].map((i) => (
            <li key={i.t} className="border-t border-accent pt-6">
              <h3 className="text-[length:var(--text-step-1)] font-[400]">{i.t}</h3>
              <p className="mt-3 text-text-secondary">{i.b}</p>
            </li>
          ))}
        </ul>
      </Section>

      <CurriculumTimeline />
      <Faq />
      <EnquirySection />
    </>
  )
}
