import type { Metadata } from 'next'
import { Hero } from '@/components/sections/Hero'
import { TrustStrip } from '@/components/sections/TrustStrip'
import { Centres } from '@/components/sections/Centres'
import { Pillars } from '@/components/sections/Pillars'
import { ListenWatch } from '@/components/sections/ListenWatch'
import { MeetTradition } from '@/components/sections/MeetTradition'
import { TrialProcess } from '@/components/sections/TrialProcess'
import { FinalCta } from '@/components/sections/FinalCta'
import { OrganizationSchema } from '@/components/seo/Schema'

export const metadata: Metadata = {
  title: 'Carnatic Music & Vocal Classes in Hyderabad',
  description:
    'RAAGA offers Carnatic music and vocal classes for children and adults in Jubilee Hills and Hitech City, Hyderabad, plus live online learning. Beginners welcome.',
}

/**
 * Nāda — the beginning.
 *
 * Eight sections, ~700 words. This page was previously seventeen sections and
 * read as a prospectus: the full curriculum ladder, the complete FAQ, the
 * events calendar and the whole enquiry form all lived here. Each of those has
 * moved to the page that owns it, because the homepage's only job is to answer
 * five questions — what, for whom, where, why credible, what next — and hand
 * the visitor onward.
 *
 * The order is deliberate. The router sits immediately below the hero because
 * the first question a parent opening a WhatsApp forward answers is "is this
 * near me"; the trial process sits immediately before the final ask because
 * "what actually is the trial" is the last thing standing between reading
 * and enquiring.
 */
export default function HomePage() {
  return (
    <>
      <OrganizationSchema />
      <Hero />
      <TrustStrip />
      <Centres />
      <Pillars />
      <ListenWatch />
      <MeetTradition />
      <TrialProcess />
      <FinalCta />
    </>
  )
}
