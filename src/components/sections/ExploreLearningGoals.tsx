import Link from 'next/link'
import { Section } from '@/components/layout/Section'
import { getSeoLandingPages } from '@/data/content'

/**
 * The internal-linking hub for the focused SEO programme. It gives visitors a
 * useful way to self-select their starting point and gives crawlers one clear
 * parent page for every intent page. It is deliberately kept on /courses,
 * where visitors are already choosing a learning path, rather than bloating
 * the homepage.
 */
export async function ExploreLearningGoals() {
  const pages = await getSeoLandingPages()

  return (
    <Section
      id="learning-goals"
      eyebrow="Find your starting point"
      title="Choose the path that sounds like you."
      lede={
        <p>
          The same musical tradition meets different learners in different
          places. Start with the question you are actually asking.
        </p>
      }
      renderIf={pages.length > 0}
      tone="surface"
    >
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {pages.map((page) => (
          <li key={page.slug} className="group">
            <Link
              href={`/carnatic-music-classes/${page.slug}`}
              className="flex h-full min-h-48 flex-col rounded-[var(--radius-md)] border border-border bg-surface p-6 no-underline transition-[transform,border-color,box-shadow] duration-[var(--dur)] ease-[var(--ease-raaga)] hover:-translate-y-1 hover:border-accent hover:shadow-[var(--shadow-lift)] motion-reduce:transition-none motion-reduce:hover:transform-none"
            >
              <h3 className="text-[length:var(--text-step-1)] font-[400] text-text-primary group-hover:text-accent">
                {page.h1.replace(/\.$/, '')}
              </h3>
              <p className="mt-3 flex-1 text-[length:var(--text-step--1)] leading-[var(--lh-body)] text-text-secondary">
                {page.intro}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 self-start font-[var(--font-ui)] text-[length:var(--text-step--1)] font-medium text-accent">
                Explore this path
                <svg className="raga-link-arrow" width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                  <path d="M9 1l4 4-4 4M13 5H0" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  )
}
