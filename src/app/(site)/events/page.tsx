import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { EventMoments } from '@/components/sections/EventMoments'
import { PressMentions } from '@/components/sections/PressMentions'
import { FinalCta } from '@/components/sections/FinalCta'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { LedgerIndex } from '@/components/layout/Editorial'
import { whatsappHref } from '@/lib/whatsapp'
import {
  getEventKinds,
  getEventPhotos,
  getPressMentions,
  getUpcomingEvents,
} from '@/data/content'
import { defaultOgImages } from '@/lib/og-image'

export const metadata: Metadata = {
  title: 'Events: Concerts, Workshops and Recitals',
  description:
    'Concerts, workshops, lecture demonstrations, Guru Purnima, Tyagaraja Aradhana and student performances at RAAGA, the Carnatic Sangeetham school in Hyderabad.',
  alternates: { canonical: '/events' },
  openGraph: {
    title: 'Sabha: events at RAAGA',
    description:
      'Kutcheris, workshops, lecture demonstrations, Guru Purnima, Tyagaraja Aradhana and student recitals.',
    url: 'https://theraaga.in/events',
    images: defaultOgImages,
  },
}

/**
 * Sabha — Events.
 *
 * This page is in the navigation because the client's content master asks for
 * it, and it is honest because it publishes what RAAGA actually does rather than
 * a calendar it does not have.
 *
 * The distinction is load-bearing: the KINDS of gathering are real and
 * client-supplied, so they render always. Dated occurrences render above them
 * only once `events` holds real ones. Nothing here implies a scheduled date —
 * an invented "Annual Day, March 2026" would be the single most damaging thing
 * this page could contain, because someone would turn up.
 *
 * Press clippings sit above the ledger: they are real coverage, supplied whole.
 * Photographs of past events follow the same rule as everything depicting people: they render only once
 * guardian consent is recorded for them, and the section is absent until then.
 */
export default async function EventsPage() {
  const kinds = await getEventKinds()
  const upcoming = await getUpcomingEvents()
  const press = await getPressMentions()
  const moments = await getEventPhotos()

  // Sections alternate between the page ground and the surface tint, counting
  // only the ones that actually render, so two like tones never sit together.
  const base: 'default' | 'surface' = upcoming.length > 0 ? 'default' : 'surface'
  const flip = (t: 'default' | 'surface') => (t === 'surface' ? 'default' : 'surface')
  const pressTone = flip(base)
  const afterPress = press.length > 0 ? pressTone : base
  const momentsTone = flip(afterPress)
  const ledgerTone = flip(moments.length > 0 ? momentsTone : afterPress)

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Events', href: '/events' },
        ]}
      />
      <PageHero
        eyebrow="Sabha · सभा · Gatherings"
        title="Music is meant to be heard."
        lede={
          <p>
            Through the year {'RAAGA'} holds concerts, workshops, lecture
            demonstrations and observances — and every one of them exists so
            that students have somewhere to sing.
          </p>
        }
      />

      {/* Dated events only when there genuinely are some. */}
      <Section
        id="upcoming"
        eyebrow="Coming up"
        title="Upcoming."
        renderIf={upcoming.length > 0}
      >
        <ul className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
          {upcoming.map((e) => (
            <li key={e.id} className="bg-surface p-7 md:p-9">
              <p className="u-eyebrow">{e.kind.replace(/-/g, ' ')}</p>
              <h2 className="mt-3 text-[length:var(--text-step-2)] font-[300]">
                {e.title}
              </h2>
              <p className="mt-2 font-[var(--font-ui)] text-[length:var(--text-step--1)] text-text-muted">
                {new Date(e.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}{' '}
                · {e.venue}
              </p>
              {e.blurb && (
                <p className="mt-4 text-[length:var(--text-step--1)] leading-[var(--lh-body)] text-text-secondary">
                  {e.blurb}
                </p>
              )}
            </li>
          ))}
        </ul>
      </Section>

      {/* Newspaper coverage. Clippings show adults only, so there is no
          consent gate; the section appears whenever there is coverage. */}
      <Section
        id="press"
        eyebrow="Coverage"
        title="In the press."
        tone={pressTone}
        renderIf={press.length > 0}
      >
        <PressMentions items={press} />
      </Section>

      {/* Photographs of past events. The consent gate runs in the query, so
          while none has recorded guardian consent this renders nothing: no
          heading, no empty frame. */}
      <Section
        id="moments"
        eyebrow="Photographs"
        title="From our gatherings."
        tone={momentsTone}
        renderIf={moments.length > 0}
      >
        <EventMoments groups={moments} />
      </Section>

      <Section
        id="what-we-hold"
        eyebrow="Through the year"
        title="What we hold."
        tone={ledgerTone}
        renderIf={kinds.length > 0}
      >
        {/* A ledger, not cards. These are the recurring gatherings of a year —
            they read as a programme, and a programme is a list. */}
        <LedgerIndex
          items={kinds.map((k) => ({ key: k.order, term: k.name, body: k.body }))}
        />

        {upcoming.length === 0 && (
          <p className="u-measure mt-12 border-l-2 border-gold-hairline/50 pl-5 font-[var(--font-display)] text-[length:var(--text-step--1)] italic text-text-muted">
            Dates for the coming term are confirmed with students first.{' '}
            <a
              href={whatsappHref(
                'EVENTS',
                'Hello RAAGA — please let me know when the next kutcheri or workshop is announced.',
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-4"
            >
              Message us
            </a>{' '}
            if you would like to be told when the next kutcheri or workshop is
            announced.
          </p>
        )}
      </Section>

      <FinalCta />
    </>
  )
}
