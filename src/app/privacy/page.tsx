import type { Metadata } from 'next'
import { PageHero, Prose } from '@/components/layout/PageHero'
import { LegalDraftNotice } from '@/components/layout/LegalDraftNotice'
import { site } from '@/content/seed/site'

export const metadata: Metadata = {
  title: 'Privacy notice',
  description:
    'How RAAGA, Jubilee Hills, Hyderabad collects and uses personal data, under the Digital Personal Data Protection Act 2023.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy notice"
        lede={<p>How we handle your information, and how to have it removed.</p>}
      />
      <Prose>
        <LegalDraftNotice />

        <h2>What we collect</h2>
        <p>
          When you use the enquiry form on this site we collect: your name, your
          WhatsApp number, an optional email address, whether you are enquiring
          for yourself or for a child, an age range, which class format you are
          interested in, whether you would like to learn at Jubilee Hills, at
          Hitech City or online, and anything else you choose to tell us in the
          optional message field.
        </p>
        <p>
          We also record how you arrived at the site (for example, a link shared
          in a WhatsApp group) so that we know which of our efforts are useful.
        </p>

        <h2>What we deliberately do not collect</h2>
        <ul>
          <li>
            <strong>We never ask for a child’s name or date of birth on this
            website.</strong> We collect the parent or guardian’s details and a
            broad age range only. A child’s own details are taken at enrolment,
            in person, and not through this form.
          </li>
          <li>
            <strong>We set no tracking cookies</strong> and we run no advertising
            pixels of any kind. No Meta Pixel or Google Ads remarketing, ever.
            This is a permanent commitment, not a current setting.
          </li>
          <li>
            <strong>We do not build advertising profiles</strong> and we do not
            sell, rent or share your details with any third party for marketing.
          </li>
        </ul>

        <h2>Children</h2>
        <p>
          Under the Digital Personal Data Protection Act 2023 a child is anyone
          under eighteen. Where an enquiry concerns a child, we require the
          parent or guardian to confirm that they are making it. We do not track
          or profile children, and we do not direct advertising at them.
        </p>
        <p>
          We publish no photograph, recording or name of a student under eighteen
          without specific written consent from their parent or guardian naming
          that particular photograph or recording and the use we intend.
        </p>

        <h2>Why we use it, and for how long</h2>
        <p>
          We use your details for one purpose: to contact you about classes you
          asked about. We keep an enquiry for twenty-four months and then delete
          it. You can ask us to delete it sooner at any point, and we will.
        </p>

        <h2>Your rights</h2>
        <p>
          You may ask us what we hold about you, ask us to correct it, ask us to
          delete it, or withdraw your consent. The easiest way is to message us
          on WhatsApp or write to{' '}
          <a href={`mailto:${site.email}`}>{site.email}</a>. We will act within
          thirty days.
        </p>

        <h2>Grievance officer</h2>
        <p>
          If you are unhappy with how we have handled your data, you may contact
          our grievance officer. If we do not resolve it, you may complain to the
          Data Protection Board of India.
        </p>
        <p>
          {/* TIER 0: the client must supply a named person and a contact address.
              A DPDP notice requires this and it cannot be guessed. */}
          <em>
            Grievance officer name and contact address to be published before
            launch.
          </em>
        </p>

        <h2>Who we are</h2>
        <p>
          {site.legalName}
          <br />
          {site.locality}, {site.city}, {site.region}, {site.country}
          <br />
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      </Prose>
    </>
  )
}
