import type { Metadata } from 'next'
import { PageHero, Prose } from '@/components/layout/PageHero'
import { LegalDraftNotice } from '@/components/layout/LegalDraftNotice'
import { site } from '@/content/seed/site'
import { whatsappHref, telHref } from '@/lib/whatsapp'

/**
 * Most music-school sites do not have one of these. It is both the right thing
 * for a school teaching children and — for a parent choosing between a listed
 * tutor and an institute — a genuine differentiator that costs nothing but care.
 */
export const metadata: Metadata = {
  title: 'Child safeguarding',
  description:
    'How RAAGA keeps children safe in class at our Hyderabad centres and online, and how we handle photographs and recordings of students.',
  alternates: { canonical: '/child-safeguarding' },
}

export default function ChildSafeguardingPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Child safeguarding"
        lede={
          <p>
            Most of our students are children. These are the rules we hold
            ourselves to.
          </p>
        }
      />
      <Prose>
        <LegalDraftNotice />

        <h2>In class</h2>
        <ul>
          <li>
            Parents and guardians are welcome to sit in on any class, at any
            time, without arranging it in advance.
          </li>
          <li>
            Classes at our centres are held in shared, visible spaces, never
            behind a closed door in a private room.
          </li>
          <li>
            One-to-one classes with a child are held in an open space, or online
            with a parent able to be present.
          </li>
        </ul>

        <h2>Online</h2>
        <ul>
          <li>
            Classes are held on a scheduled link shared with the parent, not with
            the child directly.
          </li>
          <li>
            Teachers do not contact students under eighteen privately on any
            messaging platform. All communication goes through a parent or
            guardian.
          </li>
          <li>We do not record classes involving children.</li>
        </ul>

        <h2>Photographs and recordings</h2>
        <p>
          We publish nothing showing or naming a student under eighteen without
          written consent from their parent or guardian that names the specific
          photograph or recording and the use we intend. Consent can be withdrawn
          at any time, and we will remove the material.
        </p>
        <p>
          We never publish a child’s full name, their school, their class timing
          or their school alongside their photograph.
        </p>

        <h2>Raising a concern</h2>
        <p>
          If anything concerns you, however small, and whether or not it
          involves your own child, please tell us.{' '}
          <a href={whatsappHref('SAFEGUARDING')}>Message us on WhatsApp</a> or
          call <a href={telHref()}>{site.phoneDisplay}</a>. We will respond
          within two working days and we will not treat it as a complaint about
          you.
        </p>

        <p>
          {/* TIER 0: named safeguarding contact. */}
          <em>Named safeguarding contact to be published before launch.</em>
        </p>
      </Prose>
    </>
  )
}
