import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { AiReferralReport } from '../src/components/admin/AiReferralReport'
import { EditorialPlan } from '../src/components/admin/EditorialPlan'
import { summarizeAiReferrals } from '../src/lib/ai-referrals'
import { learningGuides } from '../src/content/seed/learning-guides'

const empty = renderToStaticMarkup(createElement(AiReferralReport, { report: summarizeAiReferrals([]) }))
assert.match(empty, /No recognised AI source was recorded in this period/)
assert.match(empty, /This does not mean RAAGA was absent from AI answers/)
assert.doesNotMatch(empty, /aria-label="AI source breakdown"/)

const populated = renderToStaticMarkup(createElement(AiReferralReport, {
  report: summarizeAiReferrals([
    { referrerHost: 'chatgpt.com', utmSource: 'claude', count: 17 },
    { utmSource: 'perplexity', count: 6 },
    { referrerHost: 'google.com', count: 500 },
  ]),
}))
assert.match(populated, /aria-label="AI source breakdown"/)
assert.match(populated, />17<\/dd>/)
assert.match(populated, />6<\/dd>/)
assert.doesNotMatch(populated, />500<\/dd>/)
assert.match(populated, /AI campaign tag only/)
assert.match(populated, /anyone can set this tag/)
assert.match(populated, /not unique people, search impressions or citation counts/)
assert.match(populated, /Google and Bing referrers/)
assert.match(populated, /<details[\s>]/)
assert.match(populated, /href="\/admin\/growth#editorial-plan"/)

const editorial = renderToStaticMarkup(createElement(EditorialPlan))
assert.match(editorial, /id="editorial-plan"/)
assert.equal((editorial.match(/<details[\s>]/g) ?? []).length, 3)
assert.match(editorial, /These contributions are not published/)
assert.match(editorial, /not a saved progress tracker/)
assert.match(editorial, /recorded guardian consent/)
assert.doesNotMatch(editorial, /<form[\s>]|<input[\s>]/)
const validLinks = new Set([
  '/getting-started', '/learning', '/carnatic-music-classes/beginners',
  ...learningGuides.map(guide => `/guides/${guide.slug}`),
])
const links = [...editorial.matchAll(/href="([^"]+)"/g)].map(match => match[1])
assert.equal(links.length, 6)
for (const href of links) {
  const url = new URL(href)
  assert.equal(url.origin, 'https://theraaga.in', 'Public guides must leave the private admin host')
  assert.ok(validLinks.has(url.pathname), `Unknown editorial reading link: ${href}`)
}
assert.doesNotMatch(populated + editorial, /[\u2013\u2014]/)
assert.doesNotMatch(populated + editorial, /<script[\s>]/)

console.log('Admin discovery rendering passed: empty and populated counts, measurement limits, editorial links and unpublished preparation state.')
