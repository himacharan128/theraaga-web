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
import { monthYear } from '@/lib/dates'

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
 * Sabha: Events.
 *
 * This page is in the navigation because the client's content master asks for
 * it, and it is honest because it publishes what RAAGA actually does rather than
 * a calendar it does not have.
 *
 * The distinction is load-bearing: the KINDS of gathering are real and
 * client-supplied, so they render always. Dated occurrences render above them
 * only once `events` holds real ones. Nothing here implies a scheduled date:
 * an invented "Annual Day, March 2026" would be the single most damaging thing
 * this page could contain, because someone would turn up.
 *
 * The page opens on the first photograph of the first occasion, taken through
 * the same consent gate as every other picture of people; that photograph is
 * then left out of the gallery below so nothing is shown twice. If the gate
 * ever returns nothing, the hero is the dark stage without a picture.
 *
 * Order, unchanged: upcoming (only when real), press, photographs, the kinds
 * of gathering. Grounds alternate so no two neighbours share a tone.
 */
export default async function EventsPage() {
  const [kinds, upcoming, press, moments] = await Promise.all([
    getEventKinds(),
    getUpcomingEvents(),
    getPressMentions(),
    getEventPhotos(),
  ])

  const lead = moments[0]
  const cover = lead?.photos[0]

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Events', href: '/events' },
        ]}
      />
      <PageHero
        variant="image"
        eyebrow="Sabha · सभा · Gatherings"
        title="Music is meant to be heard."
        lede={
          <p>
            Through the year {'RAAGA'} holds concerts, workshops, lecture
            demonstrations and observances, and every one of them exists so
            that students have somewhere to sing.
          </p>
        }
        media={
          cover
            ? {
                src: cover.media.src,
                alt: cover.media.alt,
                focus: cover.focus,
                caption: lead.date ? (
                  <>
                    {lead.occasion}, <time dateTime={lead.date}>{monthYear(lead.date)}</time>
                  </>
                ) : (
                  lead.occasion
                ),
              }
            : undefined
        }
      />

      {/* Dated events only when there genuinely are some. */}
      <Section id="upcoming" tone="sand" eyebrow="Coming up" title="Upcoming." renderIf={upcoming.length > 0}>
        <ol className="border-t border-line">
          {upcoming.map((e) => (
            <li
              key={e.id}
              className="reveal grid gap-x-10 gap-y-2 border-b border-line py-7 md:grid-cols-[12rem_1fr] md:py-9"
            >
              <p className="t-meta text-fg-3">
                <time dateTime={e.date}>
                  {new Date(e.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
                <span className="mt-1 block capitalize">{e.kind.replace(/-/g, ' ')}</span>
              </p>
              <div>
                <h3 className="t-subhead text-fg">{e.title}</h3>
                <p className="t-small mt-2 text-fg-3">{e.venue}</p>
                {e.blurb && <p className="t-body mt-4 max-w-[56ch] text-fg-2">{e.blurb}</p>}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Newspaper coverage. Clippings show adults only, so there is no
          consent gate; the section appears whenever there is coverage. */}
      <Section id="press" layout="split" eyebrow="Coverage" title="In the press." renderIf={press.length > 0}>
        <PressMentions items={press} />
      </Section>

      {/* Photographs of past events. The consent gate runs in the query, so
          a photograph without recorded guardian consent never reaches here,
          and with none at all this renders nothing: no heading, no frame. */}
      <Section
        id="moments"
        tone="paper"
        eyebrow="Photographs"
        title="From our gatherings."
        renderIf={moments.some((g) => g.photos.some((p) => p.id !== cover?.id))}
      >
        <EventMoments groups={moments} skip={cover?.id} />
      </Section>

      <Section
        id="what-we-hold"
        layout="rail"
        tone="sand"
        eyebrow="Through the year"
        title="What we hold."
        renderIf={kinds.length > 0}
      >
        {/* A ledger, not cards. These are the recurring gatherings of a year:
            they read as a programme, and a programme is a list. */}
        <LedgerIndex items={kinds.map((k) => ({ key: k.order, term: k.name, body: k.body }))} />

        {upcoming.length === 0 && (
          <p className="reveal t-caption mt-10 max-w-[52ch] border-l border-mark pl-5 text-fg-2 md:text-[1.0625rem]">
            Dates for the coming term are confirmed with students first.{' '}
            <a
              href={whatsappHref(
                'EVENTS',
                'Hello RAAGA, please let me know when the next kutcheri or workshop is announced.',
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="link"
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
