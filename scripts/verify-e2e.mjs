/**
 * End-to-end verification against a running dev server.
 *
 * Covers the things unit tests cannot: that the conditional fields actually
 * reveal, that a child enquiry cannot be submitted without guardian consent,
 * that a lead reaches storage, and that WhatsApp-forward attribution survives
 * the round trip.
 *
 * Run:  npm run dev   (in one shell)
 *       npm run test:e2e
 */
import { chromium } from 'playwright'
import { readFileSync, existsSync, rmSync } from 'node:fs'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const LEADS = '.leads/leads.jsonl'
if (existsSync(LEADS)) rmSync(LEADS)

let pass = 0
let fail = 0
const check = (name, ok, detail = '') => {
  ok ? pass++ : fail++
  console.log(`  ${ok ? '✓' : '✗'} ${name}${ok ? '' : `   ← ${detail}`}`)
}

const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 360, height: 800 } })
const jsErrors = []
p.on('pageerror', (e) => jsErrors.push(e.message))

console.log('\n  End-to-end\n')

// Arrive as a WhatsApp forward into a gated-community group.
await p.goto(`${BASE}/contact?utm_source=whatsapp&utm_medium=community&g=my-home-bhooja`, {
  waitUntil: 'networkidle',
})
await p.waitForTimeout(1600) // clear the bot time-trap

await p.fill('#contactName', 'Anitha Raghavan')
await p.fill('#phone', '9848012345')
await p.getByText('My child', { exact: true }).click()
await p.getByText('Carnatic vocal', { exact: true }).click()
await p.getByText('My community', { exact: true }).click()
await p.getByText('7–12', { exact: true }).click()

check('community field reveals for community mode', !!(await p.$('#communityName')))
check('guardian consent appears for a child', !!(await p.$('input[name="guardianConsent"]')))
await p.fill('#communityName', 'My Home Bhooja')

// A child enquiry without guardian consent must be refused.
await p.click('button[type="submit"]')
await p.waitForTimeout(1200)
const blocked =
  !p.url().includes('thank-you') &&
  (await p.locator('text=Please confirm you are the parent or guardian').count()) > 0
check('child enquiry blocked without guardian consent', blocked, p.url())

// Now consent and submit properly.
await p.check('input[name="guardianConsent"]')
await p.click('button[type="submit"]')
await p.waitForURL('**/thank-you', { timeout: 10000 }).catch(() => {})
check('redirects to /thank-you on success', p.url().includes('thank-you'), p.url())

/**
 * Read the lead back from wherever it was actually written — Atlas when
 * MONGODB_URI is configured, the local JSONL fallback otherwise. Checking only
 * the file would quietly pass while the real production write path was broken.
 */
async function readBackLead() {
  const env = existsSync('.env.local')
    ? Object.fromEntries(
        readFileSync('.env.local', 'utf8')
          .split('\n')
          .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
          .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]),
      )
    : {}
  const uri = process.env.MONGODB_URI ?? env.MONGODB_URI

  if (uri) {
    const { MongoClient } = await import('mongodb')
    const c = new MongoClient(uri, { serverSelectionTimeoutMS: 12000 })
    try {
      await c.connect()
      const doc = await c
        .db(process.env.MONGODB_DB ?? env.MONGODB_DB ?? 'raaga')
        .collection('leads')
        .findOne({}, { sort: { submittedAt: -1 } })
      console.log('    (read back from MongoDB Atlas)')
      return doc
    } finally {
      await c.close()
    }
  }

  console.log('    (read back from local .leads/leads.jsonl)')
  return existsSync(LEADS)
    ? JSON.parse(readFileSync(LEADS, 'utf8').trim().split('\n').pop())
    : null
}

const lead = await readBackLead()

check('lead reached storage', !!lead)
if (lead) {
  check('parent name stored, not child name', lead.contactName === 'Anitha Raghavan')
  check('guardian consent recorded', lead.guardianConsent === true)
  check('WhatsApp attribution survived', lead.utmSource === 'whatsapp' && lead.community === 'my-home-bhooja')
  check('community name captured', lead.communityName === 'My Home Bhooja')
  check('retention clock set (DPDP erasure)', !!lead.retentionUntil)
  const banned = ['learnerName', 'childName', 'dob', 'dateOfBirth']
  check('no child-identity field stored', !banned.some((k) => k in lead), Object.keys(lead).join(','))
}

check('no JS errors on the page', jsErrors.length === 0, jsErrors.join(' | '))

await b.close()
console.log(`\n  ${pass} passed, ${fail} failed\n`)
process.exit(fail ? 1 : 0)
