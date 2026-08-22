import { z } from 'zod'

/**
 * ONE schema, parsed twice — in the browser for field-level errors, and again
 * inside the Server Action, which is the only parse that is trusted.
 *
 * DPDP NOTE — read before adding a field.
 * A "child" under the DPDP Act 2023 is anyone under 18, and children's-data
 * failures reach ₹200 crore. The Fourth Schedule exemption for educational
 * institutions covers processing for *enrolled students*, not a public
 * marketing form. So:
 *
 *   · The field is `contactName`, NOT `learnerName`. We collect the adult's
 *     name. Never the child's.
 *   · Age is a coarse BAND, never a date of birth.
 *   · When the learner is a child, an explicit guardian confirmation is
 *     required — that is what `guardianConsent` is for.
 *   · Child identity is deferred to enrolment, where verification can be done
 *     properly.
 *
 * DIVERGENCE FROM THE CLIENT'S FIELD LIST — read before "fixing" this.
 * Their content master asks for "Student Name" and "Age" as separate fields
 * alongside "Parent/Guardian". We collect neither when the learner is a child.
 * `contactName` relabels itself to "Parent or guardian's name" in that branch,
 * and `ageBand` is a coarse band rather than a number. For an adult learner the
 * name IS the student's name, so nothing is lost there.
 *
 * This is not a stylistic preference. Under the DPDP Act 2023 a child is anyone
 * under 18, the Fourth Schedule exemption covers enrolled students rather than a
 * public marketing form, and children's-data failures reach ₹200 crore. If the
 * client insists, the answer is to collect it at ENROLMENT with verifiable
 * parental consent — not on an open web form.
 */

export const INTERESTS = ['carnatic_vocal', 'not_sure'] as const
export const LEARNING_MODES = ['individual', 'group', 'either'] as const
export const EXPERIENCE = ['beginner', 'some_training', 'intermediate', 'advanced'] as const
export const PREFERRED_TIMES = [
  'weekday_morning',
  'weekday_evening',
  'weekend_morning',
  'weekend_evening',
  'flexible',
] as const
export const MODES = ['jubilee-hills', 'phoenix-arena', 'online', 'community'] as const
export const LEARNERS = ['myself', 'my_child'] as const
export const AGE_BANDS = ['under_7', '7_12', '13_17', 'adult'] as const
export const TIMEZONES = ['IST', 'GST', 'GMT', 'EST', 'PST', 'other'] as const

export const enquirySchema = z
  .object({
    contactName: z
      .string()
      .trim()
      .min(2, 'Please enter your name.')
      .max(40, 'That name is a little too long.')
      .regex(/^[\p{L}\s.'-]+$/u, 'Letters, spaces and full stops only.'),

    // The only identifier we truly need. Indian mobile numbers start 6–9.
    phone: z
      .string()
      .trim()
      .transform((v) => v.replace(/[\s-]/g, ''))
      .pipe(
        z
          .string()
          .regex(/^[6-9]\d{9}$/, 'Please enter a 10-digit Indian mobile number.'),
      ),

    learner: z.enum(LEARNERS, { message: 'Please tell us who is learning.' }),
    /**
     * Optional, and no longer on the form. RAAGA teaches one discipline, so
     * asking which one is a required decision the site has already answered.
     * The field stays in the schema for when other disciplines are added.
     */
    interest: z.enum(INTERESTS).optional(),
    mode: z.enum(MODES, { message: 'Please choose where you’d like to learn.' }),
    ageBand: z.enum(AGE_BANDS, { message: 'Please choose an age range.' }),

    // Conditional — only meaningful for its own branch.
    timezone: z.enum(TIMEZONES).optional(),

    /**
     * The client's content master asks for Email, City, Preferred Learning
     * Mode, Experience Level and Preferred Time. All five are OPTIONAL.
     *
     * Their list runs to eleven fields; Baymard and HubSpot both find
     * completion falls with field count, and the four that actually route a
     * lead are name, phone, centre and age band. Making the rest optional
     * gives the school every field it asked for without making any of them a
     * barrier between a parent and the send button.
     */
    email: z.string().trim().max(120).email('Please check this email address.').optional().or(z.literal('')),
    city: z.string().trim().max(60).optional().or(z.literal('')),
    learningMode: z.enum(LEARNING_MODES).optional(),
    experience: z.enum(EXPERIENCE).optional(),
    preferredTime: z.enum(PREFERRED_TIMES).optional(),

    // Optional free text. Deliberately the LAST field and never required:
    // HubSpot's data singles out textareas as the field type that most
    // depresses completion, so it must never stand between a visitor and the
    // submit button.
    message: z.string().trim().max(600, 'Please keep this under 600 characters.').optional().or(z.literal('')),

    guardianConsent: z.boolean().optional(),

    // Honeypot: real humans never see this, so any value at all is a bot.
    websiteUrl: z.string().max(0, 'Rejected.').optional().or(z.literal('')),

    // Attribution, carried silently. Free to collect now, impossible to backfill.
    utmSource: z.string().max(80).optional(),
    utmMedium: z.string().max(80).optional(),
    utmCampaign: z.string().max(80).optional(),
    referrer: z.string().max(300).optional(),
    renderedAt: z.coerce.number().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.mode === 'online' && !val.timezone) {
      ctx.addIssue({
        code: 'custom',
        path: ['timezone'],
        message: 'Please choose your time zone.',
      })
    }
    // Guardian confirmation is required whenever the learner is a minor.
    if (val.learner === 'my_child' && val.guardianConsent !== true) {
      ctx.addIssue({
        code: 'custom',
        path: ['guardianConsent'],
        message: 'Please confirm you are the parent or guardian.',
      })
    }
  })

export type EnquiryInput = z.infer<typeof enquirySchema>

export const FIELD_LABELS: Record<string, string> = {
  contactName: 'Your name',
  phone: 'WhatsApp number',
  learner: 'Who is learning?',
  interest: 'What would you like to learn?',
  mode: 'Where would you like to learn?',
  ageBand: 'Age of the learner',
  timezone: 'Your time zone',
  email: 'Email',
  city: 'City',
  learningMode: 'Preferred learning mode',
  experience: 'Experience level',
  preferredTime: 'Preferred time',
  message: 'Anything you’d like us to know',
  guardianConsent: 'Parent or guardian confirmation',
}
