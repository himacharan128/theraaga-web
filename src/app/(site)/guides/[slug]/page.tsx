import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { FinalCta } from '@/components/sections/FinalCta'
import { LinkRows } from '@/components/layout/Editorial'
import { getLearningGuideBySlug, getLearningGuides } from '@/data/content'
import { guideMeta } from '@/lib/reading'
import { defaultOgImages } from '@/lib/og-image'

type Props = { params: Promise<{ slug: string }> }
const BASE = 'https://theraaga.in'

/** "digital.nios.ac.in": where a further-reading link leads, said before it is followed. */
function hostOf(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

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
      <PageHero
        eyebrow={`RAAGA learning guide · ${guideMeta(guide)}`}
        title={guide.title}
        lede={<p>{guide.intro}</p>}
      />

      {/* One reading column, its contents held in a rail beside it on a wide
          screen and set above it on a phone. */}
      <div className="u-shell pad-section-sm">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-10">
          <nav aria-label="In this guide" className="mb-14 lg:col-span-3 lg:mb-0">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <p className="t-label text-fg-3">In this guide</p>
              <ol className="mt-4 border-t border-line">
                {guide.sections.map((section, i) => (
                  <li key={section.id} className="border-b border-line">
                    <a
                      href={`#${section.id}`}
                      className="group grid min-h-11 grid-cols-[1.75rem_1fr] items-baseline gap-x-2 py-3 no-underline"
                    >
                      <span aria-hidden="true" className="t-meta text-fg-3">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="t-small text-fg-2 transition-colors duration-[var(--dur-1)] group-hover:text-kicker">
                        {section.title}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <article className="lg:col-span-7 lg:col-start-5">
            {guide.sections.map((section, i) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-[calc(var(--header-h)+1.5rem)] [&+&]:mt-16 md:[&+&]:mt-20"
              >
                <p aria-hidden="true" className="t-numeral text-[1.5rem] text-accent-muted">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h2 className="t-subhead mt-3 text-balance text-fg">{section.title}</h2>
                <div className="mt-6 space-y-5">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="t-prose u-measure text-fg-2">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.bullets && (
                  <ul className="u-measure mt-8 border-t border-line">
                    {section.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="t-prose grid grid-cols-[1.25rem_1fr] gap-x-3 border-b border-line py-4 text-fg"
                      >
                        <span aria-hidden="true" className="mt-[0.72em] size-1.5 rotate-45 bg-mark" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </article>
        </div>
      </div>

      <Section id="next-steps" title="Put it into practice." tone="paper" layout="split">
        <LinkRows links={guide.related} />
        {guide.sources.length > 0 && (
          <div className="mt-14">
            <h3 className="t-label text-fg-3">Further reading</h3>
            <ul className="mt-4 space-y-3">
              {guide.sources.map((source) => (
                <li key={source.href} className="t-body text-fg-2">
                  <a href={source.href} className="link">
                    {source.label}
                  </a>
                  <span className="t-meta ml-3 text-fg-3">{hostOf(source.href)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>
      <FinalCta />
    </>
  )
}
