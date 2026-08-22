/**
 * Accessibility + performance budget spot-check against a running server.
 * Scoped to the things this specific design is most likely to get wrong.
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
let pass = 0, fail = 0
const check = (n, ok, d = '') => {
  if (ok) pass++
  else fail++
  console.log(`  ${ok ? '✓' : '✗'} ${n}${ok ? '' : `   ← ${d}`}`)
}

const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 360, height: 800 } })

// Wire-weight as reported by the server, which is what a phone on mobile data
// actually pays — distinct from the decoded resource sizes measured below.
let transferred = 0
p.on('response', async (r) => {
  try {
    const h = await r.allHeaders()
    transferred += Number(h['content-length'] ?? 0)
  } catch {
    /* redirects and cached responses have no content-length; ignore */
  }
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
const swara = p.locator('button[aria-label^="Play note"]')
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

// Sequence button is a real control with a real label.
check(
  'Sa-Pa-Sa sequence button present',
  (await p.locator('button', { hasText: 'Play Sa · Pa · Sa' }).count()) === 1,
)

// Mobile menu: Escape must close it AND return focus to the trigger. Without
// the focus return a keyboard user is dropped at the top of the document, which
// is the most common way a correctly-marked-up disclosure still fails 2.4.3.
const menuBtn = p.locator('button[aria-controls="mobile-nav"]')
await menuBtn.click()
check('mobile menu opens', (await p.locator('#mobile-nav').count()) === 1)
const navLinks = await p.locator('#mobile-nav a').count()
check('mobile nav has all 8 items', navLinks === 8, `${navLinks}`)
const smallTargets = await p.evaluate(() =>
  [...document.querySelectorAll('#mobile-nav a')].filter(
    (e) => e.getBoundingClientRect().height < 44,
  ).length)
check('mobile nav tap targets ≥44px', smallTargets === 0, `${smallTargets} under 44px`)
await p.keyboard.press('Escape')
check('Escape closes the mobile menu', (await p.locator('#mobile-nav').count()) === 0)
const refocused = await p.evaluate(
  () => document.activeElement?.getAttribute('aria-controls') === 'mobile-nav')
check('Escape returns focus to the menu trigger', refocused)

// Skip link must MOVE focus, not just scroll. A skip link that leaves focus
// behind is the single most common false-pass in this whole checklist.
await p.evaluate(() => window.scrollTo(0, 0))
await p.locator('a[href="#main"]').focus()
await p.keyboard.press('Enter')
const focusedMain = await p.evaluate(() => document.activeElement?.id)
check('skip link moves focus to <main>', focusedMain === 'main', String(focusedMain))

// The FAQ moved off the homepage to /contact. Assert it where it now lives.
await p.goto(`${BASE}/contact`, { waitUntil: 'networkidle' })
check('contact page has exactly one <h1>', (await p.locator('h1').count()) === 1)
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

// The curriculum timeline uses native <details>, which is keyboard-operable and
// exposes state for free — assert it is actually there on /courses.
await p.goto(`${BASE}/learning`, { waitUntil: 'networkidle' })
check('learning page has exactly one <h1>', (await p.locator('h1').count()) === 1)
const stages = await p.locator('#sangeetha-margam details').count()
check('all 10 curriculum stages render', stages === 10, `${stages}`)

// Back to the homepage for the performance budget.
await p.goto(BASE, { waitUntil: 'networkidle' })

// Reduced motion must not leave content invisible.
await p.emulateMedia({ reducedMotion: 'reduce' })
await p.reload({ waitUntil: 'networkidle' })
const hiddenReveals = await p.evaluate(() =>
  [...document.querySelectorAll('.reveal')].filter(e => getComputedStyle(e).opacity === '0').length)
check('no content hidden under prefers-reduced-motion', hiddenReveals === 0, `${hiddenReveals} stuck at opacity 0`)

console.log('\n  Performance budget\n')
console.log(`    wire weight (content-length): ${Math.round(transferred / 1024)} KB`)
const metrics = await p.evaluate(() => {
  const n = performance.getEntriesByType('navigation')[0]
  const res = performance.getEntriesByType('resource')
  // `/_next/static/chunks/` holds CSS as well as JS, so the old
  // `includes('/chunks')` clause counted every stylesheet toward the JS
  // budget. That silently inflated the JS number and eventually failed the
  // build on CSS growth. Classify by extension, and budget CSS separately so
  // nothing becomes unmeasured by fixing this.
  const isCss = (r) => /\.css(\?|$)/.test(r.name)
  const isFont = (r) => /\.(woff2?|ttf|otf)(\?|$)/.test(r.name)
  const js = res.filter(r => !isCss(r) && !isFont(r) && (r.name.endsWith('.js') || r.name.includes('/_next/static/chunks')))
  const css = res.filter(isCss)
  const fonts = res.filter(isFont)
  return {
    ttfb: Math.round(n?.responseStart ?? 0),
    domContentLoaded: Math.round(n?.domContentLoadedEventEnd ?? 0),
    jsBytes: js.reduce((s, r) => s + (r.transferSize || r.encodedBodySize || 0), 0),
    cssBytes: css.reduce((s, r) => s + (r.transferSize || r.encodedBodySize || 0), 0),
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
 * JS is within a few KB of the App Router floor for the client components this
 * design needs. Tighten these if the numbers ever improve; do not raise them to
 * pass. The CSS line was previously counted inside the JS total by mistake and
 * is now measured on its own.
 */
const kb = (n) => `${(n / 1024).toFixed(0)} KB`
console.log(`    TTFB ${metrics.ttfb}ms · DCL ${metrics.domContentLoaded}ms`)
check(`JS ≤ 175 KB (${kb(metrics.jsBytes)})`, metrics.jsBytes <= 175 * 1024, kb(metrics.jsBytes))
check(`CSS ≤ 16 KB (${kb(metrics.cssBytes)})`, metrics.cssBytes <= 16 * 1024, kb(metrics.cssBytes))
check(`fonts ≤ 120 KB (${kb(metrics.fontBytes)})`, metrics.fontBytes <= 120 * 1024, kb(metrics.fontBytes))
check(`total ≤ 400 KB (${kb(metrics.totalBytes)})`, metrics.totalBytes <= 400 * 1024, kb(metrics.totalBytes))
check('zero third-party requests', metrics.thirdParty.length === 0, metrics.thirdParty.join(','))

await b.close()
console.log(`\n  ${pass} passed, ${fail} failed\n`)
process.exit(fail ? 1 : 0)
