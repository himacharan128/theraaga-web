import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
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
      >
        <ul
          className={`grid gap-x-10 gap-y-8 ${
            page.highlights.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
          }`}
        >
          {page.highlights.map((highlight) => (
            <li
              key={highlight.title}
              className="border-t border-border pt-6"
            >
              <h3 className="text-[length:var(--text-step-1)] font-[400] text-accent">
                {highlight.title}
              </h3>
              <p className="mt-3 text-text-secondary">{highlight.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      {page.sections.map((section, index) => (
        <Section
          key={section.title}
          id={`detail-${index + 1}`}
          eyebrow={index === 0 ? 'The learning journey' : undefined}
          title={section.title}
          tone={index % 2 === 0 ? 'surface' : 'default'}
        >
          <p className="u-measure text-[length:var(--text-step-0)] text-text-secondary">
            {section.body}
          </p>
        </Section>
      ))}

      <Section
        id="next-steps"
        eyebrow="Continue exploring"
        title="Take the next useful step."
      >
        <ul className="grid gap-3 sm:grid-cols-2">
          {page.related.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex min-h-16 items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-border bg-surface px-5 py-4 font-[var(--font-ui)] text-text-primary no-underline transition-[border-color,transform] duration-[var(--dur)] ease-[var(--ease-raaga)] hover:border-accent motion-safe:hover:-translate-y-0.5"
              >
                <span>{item.label}</span>
                <svg className="raga-link-arrow shrink-0 text-accent" width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
                  <path d="M10 1l5 5-5 5M15 6H0" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <FinalCta />
    </>
  )
}
