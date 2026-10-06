import assert from 'node:assert/strict'
import { summarizeAiReferrals, type AiReferralSourceRow } from '../src/lib/ai-referrals'

const empty = { referrerPageViews: 0, taggedPageViews: 0, providers: [] }
assert.deepEqual(summarizeAiReferrals([]), empty)

const knownHosts = [
  ['chatgpt.com', 'ChatGPT'],
  ['chat.openai.com', 'ChatGPT'],
  ['claude.ai', 'Claude'],
  ['perplexity.ai', 'Perplexity'],
  ['gemini.google.com', 'Gemini'],
  ['copilot.microsoft.com', 'Copilot'],
] as const

for (const [host, label] of knownHosts) {
  for (const referrerHost of [host, `www.${host}`, `app.eu.${host}`, ` ${host.toUpperCase()} `]) {
    assert.deepEqual(summarizeAiReferrals([{ referrerHost, count: 3 }]), {
      referrerPageViews: 3,
      taggedPageViews: 0,
      providers: [{ label, referrerPageViews: 3, taggedPageViews: 0 }],
    }, `Recognise the actual ${host} host and its subdomains`)
  }
}

const rejectedHosts: Array<string | null | undefined> = [
  undefined, null, '', 'direct', 'google.com', 'www.google.com', 'bing.com',
  'www.bing.com', 'microsoft.com', 'openai.com', 'chatgpt.com.attacker.example',
  'notchatgpt.com', 'fakeclaude.ai', 'gemini.google.com.attacker.example',
  'copilot.microsoft.com.attacker.example', 'https://chatgpt.com',
  'chatgpt.com/path', 'chatgpt.com?source=test', 'chatgpt.com#fragment',
  'chatgpt.com:443', 'user@chatgpt.com', '.chatgpt.com', 'a..chatgpt.com',
  '-invalid.chatgpt.com', 'invalid-.chatgpt.com', 'bad_host.chatgpt.com',
  'space here.chatgpt.com', 'chatgpt.com.', `${'a'.repeat(64)}.chatgpt.com`,
  `${'long.'.repeat(60)}chatgpt.com`,
]
assert.deepEqual(summarizeAiReferrals(rejectedHosts.map((referrerHost) => ({ referrerHost, count: 5 }))), empty)

const knownTags = [
  ['chatgpt', 'ChatGPT'], ['chatgpt.com', 'ChatGPT'], ['chat.openai.com', 'ChatGPT'],
  ['claude', 'Claude'], ['claude.ai', 'Claude'],
  ['perplexity', 'Perplexity'], ['perplexity.ai', 'Perplexity'],
  ['gemini', 'Gemini'], ['gemini.google.com', 'Gemini'],
  ['copilot', 'Copilot'], ['copilot.microsoft.com', 'Copilot'],
] as const
for (const [utmSource, label] of knownTags) {
  assert.deepEqual(summarizeAiReferrals([{ utmSource: ` ${utmSource.toUpperCase()} `, count: 2 }]), {
    referrerPageViews: 0,
    taggedPageViews: 2,
    providers: [{ label, referrerPageViews: 0, taggedPageViews: 2 }],
  }, `Keep ${utmSource} campaign labels separate from referrers`)
}
assert.deepEqual(summarizeAiReferrals([
  'google', 'bing', 'ai', 'chatgpt_campaign', 'https://chatgpt.com',
  'www.chatgpt.com', 'chatgpt.com/path', 'claude.ai.attacker.example',
].map((utmSource) => ({ utmSource, count: 4 }))), empty)

const overlapping: readonly AiReferralSourceRow[] = Object.freeze([
  Object.freeze({ referrerHost: 'chatgpt.com', utmSource: 'chatgpt', count: 7 }),
  Object.freeze({ referrerHost: 'chatgpt.com', utmSource: 'claude', count: 5 }),
  Object.freeze({ referrerHost: 'google.com', utmSource: 'claude', count: 3 }),
  Object.freeze({ referrerHost: 'newsletter.example', utmSource: 'claude.ai', count: 2 }),
])
assert.deepEqual(summarizeAiReferrals(overlapping), {
  referrerPageViews: 12,
  taggedPageViews: 5,
  providers: [
    { label: 'ChatGPT', referrerPageViews: 12, taggedPageViews: 0 },
    { label: 'Claude', referrerPageViews: 0, taggedPageViews: 5 },
  ],
}, 'A recognised referrer wins over matching or conflicting tags, with no double counting')

assert.deepEqual(summarizeAiReferrals([0, -1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY].map((count) => ({
  referrerHost: 'chatgpt.com', utmSource: 'claude', count,
}))), empty)

assert.deepEqual(summarizeAiReferrals([
  { referrerHost: 'perplexity.ai', count: 4 },
  { referrerHost: 'claude.ai', count: 2 },
  { utmSource: 'claude', count: 2 },
  { referrerHost: 'chatgpt.com', count: 1 },
  { utmSource: 'copilot', count: 6 },
]).providers.map(({ label }) => label), ['Copilot', 'Claude', 'Perplexity', 'ChatGPT'], 'Sort by combined count, then provider name')

assert.equal(summarizeAiReferrals([
  ...Array.from({ length: 20 }, (_, index) => ({ referrerHost: `source${index}.example`, count: 500 })),
  { referrerHost: 'chatgpt.com', count: 1 },
]).referrerPageViews, 1, 'Do not discard AI rows after popular non-AI sources')

console.log('AI referral checks passed: known hosts, exact campaign aliases, malformed sources, count validation and no double counting.')
