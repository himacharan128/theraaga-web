import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { IndexList, LedgerIndex, LinkRows } from '@/components/layout/Editorial'
import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { FinalCta } from '@/components/sections/FinalCta'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { BASE_URL, JsonLd } from '@/components/seo/Schema'
import { getCentres } from '@/data/content'
import { whatsappHref } from '@/lib/whatsapp'
import { defaultOgImages } from '@/lib/og-image'

/**
 * Where RAAGA teaches in Hyderabad, on one page.
 *
 * This is the hub Google's doorway-page policy allows: one browsable page
 * that names every area honestly, rather than a page per locality with the
 * name swapped in. A locality earns its own page only when the school can
 * say something true and specific about it (a community batch, a teacher,
 * a real journey), and until then it is a line here.
 *
 * Everything below comes from the centres data or from what the school
 * already publishes. Areas without a centre nearby are told plainly that
 * online or a community class is the realistic option.
 */
export const metadata: Metadata = {
  title: 'Carnatic Music Classes Across Hyderabad',
  description:
    'Where RAAGA teaches Carnatic vocal in Hyderabad: Jubilee Hills, Phoenix Arena in Hitech City, residential communities, and live online for every other area.',
  alternates: { canonical: '/music-classes' },
  openGraph: {
    title: 'Carnatic music classes across Hyderabad at RAAGA',
    description:
      'Two centres, classes in residential communities and live online lessons. Find the option that fits where you live.',
    url: `${BASE_URL}/music-classes`,
    images: defaultOgImages,
  },
}

/**
 * Areas the centres data does not list as a catchment. Named so a family
 * there gets a straight answer, not a promise of a nearby class.
 */
const FURTHER_AREAS = [
  {
    key: 'north-west',
    term: 'Kukatpally, KPHB, Miyapur, Nizampet, Bachupally',
    body: 'Learn live online to the same syllabus, or ask whether a community class is possible where you live. If you would rather travel, check the journey to Jubilee Hills at your class time first.',
  },
  {
    key: 'west',
    term: 'Nallagandla, Tellapur, Narsingi, Lingampally',
    body: 'Compare the journey to Phoenix Arena in Hitech City at your class time with learning online. A residential community can also host a class.',
  },
  {
    key: 'central',
    term: 'Ameerpet, Begumpet, Somajiguda, SR Nagar, Secunderabad',
    body: 'Jubilee Hills is the closer centre for most of central Hyderabad. Online lessons suit families for whom the evening traffic makes a weekly class hard to keep.',
  },
  {
    key: 'east-south',
    term: 'Uppal, Dilsukhnagar, LB Nagar, Kompally and beyond',
    body: 'Neither centre is a practical weekly journey from here. Live online classes are taught by the same Gurus to the same syllabus.',
  },
]

export default async function MusicClassesHubPage() {
  const centres = await getCentres()
  const physical = centres.filter((c) => c.slug)
  const community = centres.find((c) => c.key === 'community')

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': `${BASE_URL}/music-classes#webpage`,
          url: `${BASE_URL}/music-classes`,
          name: 'Carnatic Music Classes Across Hyderabad | RAAGA',
          inLanguage: 'en-IN',
          isPartOf: { '@id': `${BASE_URL}/#website` },
          about: { '@id': `${BASE_URL}/#institute` },
          hasPart: physical.map((c) => ({ '@id': `${BASE_URL}/#centre-${c.key}` })),
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Classes across Hyderabad', href: '/music-classes' },
        ]}
      />
      <PageHero
        variant="statement"
        eyebrow="Hyderabad · Telangana"
        title={
          <>
            Carnatic music classes <em>across Hyderabad.</em>
          </>
        }
        lede={
          <p>
            Two centres, classes hosted in residential communities, and live
            online lessons for the rest of the city. Find the option that fits
            where you live, then confirm timings with the team.
          </p>
        }
      >
        <ButtonLink href="/contact">Book a trial</ButtonLink>
        <ButtonLink variant="secondary" href={whatsappHref('HUB-PAGE')}>
          <WhatsAppIcon />
          Ask which option suits you
        </ButtonLink>
      </PageHero>

      <Section id="centres" eyebrow="In person" title="Our two centres." layout="split">
        <IndexList
          items={physical.map((c) => {
            const where = c.locality?.replace(', Hyderabad', '')
            return {
              href: c.href,
              title: where && where !== c.name ? `${c.name}, ${where}` : c.name,
              body: `${c.body} Within reach of ${c.nearby.join(', ')}.`,
            }
          })}
        />
      </Section>

      <Section
        id="community"
        tone="sand"
        eyebrow="In your community"
        title="Classes in residential communities."
        layout="split"
        renderIf={Boolean(community)}
      >
        <div className="reveal max-w-[60ch] space-y-5">
          <p className="t-standfirst text-fg-2">{community?.body}</p>
          <p className="t-body text-fg-2">
            A community class is arranged with the community itself, so we do
            not publish where or when these run.
          </p>
        </div>
      </Section>

      <Section
        id="elsewhere"
        eyebrow="Elsewhere in Hyderabad"
        title="Further from a centre?"
        layout="split"
      >
        <LedgerIndex items={FURTHER_AREAS} />
      </Section>

      <Section
        id="outside-hyderabad"
        tone="night"
        eyebrow="Outside Hyderabad"
        title="Across Telangana, Andhra Pradesh and abroad."
        layout="split"
      >
        <div className="reveal max-w-[60ch] space-y-5">
          <p className="t-standfirst text-fg-2">
            Learning Carnatic sangeetham from Warangal, Vijayawada,
            Visakhapatnam, Guntur, Tirupati or anywhere else in India? Our{' '}
            <Link href="/online-classes" className="link">
              live online classes
            </Link>{' '}
            follow the same syllabus as the Hyderabad centres, with lesson times
            arranged for families in the Gulf, the UK, the US, Singapore and
            Australia.
          </p>
        </div>
      </Section>

      <Section id="next" title="Before you choose." layout="rail">
        <LinkRows
          links={[
            { label: 'How to choose singing classes in Hyderabad', href: '/guides/choosing-singing-classes-hyderabad' },
            { label: 'Online or in person?', href: '/guides/online-or-in-person-carnatic-classes' },
            { label: 'Carnatic classes for children', href: '/carnatic-music-classes/children' },
            { label: 'Carnatic classes for adults', href: '/carnatic-music-classes/adults' },
          ]}
        />
      </Section>

      <FinalCta />
    </>
  )
}
