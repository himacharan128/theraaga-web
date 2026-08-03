'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitEnquiry, type EnquiryState } from '@/app/actions/enquiry'
import { Button, WhatsAppIcon } from '@/components/ui/Button'
import { readAttribution, track } from '@/lib/analytics'

/**
 * Four required fields on ONE screen — not a wizard.
 *
 * The popular multi-step claims do not survive checking: Zuko publishes no
 * proprietary data behind its article, and the widely-cited "13.85% vs 4.53%"
 * figure is not on the page it is attributed to. Zuko's own 93-million-session
 * dataset shows a FLAT trendline between field count and completion. At four
 * fields a wizard adds taps for nothing.
 *
 * Deliberately NO react-hook-form. Its justification in the plan was per-field
 * `form_field_complete` telemetry, and that was cut — at tens of sessions a week
 * it is data nobody can act on. Plain `useActionState` keeps the form off the
 * critical JS path and re-uses the identical Zod schema on the server.
 *
 * Both required (✱) and (optional) are marked explicitly: Baymard found 32% of
 * users hit a validation error on a required field they had skipped when only
 * optional fields were marked.
 *
 * NOTE: no free-text textarea. HubSpot's data singles out textareas and
 * dropdowns as the field types that actually depress completion — which is also
 * why every choice below is a segmented chip, not a <select>.
 */

const CHIPS = {
  learner: [
    { value: 'myself', label: 'Myself' },
    { value: 'my_child', label: 'My child' },
  ],
  interest: [
    { value: 'carnatic_vocal', label: 'Carnatic vocal' },
    { value: 'not_sure', label: 'Not sure yet' },
  ],
  mode: [
    { value: 'institute', label: 'Jubilee Hills' },
    { value: 'online', label: 'Online' },
    { value: 'community', label: 'My community' },
  ],
  ageBand: [
    { value: 'under_7', label: 'Under 7' },
    { value: '7_12', label: '7–12' },
    { value: '13_17', label: '13–17' },
    { value: 'adult', label: 'Adult' },
  ],
  timezone: [
    { value: 'IST', label: 'India' },
    { value: 'GST', label: 'Gulf' },
    { value: 'GMT', label: 'UK' },
    { value: 'EST', label: 'US East' },
    { value: 'PST', label: 'US West' },
    { value: 'other', label: 'Other' },
  ],
} as const

const initialState: EnquiryState = { ok: false }

