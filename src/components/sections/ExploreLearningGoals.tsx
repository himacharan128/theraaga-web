import Link from 'next/link'
import { Section } from '@/components/layout/Section'
import { IndexList } from '@/components/layout/Editorial'
import { getSeoLandingPages } from '@/data/content'

/**
 * The internal-linking hub for the focused SEO programme. It gives visitors a
 * useful way to self-select their starting point and gives crawlers one clear
 * parent page for every intent page. It is deliberately kept on /learning,
 * where visitors are already choosing a learning path, rather than bloating
 * the homepage.
 *
 * Set on the dark stage as a contents page, one ruled row per path, so the
 * question a visitor is asking reads as the way in rather than as one more
 * card among equals.
 */
export async function ExploreLearningGoals() {
  const pages = await getSeoLandingPages()

  // The getting-started guide leads, set in the same row as the intent pages
  // after it so the list reads as one set.
  const rows = [
    {
      href: '/getting-started',
      title: 'New to Carnatic music?',
      body: 'Choose a learning format, understand the syllabus and prepare your questions before joining.',
      action: 'Read the getting-started guide',
    },
    ...pages.map((page) => ({
      href: `/carnatic-music-classes/${page.slug}`,
      title: page.h1.replace(/\.$/, ''),
      body: page.intro,
      action: 'Explore this path',
    })),
  ]

  return (
    <Section
      id="learning-goals"
      tone="night"
      layout="split"
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
      <IndexList items={rows} />
      <p className="reveal t-caption mt-10 max-w-[52ch] border-l border-mark pl-5 text-fg-2 md:text-[1.0625rem]">
        For help choosing a class or planning practice between lessons, read our{' '}
        <Link href="/guides" className="link">
          Carnatic music learning guides
        </Link>
        .
      </p>
    </Section>
  )
}
