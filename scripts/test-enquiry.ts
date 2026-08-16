/**
 * Validation contract for the enquiry form.
 *
 * The DPDP-relevant rules are the ones worth guarding: a child enquiry must
 * carry an explicit guardian confirmation, and the schema must never grow a
 * field that collects a child's name or date of birth.
 *
 * Run: npx tsx scripts/test-enquiry.ts
 */

import { readFileSync } from 'node:fs'
import { enquirySchema } from '../src/lib/enquiry-schema'

const base = {
  contactName: 'Anitha R',
  phone: '9848012345',
  learner: 'myself',
  interest: 'carnatic_vocal',
  mode: 'jubilee-hills',
  ageBand: 'adult',
}

const cases: [string, Record<string, unknown>, boolean][] = [
  ['valid adult enquiry', base, true],
  [
    'valid child + guardian consent',
    {
      ...base,
      learner: 'my_child',
      ageBand: '7_12',
      mode: 'phoenix-arena',
      guardianConsent: true,
    },
    true,
  ],
  ['child WITHOUT guardian consent', { ...base, learner: 'my_child', ageBand: '7_12' }, false],
  ['phoenix arena centre', { ...base, mode: 'phoenix-arena' }, true],
  ['unknown mode rejected', { ...base, mode: 'clubhouse' }, false],
  ['online mode, no timezone', { ...base, mode: 'online' }, false],
  ['online mode with timezone', { ...base, mode: 'online', timezone: 'EST' }, true],
  ['bad phone (starts with 5)', { ...base, phone: '5876543210' }, false],
  ['phone with spaces is normalised', { ...base, phone: '98480 12345' }, true],
  ['name too short', { ...base, contactName: 'A' }, false],
  ['name with digits', { ...base, contactName: 'Ravi 123' }, false],
  ['honeypot filled → rejected', { ...base, websiteUrl: 'http://spam.example' }, false],
  ['optional message accepted', { ...base, message: 'My daughter is 8 and has never sung before.' }, true],
  ['over-long message rejected', { ...base, message: 'x'.repeat(601) }, false],
]

let pass = 0
let fail = 0

console.log('\n  Enquiry validation\n')

for (const [name, input, shouldPass] of cases) {
  const r = enquirySchema.safeParse(input)
  const ok = r.success === shouldPass
  if (ok) pass++
  else fail++
  console.log(
    `  ${ok ? '✓' : '✗'} ${name.padEnd(36)} ${r.success ? 'accepted' : 'rejected'}${ok ? '' : '   ← UNEXPECTED'}`,
  )
  if (!ok && !r.success) {
    console.log(
      `      ${r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`,
    )
  }
}

// Guard: the schema must never learn to collect a child's identity.
const banned = ['learnerName', 'childName', 'dob', 'dateOfBirth', 'studentName']
const schemaSource = readFileSync(
  new URL('../src/lib/enquiry-schema.ts', import.meta.url),
  'utf8',
)
const leaked = banned.filter((f) => new RegExp(`^\\s*${f}\\s*:`, 'm').test(schemaSource))

console.log('\n  DPDP guard — child identity fields\n')
if (leaked.length) {
  fail++
  console.log(`  ✗ schema collects child identity: ${leaked.join(', ')}`)
} else {
  console.log('  ✓ no child-identity fields present')
}

console.log(`\n  ${pass} passed, ${fail} failed\n`)
process.exit(fail ? 1 : 0)
