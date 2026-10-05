import Link from 'next/link'
import { Section } from '@/components/layout/Section'
import { getSeoLandingPages } from '@/data/content'

/**
 * One destination card. Shared with /getting-started so both pages use the
 * same card; the parent <li> must carry the `group` class.
 */
export function PathCard({
  href,
  title,
  body,
  cta,
}: {
  href: string
  title: string
  body: string
  cta: string
}) {
  return (
    <Link
      href={href}
      className="flex h-full min-h-48 flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-6 no-underline transition-[border-color,transform] duration-[var(--dur)] ease-[var(--ease-raaga)] hover:border-accent motion-safe:hover:-translate-y-0.5"
    >
      <h3 className="text-[length:var(--text-step-1)] font-[400] text-text-primary transition-colors duration-[var(--dur-fast)] group-hover:text-accent">
        {title}
      </h3>
      <p className="mt-3 flex-1 text-[length:var(--text-step--1)] leading-[var(--lh-body)] text-text-secondary">
        {body}
      </p>
      <span className="mt-6 inline-flex items-center gap-2 self-start font-[var(--font-ui)] text-[length:var(--text-step--1)] font-medium text-accent">
        {cta}
        <svg className="raga-link-arrow" width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
          <path d="M9 1l4 4-4 4M13 5H0" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </span>
    </Link>
  )
}

/**
 * The internal-linking hub for the focused SEO programme. It gives visitors a
 * useful way to self-select their starting point and gives crawlers one clear
 * parent page for every intent page. It is deliberately kept on /learning,
 * where visitors are already choosing a learning path, rather than bloating
 * the homepage.
 */
export async function ExploreLearningGoals() {
  const pages = await getSeoLandingPages()

  // The getting-started guide leads, and is rendered by the same PathCard as
  // the intent pages beside it so the grid reads as one set.
  const cards = [
    {
      href: '/getting-started',
      title: 'New to Carnatic music?',
      body: 'Choose a learning format, understand the syllabus and prepare your questions before joining.',
      cta: 'Read the getting-started guide',
    },
    ...pages.map((page) => ({
      href: `/carnatic-music-classes/${page.slug}`,
      title: page.h1.replace(/\.$/, ''),
      body: page.intro,
      cta: 'Explore this path',
    })),
  ]

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
    >
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <li key={card.href} className="group">
            <PathCard {...card} />
          </li>
        ))}
      </ul>
    </Section>
  )
}