function ChipGroup({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  required = true,
}: {
  name: string
  legend: string
  options: readonly { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
  error?: string
  required?: boolean
}) {
  return (
    <fieldset>
      <legend className="mb-3 block font-[var(--font-ui)] text-[length:var(--text-step--1)] font-medium">
        {legend}
        {required ? (
          <span className="text-accent" aria-hidden="true">
            {' '}
            ✱
          </span>
        ) : (
          <span className="text-text-muted"> (optional)</span>
        )}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const selected = value === o.value
          return (
            <label
              key={o.value}
              className={`cursor-pointer select-none border px-4 py-2.5 font-[var(--font-ui)] text-[length:var(--text-step--1)] transition-colors duration-[var(--dur-fast)] ${
                selected
                  ? 'border-accent bg-accent text-on-accent'
                  : 'border-border-strong bg-surface text-text-secondary hover:border-accent'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={selected}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              {o.label}
            </label>
          )
        })}
      </div>
      {error && (
        <p role="alert" className="mt-2 text-[length:var(--text-step--1)] text-accent">
          {error}
        </p>
      )}
    </fieldset>
  )
}

export function EnquiryForm({ whatsappHref }: { whatsappHref: string }) {
  const router = useRouter()
  const [state, action, pending] = useActionState(submitEnquiry, initialState)

  /**
   * Every field is controlled, including the text inputs.
   *
   * React automatically RESETS a <form action={…}> after the action resolves.
   * With uncontrolled inputs that means a single validation error silently
   * wipes the name, phone and community the visitor just typed — they get an
   * error message next to three empty boxes and, realistically, they leave.
   * Holding the values in state is what makes an error recoverable.
   */
  const [contactName, setContactName] = useState('')
  const [phone, setPhone] = useState('')
  const [communityName, setCommunityName] = useState('')
  const [learner, setLearner] = useState('')
  const [interest, setInterest] = useState('')
  const [mode, setMode] = useState('')
  const [ageBand, setAgeBand] = useState('')
  const [timezone, setTimezone] = useState('')
  const [guardianConsent, setGuardianConsent] = useState(false)
  const started = useRef(false)
  // Stamped after mount, not during render: reading the clock while rendering
  // opts the whole page out of static prerender under `cacheComponents`.
  const [renderedAt, setRenderedAt] = useState(0)
  const [attribution, setAttribution] = useState<Record<string, string>>({})

  useEffect(() => {
    setRenderedAt(Date.now())
    track('form_view')
    const a = readAttribution()
    setAttribution(
      Object.fromEntries(
        Object.entries(a).filter(([, v]) => typeof v === 'string'),
      ) as Record<string, string>,
    )
  }, [])

  useEffect(() => {
    if (state.ok && state.leadId) {
      track('form_submit_success', { lead_id: state.leadId })
      router.push('/thank-you')
    }
  }, [state, router])

  const onFirstInput = () => {
    if (started.current) return
    started.current = true
    track('form_start')
  }

  const err = state.errors ?? {}

  return (
    <form
      action={action}
      onInput={onFirstInput}
      noValidate
      className="grid gap-8"
    >
      {/* Honeypot — off-screen, never announced, never focusable. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="websiteUrl">Leave this field empty</label>
        <input
          id="websiteUrl"
          name="websiteUrl"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input type="hidden" name="renderedAt" value={renderedAt} />
      {Object.entries(attribution).map(([k, v]) => (
        <input key={k} type="hidden" name={mapAttrName(k)} value={v} />
      ))}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contactName"
            className="mb-2 block font-[var(--font-ui)] text-[length:var(--text-step--1)] font-medium"
          >
            Your name
            <span className="text-accent" aria-hidden="true">
              {' '}
              ✱
            </span>
          </label>
          <input
            id="contactName"
            name="contactName"
            type="text"
            required
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            autoComplete="name"
            autoCapitalize="words"
            aria-invalid={!!err.contactName}
            aria-describedby={err.contactName ? 'err-contactName' : undefined}
            className="w-full border border-border-strong bg-surface px-4 py-3 text-[length:var(--text-step-0)] outline-none focus:border-accent"
          />
          {err.contactName && (
            <p
              id="err-contactName"
              role="alert"
              className="mt-2 text-[length:var(--text-step--1)] text-accent"
            >
              {err.contactName}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-2 block font-[var(--font-ui)] text-[length:var(--text-step--1)] font-medium"
          >
            WhatsApp number
            <span className="text-accent" aria-hidden="true">
              {' '}
              ✱
            </span>
          </label>
          <div className="flex">
            <span className="flex items-center border border-r-0 border-border-strong bg-bg px-3 font-[var(--font-ui)] text-[length:var(--text-step--1)] text-text-muted">
              +91
            </span>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="numeric"
              autoComplete="tel"
              maxLength={12}
              aria-invalid={!!err.phone}
              aria-describedby="hint-phone"
              className="w-full border border-border-strong bg-surface px-4 py-3 text-[length:var(--text-step-0)] outline-none focus:border-accent"
            />
          </div>
          <p
            id="hint-phone"
            className={`mt-2 text-[length:var(--text-step--1)] ${err.phone ? 'text-accent' : 'text-text-muted'}`}
            role={err.phone ? 'alert' : undefined}
          >
            {err.phone ?? 'We’ll message you, not spam you.'}
          </p>
        </div>
      </div>

      <ChipGroup
        name="learner"
        legend="Who is learning?"
        options={CHIPS.learner}
        value={learner}
        onChange={setLearner}
        error={err.learner}
      />

      <ChipGroup
        name="interest"
        legend="What would you like to learn?"
        options={CHIPS.interest}
        value={interest}
        onChange={setInterest}
        error={err.interest}
      />

      <ChipGroup
        name="mode"
        legend="Where would you like to learn?"
        options={CHIPS.mode}
        value={mode}
        onChange={(v) => {
          setMode(v)
          track('delivery_mode_select', { mode: v })
        }}
        error={err.mode}
      />

      <ChipGroup
        name="ageBand"
        legend="Age of the learner"
        options={CHIPS.ageBand}
        value={ageBand}
        onChange={setAgeBand}
        error={err.ageBand}
      />

      {/* Conditional reveals — the form never looks longer than it needs to. */}
      {mode === 'community' && (
        <div>
          <label
            htmlFor="communityName"
            className="mb-2 block font-[var(--font-ui)] text-[length:var(--text-step--1)] font-medium"
          >
            Which community or apartment complex?
            <span className="text-accent" aria-hidden="true">
              {' '}
              ✱
            </span>
          </label>
          <input
            id="communityName"
            name="communityName"
            type="text"
            value={communityName}
            onChange={(e) => setCommunityName(e.target.value)}
            aria-invalid={!!err.communityName}
            className="w-full border border-border-strong bg-surface px-4 py-3 text-[length:var(--text-step-0)] outline-none focus:border-accent"
          />
          {err.communityName && (
            <p role="alert" className="mt-2 text-[length:var(--text-step--1)] text-accent">
              {err.communityName}
            </p>
          )}
        </div>
      )}

      {mode === 'online' && (
        <ChipGroup
          name="timezone"
          legend="Your time zone"
          options={CHIPS.timezone}
          value={timezone}
          onChange={setTimezone}
          error={err.timezone}
        />
      )}

      {/* DPDP: a child is anyone under 18. We never collect the child's name or
          date of birth here — only the adult's identity plus this confirmation. */}
      {learner === 'my_child' && (
        <div>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="guardianConsent"
              checked={guardianConsent}
              onChange={(e) => setGuardianConsent(e.target.checked)}
              className="mt-1 size-5 shrink-0 accent-[var(--color-accent)]"
            />
            <span className="text-[length:var(--text-step--1)] text-text-secondary">
              I am the parent or guardian of the learner and I consent to Raaga
              contacting me about classes.
              <span className="text-accent" aria-hidden="true">
                {' '}
                ✱
              </span>
            </span>
          </label>
          {err.guardianConsent && (
            <p role="alert" className="mt-2 text-[length:var(--text-step--1)] text-accent">
              {err.guardianConsent}
            </p>
          )}
        </div>
      )}

      {state.message && !state.ok && (
        <p role="alert" className="border border-accent bg-surface px-4 py-3 text-accent">
          {state.message}
        </p>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" disabled={pending}>
          {pending ? 'Sending…' : 'Book a free trial class'}
        </Button>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('whatsapp_click', { cta_location: 'form' })}
          className="inline-flex items-center gap-2 font-[var(--font-ui)] text-[length:var(--text-step--1)] text-accent underline underline-offset-4"
        >
          <WhatsAppIcon />
          Or just ask on WhatsApp
        </a>
      </div>

      <p className="text-[length:var(--text-step--1)] text-text-muted">
        Free first class. No fees, no commitment. We’ll call you within one
        working day — usually the same evening.
      </p>
    </form>
  )
}

function mapAttrName(k: string): string {
  const map: Record<string, string> = {
    utm_source: 'utmSource',
    utm_medium: 'utmMedium',
    utm_campaign: 'utmCampaign',
    community: 'community',
    referrer: 'referrer',
  }
  return map[k] ?? k
}
