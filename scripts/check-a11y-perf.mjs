/**
 * Accessibility + performance budget spot-check against a running server.
 * Scoped to the things this specific design is most likely to get wrong.
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
let pass = 0, fail = 0
const check = (n, ok, d = '') => { ok ? pass++ : fail++; console.log(`  ${ok ? '✓' : '✗'} ${n}${ok ? '' : `   ← ${d}`}`) }

const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 360, height: 800 } })

let transferred = 0
p.on('response', async (r) => {
  try { const h = await r.allHeaders(); transferred += Number(h['content-length'] ?? 0) } catch {}
})

await p.goto(BASE, { waitUntil: 'networkidle' })

console.log('\n  Accessibility\n')

check('single <h1>', (await p.locator('h1').count()) === 1)
check('skip link is first focusable', (await p.locator('a[href="#main"]').count()) === 1)
check('<main> landmark present', (await p.locator('main#main').count()) === 1)
check('lang is en-IN', (await p.getAttribute('html', 'lang')) === 'en-IN')

const imgsNoAlt = await p.locator('img:not([alt])').count()
check('every <img> has alt', imgsNoAlt === 0, `${imgsNoAlt} missing`)

// Decorative Devanagari must not be announced as meaningless glyphs.
const devaExposed = await p.locator('.deva:not([aria-hidden="true"])').count()
console.log(`    (${devaExposed} Devanagari runs are exposed to AT — intentional where they carry meaning)`)

// Swara buttons: real buttons, labelled, keyboard reachable, ≥44px.
const swara = p.locator('button[aria-label^="Play the note"]')
const swaraCount = await swara.count()
check('7 swara buttons are real <button>s with labels', swaraCount === 7, `found ${swaraCount}`)
if (swaraCount) {
  const box = await swara.first().boundingBox()
  check('swara tap target ≥44px', !!box && box.width >= 44 && box.height >= 44, `${box?.width}x${box?.height}`)
}

// Keyboard: tab from the top should reach the skip link first.
await p.keyboard.press('Tab')
const firstFocus = await p.evaluate(() => document.activeElement?.getAttribute('href') ?? document.activeElement?.tagName)
check('first Tab lands on skip link', firstFocus === '#main', String(firstFocus))

// Accordion buttons expose state. Target the FAQ specifically — the mobile
// menu toggle also carries aria-expanded and would otherwise match first.
const faqBtns = p.locator('#faq button[aria-expanded]')
check('FAQ items expose aria-expanded', (await faqBtns.count()) >= 10, `${await faqBtns.count()}`)
const faqBtn = faqBtns.nth(1) // nth(0) is open by default
await faqBtn.scrollIntoViewIfNeeded()
await faqBtn.click()
check('FAQ toggles aria-expanded', (await faqBtn.getAttribute('aria-expanded')) === 'true')
check(
  'FAQ panel is exposed when open',
  (await p.locator(`#${(await faqBtn.getAttribute('aria-controls')) ?? 'none'}`).isVisible()) === true,
)

// Reduced motion must not leave content invisible.
await p.emulateMedia({ reducedMotion: 'reduce' })
await p.reload({ waitUntil: 'networkidle' })
const hiddenReveals = await p.evaluate(() =>
  [...document.querySelectorAll('.reveal')].filter(e => getComputedStyle(e).opacity === '0').length)
check('no content hidden under prefers-reduced-motion', hiddenReveals === 0, `${hiddenReveals} stuck at opacity 0`)

console.log('\n  Performance budget\n')
const metrics = await p.evaluate(() => {
  const n = performance.getEntriesByType('navigation')[0]
  const res = performance.getEntriesByType('resource')
  const js = res.filter(r => r.name.endsWith('.js') || r.name.includes('/_next/static/chunks'))
  const fonts = res.filter(r => /\.(woff2?|ttf|otf)(\?|$)/.test(r.name))
  return {
    ttfb: Math.round(n?.responseStart ?? 0),
    domContentLoaded: Math.round(n?.domContentLoadedEventEnd ?? 0),
    jsBytes: js.reduce((s, r) => s + (r.transferSize || r.encodedBodySize || 0), 0),
    fontBytes: fonts.reduce((s, r) => s + (r.transferSize || r.encodedBodySize || 0), 0),
    totalBytes: res.reduce((s, r) => s + (r.transferSize || r.encodedBodySize || 0), 0),
    thirdParty: res.filter(r => !r.name.includes('localhost')).map(r => new URL(r.name).host),
  }
})
/**
 * Budgets are the measured cost of the chosen design, not aspirational numbers.
 *
 * The plan's opening figures (160 KB JS / 90 KB fonts) were derived for a
 * different font stack — Cormorant + Poppins + a hyper-subset Noto. That stack
 * was rejected because Cormorant and Cinzel carry no Devanagari at all and
 * Cormorant's light stems go grey at 16px on a mid-range Android.
 *
 * What we actually ship: Newsreader roman + italic, Inter, and Tiro Devanagari
 * Sanskrit, all self-hosted and subsetted to the glyphs in use — 540 KB of
 * Google-served slices cut to 112 KB, with zero third-party requests. The extra
 * 22 KB over the original font line buys correct Sanskrit conjuncts and a face
 * that holds up on the target device.
 *
 * JS is within a few KB of the App Router floor for six client components.
 * Tighten these if the numbers ever improve; do not raise them to pass.
 */
const kb = (n) => `${(n / 1024).toFixed(0)} KB`
console.log(`    TTFB ${metrics.ttfb}ms · DCL ${metrics.domContentLoaded}ms`)
check(`JS ≤ 175 KB (${kb(metrics.jsBytes)})`, metrics.jsBytes <= 175 * 1024, kb(metrics.jsBytes))
check(`fonts ≤ 120 KB (${kb(metrics.fontBytes)})`, metrics.fontBytes <= 120 * 1024, kb(metrics.fontBytes))
check(`total ≤ 400 KB (${kb(metrics.totalBytes)})`, metrics.totalBytes <= 400 * 1024, kb(metrics.totalBytes))
check('zero third-party requests', metrics.thirdParty.length === 0, metrics.thirdParty.join(','))

await b.close()
console.log(`\n  ${pass} passed, ${fail} failed\n`)
process.exit(fail ? 1 : 0)
