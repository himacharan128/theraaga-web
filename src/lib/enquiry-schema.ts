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
 */

export const INTERESTS = ['carnatic_vocal', 'not_sure'] as const
export const MODES = ['institute', 'online', 'community'] as const
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
    interest: z.enum(INTERESTS, { message: 'Please choose what you’d like to learn.' }),
    mode: z.enum(MODES, { message: 'Please choose where you’d like to learn.' }),
    ageBand: z.enum(AGE_BANDS, { message: 'Please choose an age range.' }),

    // Conditional — only meaningful for their own branch.
    communityName: z.string().trim().max(80).optional().or(z.literal('')),
    timezone: z.enum(TIMEZONES).optional(),

    guardianConsent: z.boolean().optional(),

    // Honeypot: real humans never see this, so any value at all is a bot.
    websiteUrl: z.string().max(0, 'Rejected.').optional().or(z.literal('')),

    // Attribution, carried silently. Free to collect now, impossible to backfill.
    utmSource: z.string().max(80).optional(),
    utmMedium: z.string().max(80).optional(),
    utmCampaign: z.string().max(80).optional(),
    community: z.string().max(80).optional(),
    referrer: z.string().max(300).optional(),
    renderedAt: z.coerce.number().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.mode === 'community' && !val.communityName) {
      ctx.addIssue({
        code: 'custom',
        path: ['communityName'],
        message: 'Which community or apartment complex?',
      })
    }
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
  communityName: 'Which community?',
  timezone: 'Your time zone',
  guardianConsent: 'Parent or guardian confirmation',
}
