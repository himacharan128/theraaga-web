import { Hero } from '@/components/sections/Hero'
import { DeliveryModes } from '@/components/sections/DeliveryModes'
import { TrustStrip } from '@/components/sections/TrustStrip'
import { WhatWeTeach } from '@/components/sections/WhatWeTeach'
import { SadhanaLadder } from '@/components/sections/SadhanaLadder'
import { Guru } from '@/components/sections/Guru'
import { CurrentBatches } from '@/components/sections/CurrentBatches'
import { Pillars } from '@/components/sections/Pillars'
import { ListenWatch } from '@/components/sections/ListenWatch'
import { Testimonials } from '@/components/sections/Testimonials'
import { CommunityCta } from '@/components/sections/CommunityCta'
import { Sabha } from '@/components/sections/Sabha'
import { Gallery } from '@/components/sections/Gallery'
import { Faq } from '@/components/sections/Faq'
import { HowToStart } from '@/components/sections/HowToStart'
import { EnquirySection } from '@/components/sections/EnquirySection'
import { ContactBlock } from '@/components/sections/ContactBlock'
import { OrganizationSchema } from '@/components/seo/Schema'

/**
 * Nāda — the beginning.
 *
 * Section order follows the pattern found across 19 music-school homepages,
 * with one deliberate deviation: the router immediately below the hero is by
 * DELIVERY MODE rather than by instrument, because that is Raaga's actual
 * differentiator and the question a parent opening a WhatsApp forward is
 * scrolling to answer.
 *
 * Six of these sections currently render nothing, or render a designed empty
 * state, because the client has not sent content yet. That is the point — the
 * page is built to look finished while they are empty, and every one of them
 * fills in as data arrives without a code change.
 */
export default function HomePage() {
  return (
    <>
      <OrganizationSchema />
      <Hero />
      <DeliveryModes />
      <TrustStrip />
      <WhatWeTeach />
      <SadhanaLadder />
      <Guru />
      <CurrentBatches />
      <Pillars />
      <ListenWatch />
      <Testimonials />
      <CommunityCta />
      <Sabha />
      <Gallery />
      <Faq />
      <HowToStart />
      <EnquirySection />
      <ContactBlock />
    </>
  )
}
