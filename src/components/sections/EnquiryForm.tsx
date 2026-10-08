'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitEnquiry, type EnquiryState } from '@/app/actions/enquiry'
import { Button, WhatsAppIcon } from '@/components/ui/Button'
import { readAttribution, track } from '@/lib/analytics'
import { CHIPS, ChipGroup } from '@/components/sections/ChipGroup'

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
 * Marking convention: every field in the main path is required, and the form
 * states that once at the top. Marking each of five with a red asterisk marks
 * nothing — Baymard's finding is to mark the MINORITY case, which here is the
 * optional block, and those are labelled individually.
 *
 * NOTE: free text is limited to ONE optional message box at the very end, after
 * the required path. HubSpot's data singles out textareas and dropdowns as the
 * field types that actually depress completion, so the required fields use none
 * of them — which is also why every choice is a segmented chip (see ChipGroup),
 * not a <select>.
 */

const initialState: EnquiryState = { ok: false }

export function EnquiryForm({ whatsappHref }: { whatsappHref: string }) {
  const router = useRouter()
  const [state, action, pending] = useActionState(submitEnquiry, initialState)

  /**
   * Every field is controlled, including the text inputs.
   *
   * React automatically RESETS a <form action={…}> after the action resolves.
   * With uncontrolled inputs that means a single validation error silently
   * wipes the name and phone the visitor just typed — they get an
   * error message next to three empty boxes and, realistically, they leave.
   * Holding the values in state is what makes an error recoverable.
   */
  const [contactName, setContactName] = useState('')
  const [phone, setPhone] = useState('')
  const [learner, setLearner] = useState('')
  const [mode, setMode] = useState('')
  const [ageBand, setAgeBand] = useState('')
  const [timezone, setTimezone] = useState('')
  const [guardianConsent, setGuardianConsent] = useState(false)
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [learningMode, setLearningMode] = useState('')
  const [experience, setExperience] = useState('')
  const [preferredTime, setPreferredTime] = useState('')
  const started = useRef(false)

  /**
   * The bot time-trap stamp and the UTM attribution are written straight into
   * UNCONTROLLED hidden inputs via refs.
   *
   * They cannot be read during render — `Date.now()` and `location.search` on
   * the client would both mismatch the prerendered HTML, and reading the clock
   * while rendering opts the page out of static prerender under
   * `cacheComponents`. But holding them in state instead meant a setState in an
   * effect on every mount, which cascades a second render of the whole form for
   * values no human ever sees. Refs give the correct timing with no re-render
   * at all.
   */
  /**
   * Attribution and the bot time-trap stamp, held in React state.
   *
   * They cannot be read during render: `Date.now()` and `location.search` would
   * both mismatch the prerendered HTML, and reading the clock while rendering
   * opts the page out of static prerender under `cacheComponents`. So they are
   * captured in an effect after mount.
   *
   * This deliberately keeps them CONTROLLED. An earlier version wrote them into
   * uncontrolled hidden inputs via a ref to avoid the setState-in-effect lint
   * rule — which silently broke attribution, because React re-applies
   * `defaultValue` on re-render and every keystroke in the form wiped all five
   * fields back to empty. The lead still saved; it just arrived with no UTM
   * data and no time-trap stamp, invisibly. Correctness wins over the rule
   * here, and the cost is one extra render on mount for a form that is already
   * interactive.
   */
  const [renderedAt, setRenderedAt] = useState(0)
  const [attribution, setAttribution] = useState<Record<string, string>>({})

  /* eslint-disable react-hooks/set-state-in-effect -- see the note above:
     these values are unreadable during render without a hydration mismatch,
     and the uncontrolled alternative loses them on every keystroke. */
  useEffect(() => {
    setRenderedAt(Date.now())
    const a = readAttribution() as Record<string, unknown>
    const str = (v: unknown) => (typeof v === 'string' ? v : '')
    setAttribution({
      utmSource: str(a.utm_source),
      utmMedium: str(a.utm_medium),
      utmCampaign: str(a.utm_campaign),
    })
    track('form_view')
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

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
    <form action={action} onInput={onFirstInput} noValidate className="grid gap-9">
      <p className="t-small text-fg-3">Everything below is needed unless it says optional.</p>
      {/* Honeypot: off-screen, never announced, never focusable. */}
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
      {Object.entries(attribution).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}

      {/* Single column. Side-by-side fields make the eye zigzag and are
          the most-cited layout cause of skipped fields; nothing here is short
          enough to earn a pair. */}
      <div className="grid gap-6">
        <div>
          <label htmlFor="contactName" className="field-label">
            {learner === 'my_child' ? 'Parent or guardian’s name' : 'Your name'}
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
            className="field"
          />
          {err.contactName && (
            <p id="err-contactName" role="alert" className="field-error">
              {err.contactName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="field-label">
            WhatsApp number
          </label>
          {/* One bordered control, not two boxes shoved together: the +91
              reads as part of the field rather than as a label that lost its
              input. */}
          <div className="field-group">
            <span className="field-prefix">+91</span>
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
              className="field-bare"
            />
          </div>
          <p
            id="hint-phone"
            className={err.phone ? 'field-error' : 'field-hint'}
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

      {/* Conditional reveal: the form never looks longer than it needs to. */}
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
          date of birth here, only the adult's identity plus this confirmation.
          The checkbox stays a native, visible control. */}
      {learner === 'my_child' && (
        <div className="border-l-2 border-mark pl-5">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="guardianConsent"
              checked={guardianConsent}
              onChange={(e) => setGuardianConsent(e.target.checked)}
              className="mt-0.5 size-5 shrink-0 accent-[var(--color-accent)]"
            />
            <span className="t-small text-fg-2">
              I am the parent or guardian of the learner and I consent to RAAGA
              contacting me about classes.
            </span>
          </label>
          {err.guardianConsent && (
            <p role="alert" className="field-error">
              {err.guardianConsent}
            </p>
          )}
        </div>
      )}

      {/* The client's content master asks for Email, City, Preferred Learning
          Mode, Experience Level and Preferred Time. All five are here and all
          five are optional, behind a disclosure.

          Their list runs to eleven fields. Baymard and HubSpot both find
          completion falls as field count rises, and the four that actually
          route a lead are already above. Native <details> keeps the short path
          short at zero JS, and anyone who wants to tell us more can. */}
      <details className="group border-y border-line">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 font-ui text-[length:var(--fs-small)] font-medium text-[var(--btn-ink)] [&::-webkit-details-marker]:hidden">
          <span>
            Tell us more <span className="optional font-normal text-fg-3">(optional)</span>
          </span>
          <span aria-hidden="true" className="relative size-3 text-kicker">
            <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
            <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform duration-[var(--dur-2)] group-open:scale-y-0" />
          </span>
        </summary>

        <div className="grid gap-8 pt-4 pb-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="field-label">
                Email <span className="optional">(optional)</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
                aria-invalid={!!err.email}
                aria-describedby={err.email ? 'err-email' : undefined}
                className="field"
              />
              {err.email && (
                <p id="err-email" role="alert" className="field-error">
                  {err.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="city" className="field-label">
                City <span className="optional">(optional)</span>
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                autoComplete="address-level2"
                className="field"
              />
            </div>
          </div>

          <ChipGroup
            name="experience"
            legend="Experience level"
            options={CHIPS.experience}
            value={experience}
            onChange={setExperience}
            error={err.experience}
            required={false}
          />

          <ChipGroup
            name="learningMode"
            legend="Preferred learning mode"
            options={CHIPS.learningMode}
            value={learningMode}
            onChange={setLearningMode}
            error={err.learningMode}
            required={false}
          />

          <ChipGroup
            name="preferredTime"
            legend="Preferred time"
            options={CHIPS.preferredTime}
            value={preferredTime}
            onChange={setPreferredTime}
            error={err.preferredTime}
            required={false}
          />
        </div>
      </details>

      <div>
        <label htmlFor="message" className="field-label">
          Anything you’d like us to know
          <span className="optional"> (optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          maxLength={600}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={!!err.message}
          aria-describedby={err.message ? 'hint-message err-message' : 'hint-message'}
          className="field resize-y"
        />
        <p id="hint-message" className="field-hint">
          Please don’t include your child’s name.
        </p>
        {err.message && (
          <p id="err-message" role="alert" className="field-error">
            {err.message}
          </p>
        )}
      </div>

      {state.message && !state.ok && (
        <p
          role="alert"
          className="border-l-2 border-[var(--color-accent)] bg-[color-mix(in_srgb,var(--color-accent)_6%,transparent)] px-4 py-3 font-ui text-[length:var(--fs-small)] text-[var(--color-accent)]"
        >
          {state.message}
        </p>
      )}

      <div className="grid gap-5 border-t border-line pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <Button type="submit" disabled={pending} className="sm:min-w-[15rem]">
            {pending ? 'Sending…' : 'Book a trial class'}
          </Button>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('whatsapp_click', { cta_location: 'form' })}
            className="link-arrow self-start sm:self-center"
          >
            <WhatsAppIcon />
            Or just ask on WhatsApp
          </a>
        </div>

        <p className="t-small text-fg-3">
          We’ll call you within one working day, usually the same evening, to
          arrange a trial that suits you.
        </p>
      </div>
    </form>
  )
}
