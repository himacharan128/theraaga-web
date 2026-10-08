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
      <legend className="field-label mb-3">
        {legend}
        {!required && <span className="optional"> (optional)</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const selected = value === o.value
          return (
            /* The radio is sr-only, so the label carries the keyboard ring
               (`.chip:has(:focus-visible)`); without it a keyboard user could
               tab through these chips with nothing on screen moving. */
            <label key={o.value} className="chip" data-selected={selected}>
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
        <p role="alert" className="field-error">
          {error}
        </p>
      )}
    </fieldset>
  )
}
