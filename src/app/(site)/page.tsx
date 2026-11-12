import type { Metadata } from 'next'
import { Hero } from '@/components/sections/Hero'
import { TrustStrip } from '@/components/sections/TrustStrip'
import { Centres } from '@/components/sections/Centres'
import { Pillars } from '@/components/sections/Pillars'
import { GurusHome } from '@/components/sections/GurusHome'
import { PressHome } from '@/components/sections/PressHome'
import { ListenWatch } from '@/components/sections/ListenWatch'
import { TrialProcess } from '@/components/sections/TrialProcess'
import { Faq } from '@/components/sections/Faq'
import { FinalCta } from '@/components/sections/FinalCta'
import { Kolam } from '@/components/ui/Kolam'
import { HomePageSchema } from '@/components/seo/Schema'

export const metadata: Metadata = {
  title: 'Carnatic Music & Vocal Classes in Hyderabad',
  description:
    'RAAGA offers Carnatic music and vocal classes for children and adults in Jubilee Hills and Hitech City, Hyderabad, plus live online learning. Beginners welcome.',
}

/**
 * Nāda — the beginning.
 *
 * Eleven chapters, set like a sabha programme (the "Mandapam" direction the
 * owner chose on 2026-11-12 from four mockups). The page once read as a pale
 * brochure with one carving and no proof; it now answers the same five
 * questions, what, for whom, where, why credible, what next, and shows its
 * evidence on the way: the Gurus and their books, the newspapers, the
 * questions parents ask.
 *
 * The order is deliberate. The router sits immediately below the hero because
 * the first question a parent opening a WhatsApp forward answers is "is this
 * near me"; the trial process and the four blocking questions sit before the
 * final ask because they are the last things standing between reading and
 * enquiring.
 */
export default function HomePage() {
  return (
    <>
      <HomePageSchema />
      <Hero />
      <TrustStrip />
      <Centres />
      <Kolam />
      <Pillars />
      <GurusHome />
      <PressHome />
      <ListenWatch />
      <TrialProcess />
      <Faq limit={4} eyebrow="Questions parents ask" title="Before you enquire." layout="stack" tone="paper" />
      <FinalCta />
    </>
  )
}
