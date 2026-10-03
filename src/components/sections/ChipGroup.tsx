import { centres } from '@/content/seed/site'

/**
 * The segmented-chip radio group and its option sets, shared by the enquiry
 * form. Every choice in the form is a chip rather than a <select>; see the note
 * in EnquiryForm for why.
 */

export const CHIPS = {
  learner: [
    { value: 'myself', label: 'Myself' },
    { value: 'my_child', label: 'My child' },
  ],
  // Derived from the centres data, so the card a visitor tapped and the option
  // they then pick can never drift apart.
  mode: centres.map((c) => ({ value: c.key, label: c.formLabel })),
  ageBand: [
    { value: 'under_7', label: 'Under 7' },
    { value: '7_12', label: '7–12' },
    { value: '13_17', label: '13–17' },
    { value: 'adult', label: 'Adult' },
  ],
  learningMode: [
    { value: 'individual', label: 'One-to-one' },
    { value: 'group', label: 'Small group' },
    { value: 'either', label: 'Either' },
  ],
  experience: [
    { value: 'beginner', label: 'Complete beginner' },
    { value: 'some_training', label: 'Some training' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ],
  preferredTime: [
    { value: 'weekday_morning', label: 'Weekday mornings' },
    { value: 'weekday_evening', label: 'Weekday evenings' },
    { value: 'weekend_morning', label: 'Weekend mornings' },
    { value: 'weekend_evening', label: 'Weekend evenings' },
    { value: 'flexible', label: 'Flexible' },
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

export function ChipGroup({
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
      {/* No asterisk. Every field in the main path is required and the form
          says so once, at the top; five red stars down one column is noise
          that marks nothing. Only the exceptions are marked. */}
      <legend className="mb-3 block font-[var(--font-ui)] text-[length:var(--text-step--1)] font-medium">
        {legend}
        {!required && <span className="text-text-muted"> (optional)</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const selected = value === o.value
          return (
            <label
              key={o.value}
              /* The radio is sr-only, so without has-[:focus-visible] a
                 keyboard user could tab through these chips with nothing on
                 screen moving — the control was operable but invisible. */
              className={`flex min-h-11 cursor-pointer select-none items-center rounded-[var(--radius-sm)] border px-4 font-[var(--font-ui)] text-[length:var(--text-step--1)] transition-colors duration-[var(--dur-fast)] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
                selected
                  ? 'border-accent bg-accent text-on-accent'
                  : 'border-border-strong bg-bg text-text-secondary hover:border-accent hover:bg-[color-mix(in_srgb,var(--color-accent)_5%,transparent)]'
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
