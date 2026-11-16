import type { Metadata } from 'next'
import Image from 'next/image'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { LinkRows } from '@/components/layout/Editorial'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { JsonLd, BASE_URL } from '@/components/seo/Schema'
import { FinalCta } from '@/components/sections/FinalCta'
import { getGuruProfileBySlug, getGuruProfiles } from '@/data/content'
import type { GuruProfile } from '@/content/seed'
import { defaultOgImages } from '@/lib/og-image'

type Props = { params: Promise<{ slug: string }> }

const LANGUAGE: Record<'en' | 'te', string> = { en: 'English', te: 'Telugu' }
const LANGUAGE_CODE: Record<string, string> = { English: 'en', Telugu: 'te' }

export async function generateStaticParams() {
  return (await getGuruProfiles()).map(({ slug }) => ({ slug }))
}

function fullName(g: GuruProfile) {
  return g.honorific ? `${g.honorific} ${g.name}` : g.name
}

/** "Telugu and English", "Beginner, Intermediate and Advanced". */
function joinNatural(items: string[]) {
  if (items.length < 2) return items.join('')
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guru = await getGuruProfileBySlug((await params).slug)
  if (!guru) return {}
  const title = `${fullName(guru)}: ${guru.role}`
  const description = `${guru.summary} Training, performances and teaching at RAAGA, Hyderabad.`
  const canonical = `/gurus/${guru.slug}`
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { type: 'profile', title, description, url: `${BASE_URL}${canonical}`, images: defaultOgImages },
  }
}

/**
 * The profile as structured data: a ProfilePage whose main entity is the
 * Person, and each book a Book whose author is that Person. This is what lets
 * Google and the AI assistants answer "who teaches at RAAGA" or "who wrote
 * Bhasuri" with this page, and keep a teacher apart from unrelated people of
 * the same name. Every property is emitted only when the profile states it.
 * No `offers` on the books: no prices, by rule.
 */
function profileSchema(g: GuruProfile) {
  const url = `${BASE_URL}/gurus/${g.slug}`
  const person = `${url}#person`
  const languages = g.languages
    ? g.languages.map((l) => LANGUAGE_CODE[l] ?? l)
    : [...new Set((g.books ?? []).map((b) => b.language))]
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${url}#page`,
        url,
        name: fullName(g),
        inLanguage: 'en-IN',
        isPartOf: { '@id': `${BASE_URL}/#website` },
        mainEntity: { '@id': person },
      },
      {
        '@type': 'Person',
        '@id': person,
        name: g.name,
        ...(g.honorific ? { honorificPrefix: g.honorific } : {}),
        ...(g.alternateNames ? { alternateName: g.alternateNames } : {}),
        description: g.summary,
        jobTitle: g.role,
        url,
        worksFor: { '@id': `${BASE_URL}/#institute` },
        ...(g.birthPlace ? { birthPlace: { '@type': 'Place', name: g.birthPlace } } : {}),
        ...(g.qualification
          ? { hasCredential: { '@type': 'EducationalOccupationalCredential', name: g.qualification } }
          : {}),
        ...(g.education
          ? {
              alumniOf: g.education.map((e) => ({
                '@type': e.kind === 'university' ? 'CollegeOrUniversity' : 'EducationalOrganization',
                name: e.name,
                ...(e.place
                  ? { address: { '@type': 'PostalAddress', addressLocality: e.place, addressCountry: 'IN' } }
                  : {}),
              })),
            }
          : {}),
        ...(g.awards ? { award: g.awards.map((a) => `${a.title} (${a.year})`) } : {}),
        knowsAbout: ['Carnatic music', 'Carnatic vocal', 'Carnatic Sangeetham', 'Indian classical music'],
        ...(languages.length ? { knowsLanguage: languages } : {}),
        ...(g.sources
          ? { subjectOf: g.sources.map((s) => ({ '@type': 'CreativeWork', name: s.label, url: s.href })) }
          : {}),
      },
      ...(g.books ?? []).map((b, i) => ({
        '@type': 'Book',
        '@id': `${url}#book-${i + 1}`,
        name: b.subtitle ? `${b.title}: ${b.subtitle}` : b.title,
        ...(b.originalTitle ? { alternateName: b.originalTitle } : {}),
        author: { '@id': person },
        inLanguage: b.language,
        bookFormat: 'https://schema.org/Paperback',
        ...(b.selfPublished
          ? { publisher: { '@id': person } }
          : b.publisher
            ? { publisher: { '@type': 'Organization', name: b.publisher } }
            : {}),
        ...(b.published ? { datePublished: b.published } : {}),
        ...(b.pages ? { numberOfPages: b.pages } : {}),
        ...(b.cover ? { image: `${BASE_URL}${b.cover.src}` } : {}),
        description: b.summary,
      })),
    ],
  }
}

/**
 * The facts a parent scans before reading: qualification, Guru, years, levels,
 * languages. Only the rows the profile states; no row is ever shown empty.
 */
function factRows(g: GuruProfile): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = []
  if (g.qualification) rows.push({ label: 'Qualification', value: g.qualification })
  if (g.teachers.length === 1) rows.push({ label: 'Trained under', value: g.teachers[0] })
  if (g.experience) {
    rows.push({ label: 'In music', value: g.experience.music })
    rows.push({ label: 'Teaching', value: g.experience.teaching })
  }
  if (g.levels?.length) rows.push({ label: 'Levels taught', value: joinNatural(g.levels) })
  if (g.languages?.length) rows.push({ label: 'Teaches in', value: joinNatural(g.languages) })
  if (g.birthPlace) rows.push({ label: 'Born', value: g.birthPlace })
  return rows
}

