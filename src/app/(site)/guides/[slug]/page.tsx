import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { FinalCta } from '@/components/sections/FinalCta'
import { getLearningGuideBySlug, getLearningGuides } from '@/data/content'
import { defaultOgImages } from '@/lib/og-image'

type Props = { params: Promise<{ slug: string }> }
const BASE = 'https://theraaga.in'

export async function generateStaticParams() {
  return (await getLearningGuides()).map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = await getLearningGuideBySlug((await params).slug)
  if (!guide) return {}
  const { title, description } = guide
  const canonical = `/guides/${guide.slug}`
  return {
    title, description, alternates: { canonical },
    openGraph: { title, description, url: `${BASE}${canonical}`, images: defaultOgImages },
    twitter: { card: 'summary_large_image', title, description, images: defaultOgImages },
  }
}

export default async function GuidePage({ params }: Props) {
  const guide = await getLearningGuideBySlug((await params).slug)
  if (!guide) notFound()
  const href = `/guides/${guide.slug}`
  const schema = {
    '@context': 'https://schema.org', '@type': 'WebPage',
    '@id': `${BASE}${href}#webpage`, url: `${BASE}${href}`,
    name: guide.title, description: guide.description, inLanguage: 'en-IN',
    isPartOf: { '@id': `${BASE}/#website` },
    publisher: { '@id': `${BASE}/#org` },
    relatedLink: guide.related.map((link) => `${BASE}${link.href}`),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Learning guides', href: '/guides' }, { name: guide.title, href }]} />
      <PageHero eyebrow="RAAGA learning guide" title={guide.title} lede={<p>{guide.intro}</p>} />
      <div className="u-shell pb-10">
        <nav aria-label="In this guide" className="border-y border-border py-6">
          <p className="u-eyebrow mb-4">In this guide</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {guide.sections.map((section) => <li key={section.id}>
              <a href={`#${section.id}`} className="text-accent underline underline-offset-4">{section.title}</a>
            </li>)}
          </ul>
        </nav>
      </div>
      {guide.sections.map((section) => <Section key={section.id} id={section.id} title={section.title}>
        <div className="u-measure space-y-5 text-text-secondary">
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {section.bullets && <ul className="list-disc space-y-3 pl-6">
            {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
          </ul>}
        </div>
      </Section>)}
      <Section id="next-steps" title="Put it into practice." tone="surface">
        <ul className="grid gap-4 sm:grid-cols-2">
          {guide.related.map((link) => <li key={link.href}>
            <Link href={link.href} className="inline-block py-2 text-accent underline underline-offset-4">{link.label}</Link>
          </li>)}
        </ul>
        {guide.sources.length > 0 && <div className="mt-10 border-t border-border pt-6">
          <h3 className="text-lg">Further reading</h3>
          <ul className="mt-3 space-y-3 text-text-secondary">
            {guide.sources.map((source) => <li key={source.href}>
              <a href={source.href} className="underline underline-offset-4">{source.label}</a>
            </li>)}
          </ul>
        </div>}
      </Section>
      <FinalCta />
    </>
  )
}
