import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { LinkRows } from '@/components/layout/Editorial'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { ButtonLink } from '@/components/ui/Button'
import { FinalCta } from '@/components/sections/FinalCta'
import {
  getSeoLandingPageBySlug,
  getSeoLandingPages,
} from '@/data/content'
import { defaultOgImages } from '@/lib/og-image'

const BASE_URL = 'https://theraaga.in'

type Params = Promise<{ intent: string }>

export async function generateStaticParams() {
  const pages = await getSeoLandingPages()
  return pages.map((page) => ({ intent: page.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { intent } = await params
  const page = await getSeoLandingPageBySlug(intent)
  if (!page) return {}

  const canonical = `/carnatic-music-classes/${page.slug}`
  const title = page.title

  return {
    title,
    description: page.description,
    alternates: { canonical },
    openGraph: {
      title: `${title} at RAAGA`,
      description: page.description,
      url: `${BASE_URL}${canonical}`,
      images: defaultOgImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} at RAAGA`,
      description: page.description,
      images: defaultOgImages,
    },
  }
}

function IntentPageSchema({
  title,
  description,
  href,
}: {
  title: string
  description: string
  href: string
}) {
  const url = `${BASE_URL}${href}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: `${title} | RAAGA`,
    description,
    inLanguage: 'en-IN',
    isPartOf: { '@id': `${BASE_URL}/#website` },
    about: { '@id': `${BASE_URL}/#institute` },
    mainEntity: { '@id': `${BASE_URL}/#institute` },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default async function CarnaticIntentPage({ params }: { params: Params }) {
  const { intent } = await params
  const page = await getSeoLandingPageBySlug(intent)
  if (!page) notFound()

  const href = `/carnatic-music-classes/${page.slug}`

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Learning', href: '/learning' },
          { name: page.h1.replace(/\.$/, ''), href },
        ]}
      />
      <IntentPageSchema title={page.title} description={page.description} href={href} />

      <PageHero
        eyebrow={page.eyebrow}
        title={page.h1}
        lede={<p>{page.intro}</p>}
      >
        <ButtonLink href="/contact">Book a trial</ButtonLink>
      </PageHero>

      <Section
        id="at-a-glance"
        eyebrow="At a glance"
        title="A clear way to begin."
        layout="split"
      >
        <ul
          className={`grid gap-x-10 gap-y-12 ${
            page.highlights.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
          }`}
        >
          {page.highlights.map((highlight, i) => (
            <li
              key={highlight.title}
              className="reveal border-t border-mark pt-6"
              style={{ '--i': i } as CSSProperties}
            >
              <h3 className="t-subhead text-balance text-accent">{highlight.title}</h3>
              <p className="t-body mt-4 max-w-[42ch] text-fg-2">{highlight.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* The questions a learner actually has, read as one chapter on sand:
          each its own section and heading, the question held on the left and
          the answer in a reading column beside it. */}
      <div className="tone-sand pad-section">
        <div className="u-shell">
          <p className="kicker reveal mb-10 md:mb-14">The learning journey</p>
          {page.sections.map((section, index) => (
            <section
              key={section.title}
              id={`detail-${index + 1}`}
              data-section={`detail-${index + 1}`}
              className="reveal grid scroll-mt-[calc(var(--header-h)+1.5rem)] gap-y-4 border-t border-line py-10 last:border-b md:py-14 lg:grid-cols-12 lg:gap-x-10"
            >
              <h2 className="t-subhead text-balance text-fg lg:col-span-5">{section.title}</h2>
              <p className="t-prose max-w-[60ch] text-fg-2 lg:col-span-7">{section.body}</p>
            </section>
          ))}
        </div>
      </div>

      <Section
        id="next-steps"
        eyebrow="Continue exploring"
        title="Take the next useful step."
        layout="split"
      >
        <LinkRows links={page.related} />
      </Section>

      <FinalCta />
    </>
  )
}
