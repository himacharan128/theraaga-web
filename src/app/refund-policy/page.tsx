import type { Metadata } from 'next'
import { PageHero, Prose } from '@/components/layout/PageHero'
import { LegalDraftNotice } from '@/components/layout/LegalDraftNotice'
import { site } from '@/content/seed/site'

/**
 * Required even before any payment is taken: Indian payment aggregators check
 * for exactly this page (alongside privacy, terms and contact) before
 * activating a merchant ID. Writing it now removes a launch blocker later.
 *
 * NOTE: no amounts appear here, per the standing no-prices rule. Timelines and
 * conditions only.
 */
export const metadata: Metadata = {
  title: 'Refund and cancellation policy',
  alternates: { canonical: '/refund-policy' },
}

export default function RefundPolicyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Refund and cancellation policy" />
      <Prose>
        <LegalDraftNotice />

        <h2>The first class is free</h2>
        <p>
          Every new student is offered a free trial class before enrolling. There
          is nothing to pay and nothing to refund at that stage, and no
          obligation to continue afterwards.
        </p>

        <h2>Cancelling an enrolment</h2>
        <p>
          You may stop attending at any time by telling us before the next
          billing period begins. We do not lock students into long contracts.
        </p>

        <h2>Refunds</h2>
        <p>
          Where a refund is due, it is processed to the original payment method
          within five to seven business days of being agreed.
        </p>
        <ul>
          <li>
            <strong>Classes we cancel.</strong> If we cancel a class and cannot
            offer a make-up slot, that class is refunded or credited in full.
          </li>
          <li>
            <strong>Classes you miss.</strong> A missed class with reasonable
            notice is offered a make-up slot where the timetable allows. Missed
            classes without notice are not generally refundable, because the
            teacher’s time was reserved.
          </li>
          <li>
            <strong>Batches that do not start.</strong> If a batch does
            not reach the numbers needed to run, anything already paid is
            refunded in full.
          </li>
        </ul>

        <h2>How to request one</h2>
        <p>
          Message us on WhatsApp or write to{' '}
          <a href={`mailto:${site.email}`}>{site.email}</a>. We will confirm in
          writing and tell you when to expect the money.
        </p>

        <p>
          {/* TIER 0: the client must confirm billing period, notice period and
              whether any joining fee exists. */}
          <em>
            Billing period, notice period and any joining arrangement to be
            confirmed before launch.
          </em>
        </p>
      </Prose>
    </>
  )
}
