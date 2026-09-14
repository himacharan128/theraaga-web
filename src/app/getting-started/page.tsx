import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/layout/PageHero'
import { FinalCta } from '@/components/sections/FinalCta'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'

export const metadata: Metadata = {
  title: 'Start Carnatic Music Classes in Hyderabad: A Learner’s Guide',
  description: 'Choosing Carnatic vocal classes for yourself or your child? Explore RAAGA’s learning path, Hyderabad centres, online lessons and how to enquire about a trial.',
  alternates: { canonical: '/getting-started' },
  openGraph: { title: 'Getting started with Carnatic music at RAAGA', description: 'Choose a learning format, understand the syllabus and prepare your questions for RAAGA.', url: 'https://theraaga.in/getting-started' },
}
export default function GettingStartedPage() {
  return <>
    <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Getting started', href: '/getting-started' }]} />
    <PageHero eyebrow="Your first step" title="Finding the right Carnatic music class." lede={<p>A practical guide for adults starting for themselves and parents choosing lessons for a child. RAAGA teaches Carnatic vocal music in Hyderabad and live online.</p>} />
    <article className="mx-auto max-w-4xl px-6 pb-20 text-text-primary">
      <div className="grid gap-4 sm:grid-cols-2">{[
        ['Learn in Jubilee Hills', '/music-classes/jubilee-hills', 'Explore our founding Hyderabad centre, where RAAGA has taught since 2016.'],
        ['Learn at Phoenix Arena', '/music-classes/hitech-city', 'Explore our Hitech City learning option and enquire about a suitable class.'],
        ['Learn live online', '/online-classes', 'Ask about a class that works for your time zone and current level.'],
        ['Explore the learning path', '/learning', 'See the traditional progression from foundational swaras to advanced music.'],
      ].map(([title, href, body]) => <Link key={href} href={href} className="rounded-xl border border-stone-200 p-6 transition hover:border-[#6b1f2a]"><h2 className="text-2xl">{title}</h2><p className="mt-3 leading-7 text-text-muted">{body}</p><span className="mt-4 inline-block text-[#6b1f2a]">Explore →</span></Link>)}</div>
      <section className="mt-12"><h2 className="text-3xl">Starting without previous training</h2><p className="mt-4 leading-8">You can enquire as a beginner. Tell RAAGA whether you are learning for yourself or choosing classes for a child, your preferred location or online format, and the times you can attend. If you have studied before, describe the exercises or compositions you have learned so the teacher can discuss an appropriate starting point.</p></section>
      <section className="mt-10"><h2 className="text-3xl">What the syllabus covers</h2><p className="mt-4 leading-8">RAAGA’s published progression begins with Sarali Swaras, Janta Swaras and Alankaras. Students then work through compositions including Geetams, Swarajatis, Varnams, Keertanas and Kritis. Advanced learning includes Manodharma Sangeetham. Progress depends on the learner and the teacher’s guidance; a list of stages is not a promise of a fixed completion date.</p><Link href="/learning" className="mt-4 inline-block text-[#6b1f2a] underline">Read the complete Carnatic syllabus</Link></section>
      <section className="mt-10"><h2 className="text-3xl">Questions to ask before joining</h2><ul className="mt-4 list-disc space-y-3 pl-6 leading-7"><li>Which teacher and batch suit my current level?</li><li>What class times are available at my chosen centre or online?</li><li>How should I practise between lessons?</li><li>What should I prepare for the trial?</li><li>How are performance opportunities or academic preparation introduced?</li></ul><p className="mt-4 leading-8">For a child’s enquiry, provide the parent or guardian’s contact details and an age band. The website does not need the child’s name or date of birth.</p></section>
      <section className="mt-10"><h2 className="text-3xl">Academic and performance goals</h2><p className="mt-4 leading-8">RAAGA offers guidance for students pursuing certificate, diploma and degree pathways, alongside performance preparation. Ask the team about your intended programme and its requirements. Preparation at RAAGA should not be confused with a university awarding a qualification.</p><Link href="/gurus" className="mt-4 inline-block text-[#6b1f2a] underline">Explore RAAGA’s teaching tradition</Link></section>
      <section className="mt-10"><h2 className="text-3xl">Ready to speak with the school?</h2><p className="mt-4 leading-8">Send an enquiry or contact RAAGA on WhatsApp to discuss availability and book a trial. The team can help you choose between Jubilee Hills, Phoenix Arena, live online lessons and community learning.</p><Link href="/contact" className="mt-5 inline-block rounded-xl bg-[#6b1f2a] px-6 py-3 text-white">Book a trial</Link></section>
    </article><FinalCta />
  </>
}
