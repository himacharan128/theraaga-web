import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { Section, EmptyState } from '@/components/layout/Section'
import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { EnquirySection } from '@/components/sections/EnquirySection'
import { whatsappHref, shareHref } from '@/lib/whatsapp'
import { getPublicCommunityCount } from '@/data/content'

export const metadata: Metadata = {
  title: 'Carnatic music classes in your gated community',
  description:
    'We bring Carnatic vocal classes to gated community clubhouses across Hyderabad — Jubilee Hills, Gachibowli, Kondapur, Manikonda and beyond. Six interested families is usually enough to open a batch.',
  alternates: { canonical: '/communities' },
}

/**
 * The clubhouse channel, as a first-class conversion path. No competitor found
 * in the research does this at all.
 *
 * Split into two audiences on purpose: the parent and the residents' committee
 * are different buyers with different objections. Hyderabad clubhouses are
 * controlled by the association or the builder's facility manager, not by the
 * parent reading this — so the committee needs its own answer.
 */
export default async function CommunitiesPage() {
  const liveCount = await getPublicCommunityCount()

  return (
    <>
      <PageHero
        eyebrow="Samudāya · For gated communities"
        title="We bring Carnatic music to your community."
        lede={
          <p>
            No drop-offs, no traffic, no Sunday morning lost. We teach at your
            clubhouse, at a time your families choose.
          </p>
        }
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="#prarambha">Start a batch in your community</ButtonLink>
          <ButtonLink variant="secondary" href={shareHref()}>
            <WhatsAppIcon />
            Share with your community group
          </ButtonLink>
        </div>
      </PageHero>

      <Section
        id="community-count"
        renderIf={liveCount > 0}
        className="!py-12"
      >
        <p className="text-[length:var(--text-step-2)] font-[300]">
          Already teaching inside{' '}
          <strong className="font-[400] text-accent">{liveCount}</strong> Hyderabad{' '}
          {liveCount === 1 ? 'community' : 'communities'}.
        </p>
      </Section>

      <Section
        id="two-audiences"
        eyebrow="How it works"
        title="It depends who you are."
        tone="surface"
      >
        <div className="grid gap-px border border-border bg-border md:grid-cols-2">
          <div className="bg-surface p-8 md:p-10">
            <h3 className="text-[length:var(--text-step-2)] font-[300]">
              I’m a parent here
            </h3>
            <p className="mt-4 text-text-secondary">
              Tell us your community name and we’ll tell you whether a batch is
              already running nearby. If there isn’t one, we’ll help you find the
              other families — six is usually enough to make a batch work, and
              most communities get there quickly once one person asks.
            </p>
            <ol className="mt-6 space-y-3 text-[length:var(--text-step--1)] text-text-secondary">
              <li>1. Send us your community name.</li>
              <li>2. We check what is already running near you.</li>
              <li>3. We help you gather interest in your group.</li>
              <li>4. We speak to your association together.</li>
            </ol>
          </div>

          <div className="bg-surface p-8 md:p-10">
            <h3 className="text-[length:var(--text-step-2)] font-[300]">
              I’m on the residents’ committee
            </h3>
            <p className="mt-4 text-text-secondary">
              We run a fixed weekly slot in your clubhouse, bring our own shruti
              and seating, and leave the space exactly as we found it. We’re
              happy to start with a free Open Baithak — an open morning your
              residents can drop into before anyone commits to anything.
            </p>
            <ul className="mt-6 space-y-3 text-[length:var(--text-step--1)] text-text-secondary">
              <li>· One slot a week, agreed with your facility manager.</li>
              <li>· A free demo morning for your residents first.</li>
              <li>· Insurance and conduct terms in writing.</li>
              <li>· No equipment or storage needed from you.</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section
        id="communities-list"
        eyebrow="Where we teach"
        title="Communities we serve."
        renderIf={false}
        fallback={
          <EmptyState
            action={
              <ButtonLink variant="secondary" href={whatsappHref('COMMUNITIES')}>
                <WhatsAppIcon />
                Ask about your community
              </ButtonLink>
            }
          >
            We travel across Jubilee Hills, Banjara Hills, Madhapur, Gachibowli,
            Kondapur, Manikonda and the Financial District. Send us the name of
            your community and we’ll tell you what’s possible there.
          </EmptyState>
        }
      />

      <EnquirySection />
    </>
  )
}
