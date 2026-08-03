import type { Metadata } from 'next'
import { PageHero, Prose } from '@/components/layout/PageHero'
import { LegalDraftNotice } from '@/components/layout/LegalDraftNotice'
import { site } from '@/content/seed/site'

export const metadata: Metadata = {
  title: 'Terms of use',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of use" />
      <Prose>
        <LegalDraftNotice />

        <h2>About this site</h2>
        <p>
          This website is operated by {site.legalName}. By using it you agree to
          these terms.
        </p>

        <h2>Enquiries are not enrolment</h2>
        <p>
          Submitting the form on this site is a request to be contacted. It does
          not reserve a place in a batch and it does not create any obligation on
          either side. Enrolment happens separately, after we have spoken.
        </p>

        <h2>Class conduct</h2>
        <p>
          Carnatic music is cumulative — each class builds directly on the last —
          so we ask for consistent attendance and daily practice. Where a class
          is missed with notice we will offer a make-up slot if the timetable
          allows. We reserve the right to end a student’s enrolment where conduct
          disrupts other students, and we will always discuss this with a parent
          first.
        </p>

        <h2>Community and clubhouse classes</h2>
        <p>
          Classes held in a gated community depend on that community’s residents’
          association granting and maintaining permission to use the space. If
          that permission is withdrawn we will offer affected students an
          equivalent slot at our institute or online.
        </p>

        <h2>Content on this site</h2>
        <p>
          Text, images and recordings on this site belong to the school or to the
          people depicted in them, and may not be reproduced without permission.
          Descriptions of the syllabus and its stage durations are indicative:
          every student progresses differently, and nothing here is a guarantee
          of a particular outcome in a particular time.
        </p>

        <h2>Contact</h2>
        <p>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <br />
          {site.locality}, {site.city}, {site.region}
        </p>
      </Prose>
    </>
  )
}