export default async function GuruPage({ params }: Props) {
  const guru = await getGuruProfileBySlug((await params).slug)
  if (!guru) notFound()
  const href = `/gurus/${guru.slug}`
  const facts = factRows(guru)
  const books = guru.books ?? []
  const sources = guru.sources ?? []

  return (
    <>
      <JsonLd data={profileSchema(guru)} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'The Gurus', href: '/gurus' },
          { name: fullName(guru), href },
        ]}
      />
      <PageHero
        variant="night"
        eyebrow={`The Gurus · ${guru.role}`}
        title={
          guru.honorific ? (
            <>
              {guru.honorific} <em>{guru.name}</em>
            </>
          ) : (
            <em>{guru.name}</em>
          )
        }
        lede={<p>{guru.summary}</p>}
      />

      <div className="u-shell pad-section-sm">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-10">
          <aside className="mb-14 lg:col-span-3 lg:mb-0">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              {guru.photo && (
                <div className="plate mb-10 max-w-[18rem]">
                  <Image
                    src={guru.photo}
                    alt={`Portrait of ${fullName(guru)}`}
                    sizes="(min-width: 1024px) 18rem, calc(100vw - 3.5rem)"
                    placeholder="blur"
                    className="h-auto w-full"
                  />
                </div>
              )}
              {facts.length > 0 && (
                <dl className="border-t border-line">
                  {facts.map((row) => (
                    <div key={row.label} className="border-b border-line py-3">
                      <dt className="t-label text-fg-3">{row.label}</dt>
                      <dd className="t-small mt-1 text-fg-2">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {guru.alternateNames && guru.alternateNames.length > 0 && (
                <>
                  <p className="t-label mt-10 text-fg-3">Also written</p>
                  <ul className="mt-4 border-t border-line">
                    {guru.alternateNames.map((n) => (
                      <li key={n} className="t-small border-b border-line py-3 text-fg-2">
                        {n}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </aside>

          <article className="lg:col-span-7 lg:col-start-5">
            {guru.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-[calc(var(--header-h)+1.5rem)] [&+&]:mt-16 md:[&+&]:mt-20"
              >
                <h2 className="t-subhead text-balance text-fg">{section.title}</h2>
                <div className="mt-6 space-y-5">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="t-prose u-measure text-fg-2">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.id === 'training' && guru.teachers.length > 1 && (
                  <ul className="u-measure mt-8 border-t border-line">
                    {guru.teachers.map((t) => (
                      <li
                        key={t}
                        className="t-prose grid grid-cols-[1.25rem_1fr] gap-x-3 border-b border-line py-4 text-fg"
                      >
                        <span aria-hidden="true" className="mt-[0.72em] size-1.5 rotate-45 bg-mark" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </article>
        </div>
      </div>

      <Section
        id="philosophy"
        tone="paper"
        layout="split"
        eyebrow="Teaching philosophy"
        title="How the lessons are taught."
        renderIf={Boolean(guru.philosophy)}
      >
        <p className="t-standfirst max-w-[48ch] text-fg-2">{guru.philosophy}</p>
      </Section>

      <Section
        id="books"
        tone="sand"
        eyebrow="Books"
        title="Written for students of Carnatic music."
        renderIf={books.length > 0}
      >
        <ul className="grid gap-x-10 gap-y-16 md:grid-cols-2">
          {books.map((b, i) => (
            <li key={b.title} className="reveal flex flex-col items-start gap-x-6 gap-y-6 sm:flex-row" style={{ '--i': i } as CSSProperties}>
              {b.cover ? (
                <div className="plate inline-block shrink-0 p-1.5">
                  <Image
                    src={b.cover}
                    alt={`Cover of ${b.title}`}
                    sizes="150px"
                    placeholder="blur"
                    loading="lazy"
                    className="h-auto w-[8.625rem]"
                  />
                </div>
              ) : null}
              <div>
                <h3 className="t-title italic text-fg">{b.title}</h3>
                {(b.subtitle || b.originalTitle) && (
                  <p className="t-small mt-1 text-fg-2" lang={b.originalTitle ? b.language : undefined}>
                    {b.subtitle ?? b.originalTitle}
                  </p>
                )}
                <p className="t-meta mt-3 text-fg-3">
                  {[LANGUAGE[b.language], b.selfPublished ? 'Published by the author' : b.publisher, b.published, b.pages ? `${b.pages} pages` : null]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
                <p className="t-body mt-4 text-fg-2">{b.summary}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="sources" title="Where these facts come from." tone="paper" layout="split">
        <p className="t-body text-fg-2">{guru.provenance}</p>
        {sources.length > 0 && (
          <ul className="mt-6 space-y-3">
            {sources.map((s) => (
              <li key={s.href} className="t-body text-fg-2">
                <a href={s.href} className="link">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-14">
          <LinkRows
            links={[
              { label: 'All the Gurus and the lineage', href: '/gurus' },
              { label: 'Carnatic music for beginners: the first lessons', href: '/guides/carnatic-music-for-beginners' },
              { label: 'Carnatic vocal classes in Hyderabad', href: '/music-classes' },
            ]}
          />
        </div>
      </Section>
      <FinalCta />
    </>
  )
}
