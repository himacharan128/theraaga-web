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
// Six, not eight: Gallery and Journal are left out of the nav until they have
// content (see Header's hasGallery / hasJournal). Raise this when they return.
check('mobile nav has all 6 items', navLinks === 6, `${navLinks}`)
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

/**
 * Header legibility across client-side navigation.
 *
 * Next keeps up to three pages the visitor has left in the document, hidden.
 * A rule that looked at the whole document once found a hidden dark hero and
 * left the header cream on the cream Contact page after a visit to the Gurus.
 * A full page load never shows that, so this moves between dark and light
 * heroes by clicking, as a visitor does, and measures the header's ink against
 * whatever is actually under it.
 */
const headerContrast = (page) =>
  page.evaluate(() => {
    const rgba = (s) => {
      const n = (s.match(/[\d.]+/g) ?? []).map(Number)
      const k = s.startsWith('color(') ? 255 : 1
      return [n[0] * k, n[1] * k, n[2] * k, n.length > 3 ? n[3] : 1]
    }
    const lum = (c) =>
      c.slice(0, 3).reduce((sum, v, i) => {
        v /= 255
        return sum + [0.2126, 0.7152, 0.0722][i] * (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
      }, 0)
    const header = document.querySelector('header.site-header')
    const own = rgba(getComputedStyle(header).backgroundColor)
    let worst = Infinity
    for (const el of header.querySelectorAll('nav[aria-label="Main"] a, button[aria-controls="mobile-nav"]')) {
      if (!el.checkVisibility()) continue
      const r = el.getBoundingClientRect()
      let bg = own
      if (own[3] === 0) {
        const under = document
          .elementsFromPoint(r.x + r.width / 2, r.y + r.height / 2)
          .find((n) => !header.contains(n) && rgba(getComputedStyle(n).backgroundColor)[3] > 0)
        bg = rgba(getComputedStyle(under ?? document.body).backgroundColor)
      }
      const [hi, lo] = [lum(rgba(getComputedStyle(el).color)), lum(bg)].sort((a, b) => b - a)
      worst = Math.min(worst, (hi + 0.05) / (lo + 0.05))
    }
    return worst
  })
// Long enough for the header's observer to report and its 320ms ink transition.
const settle = (page) => page.waitForTimeout(700)
const legible = async (page, label) => {
  await settle(page)
  const c = await headerContrast(page)
  check(`header legible: ${label}`, c >= 4.5, `${c.toFixed(2)}:1`)
}

const wide = await b.newPage({ viewport: { width: 1440, height: 900 } })
await wide.goto(`${BASE}/gurus`, { waitUntil: 'networkidle' })
await legible(wide, '/gurus')
for (const href of ['/contact', '/events', '/about', '/gurus', '/learning']) {
  const from = new URL(wide.url()).pathname
  await wide.locator(`header nav[aria-label="Main"] a[href="${href}"]`).click()
  await wide.waitForURL(`${BASE}${href}`)
  await legible(wide, `${from} → ${href}`)
}
await wide.evaluate(() => window.scrollTo({ top: 1400, behavior: 'instant' }))
await legible(wide, '/learning scrolled')
await wide.goBack()
await wide.waitForURL(`${BASE}/gurus`)
await legible(wide, 'back to /gurus')
await wide.goto(`${BASE}/thank-you`, { waitUntil: 'networkidle' })
await wide.locator('main a[href="/"]').first().click()
await wide.waitForURL(`${BASE}/`)
await legible(wide, '/thank-you → /')
await wide.close()

await p.goto(`${BASE}/online-classes`, { waitUntil: 'networkidle' })
await legible(p, '/online-classes at 360px')
for (const href of ['/contact', '/gurus', '/']) {
  const from = new URL(p.url()).pathname
  await p.locator('button[aria-controls="mobile-nav"]').click()
  await p.locator(`#mobile-nav a[href="${href}"]`).click()
  await p.waitForURL(`${BASE}${href}`)
  await legible(p, `${from} → ${href} at 360px`)
}

/**
 * Dead contact links.
 *
 * `site.email` is null while the school has no mailbox, and TypeScript cannot
 * catch this: `mailto:${null}` interpolates to the string "mailto:null" and
 * renders a link that silently fails. Every consumer is guarded, and this
 * asserts the guards stay. The legal pages matter most — the contact route
 * there is a DPDP grievance requirement, not a courtesy.
 */
for (const route of ['/', '/contact', '/privacy', '/terms', '/refund-policy', '/child-safeguarding']) {
  await p.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' })
  const dead = await p.evaluate(() =>
    [...document.querySelectorAll('a[href]')]
      .map((a) => a.getAttribute('href'))
      .filter((h) => /^(mailto|tel):\s*(null|undefined)?$|:(null|undefined)$/.test(h)),
  )
  check(`no dead contact link on ${route}`, dead.length === 0, dead.join(', '))
}

/**
 * Target size — WCAG 2.2 SC 2.5.8 (AA), at the 360px mobile viewport.
 *
 * The footer says "Built to WCAG 2.2 AA", so the claim is asserted rather than
 * assumed. Every visible interactive control must be at least 24x24 CSS px.
 * Two exemptions, both from the criterion itself or its intent:
 *   - `display: inline` elements that sit inside a sentence: the
 *     inline-in-text exception. An inline link that stands alone (a footer list
 *     item, a phone number after a <br>) is NOT in text and is measured, so
 *     `display: inline` cannot be used to dodge the rule.
 *   - visually hidden elements (zero or 1px boxes: the skip link until focused,
 *     the honeypot, sr-only radios), which are not a target a pointer can hit.
 */
const TARGET_ROUTES = [
  '/', '/about', '/contact', '/learning', '/gurus', '/events', '/gallery',
  '/journal', '/getting-started', '/online-classes',
  '/music-classes/jubilee-hills', '/music-classes/hitech-city',
  '/carnatic-music-classes/beginners', '/thank-you',
  '/privacy', '/terms', '/refund-policy', '/child-safeguarding',
]
for (const route of TARGET_ROUTES) {
  const res = await p.goto(`${BASE}${route}`, { waitUntil: 'networkidle' })
  if (!res || !res.ok()) {
    check(`target size ≥24px on ${route}`, false, `HTTP ${res?.status()}`)
    continue
  }
  const offenders = await p.evaluate(() => {
    const out = []
    const sel = 'a[href], button, summary, input:not([type="hidden"]), select, textarea'
    for (const el of document.querySelectorAll(sel)) {
      const cs = getComputedStyle(el)
      if (cs.display === 'none' || cs.visibility === 'hidden') continue
      if (cs.display === 'inline') {
        let n = el
        while (n.parentElement && getComputedStyle(n.parentElement).display === 'inline') n = n.parentElement
        // Nearest sibling that is neither a comment (React's text separators)
        // nor whitespace: if it is text, the link is part of a sentence.
        const nearest = (x, dir) => {
          for (x = x[dir]; x; x = x[dir]) {
            if (x.nodeType === 8 || (x.nodeType === 3 && x.textContent.trim() === '')) continue
            return x
          }
          return null
        }
        const textual = (x) => x && x.nodeType === 3
        if (textual(nearest(n, 'previousSibling')) || textual(nearest(n, 'nextSibling'))) continue
      }
      const r = el.getBoundingClientRect()
      if (r.width <= 1 || r.height <= 1) continue // sr-only / visually hidden
      if (el.closest('[aria-hidden="true"]') && r.width <= 1) continue
      if (r.width >= 24 && r.height >= 24) continue
      const label = (el.getAttribute('aria-label') || el.textContent || el.getAttribute('name') || el.tagName)
        .replace(/\s+/g, ' ').trim().slice(0, 40)
      out.push(`${el.tagName.toLowerCase()} "${label}" ${Math.round(r.width)}x${Math.round(r.height)}`)
    }
    return out
  })
  check(`target size ≥24px on ${route}`, offenders.length === 0, offenders.join('; '))
}

/**
 * Social preview image on every public page.
 *
 * Next merges metadata shallowly: a page that exports its own `openGraph`
 * silently drops the `opengraph-image.tsx` card the root layout would have
 * supplied, and twelve pages shipped with no `og:image` while the homepage kept
 * it. The WhatsApp forward is the go-to-market and its card is seen far more
 * often than the page, so assert the tag on every page in the sitemap (plus the
 * noindex thank-you page), that it is an absolute https://theraaga.in URL, and
 * that the image path actually serves a PNG from this server.
 */
const sitemapXml = await (await fetch(`${BASE}/sitemap.xml`)).text()
const ogRoutes = [
  ...new Set([
    ...[...sitemapXml.matchAll(/<loc>https:\/\/theraaga\.in([^<]*)<\/loc>/g)].map((m) => m[1] || '/'),
    '/thank-you',
  ]),
]
check('sitemap lists the public routes', ogRoutes.length >= 15, `${ogRoutes.length} routes`)
const ogImagePaths = new Set()
for (const route of ogRoutes) {
  const res = await fetch(`${BASE}${route}`)
  const html = res.ok ? await res.text() : ''
  const tag = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/)
    ?? html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:image"/)
  const url = tag?.[1] ?? ''
  const ok = /^https:\/\/theraaga\.in\/[^\s"]+$/.test(url)
  console.log(`    ${route} → ${url || '(none)'}`)
  check(`og:image is an absolute theraaga.in URL on ${route}`, ok, res.ok ? `got "${url}"` : `HTTP ${res.status}`)
  if (ok) ogImagePaths.add(new URL(url).pathname + new URL(url).search)
}
for (const path of ogImagePaths) {
  const res = await fetch(`${BASE}${path}`)
  const type = res.headers.get('content-type') ?? ''
  check(`og:image ${path} serves 200 image/png`, res.status === 200 && type.startsWith('image/png'), `${res.status} ${type}`)
}

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
    // An inline `data:` URI shows up in resource timing with no host. It is
    // not a request, so it is not a third party.
    thirdParty: res
      .filter(r => !r.name.includes('localhost') && !r.name.startsWith('data:'))
      .map(r => new URL(r.name).host),
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
