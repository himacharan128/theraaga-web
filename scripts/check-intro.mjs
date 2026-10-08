/**
 * The homepage intro, end to end, against a running server.
 *
 * The intro (src/components/intro) is a veil over the real homepage, and it
 * may cost a visitor nothing: it plays once per tab, on a fresh arrival at
 * "/", gives way to any input, and leaves the page exactly as it would have
 * been. Each rule it decides by is exercised here the way a visitor meets it,
 * in a fresh browser context wherever the rule is about a new tab. The
 * expected timings come from the score itself, so a change of pacing needs no
 * edit here.
 *
 *   BASE_URL=http://localhost:3100 npm run test:intro
 *
 * Runs in Chromium and in WebKit (Safari's engine, on most parents' iPhones).
 * Throttling, slow-network and touch-gesture cases need Chromium's DevTools
 * protocol and run there only.
 */
import { chromium, webkit } from 'playwright'
import { INTRO } from '../src/components/intro/score.ts'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
let pass = 0, fail = 0
const check = (n, ok, d = '') => {
  if (ok) pass++
  else fail++
  console.log(`  ${ok ? '✓' : '✗'} ${n}${ok ? '' : `   ← ${d}`}`)
}
const ms = (n) => `${Math.round(n)} ms`
/** How late a timer may fire on a busy main thread before it counts as wrong. */
const SLACK = 150
const { full, still } = INTRO.modes
const hand = (mode, k = 1) => `${Math.round(mode.hand * k)}ms`

/**
 * Installed before any page script: when the intro began, began to lift and
 * ended (ms from navigation start), the hero timing it asked for, LCP and CLS,
 * and whether नादतनुमनिशम् was ever visible in anything but its own face.
 */
function recorder(opts) {
  const r = (window.__intro = {
    set: null, out: null, end: null, hand: '', lcp: null, lcpEl: '', cls: 0,
    devaShown: false, devaFallback: false,
  })
  new MutationObserver(() => {
    const v = document.documentElement.getAttribute('data-intro')
    const now = performance.now()
    if (v === 'run' && r.set === null) {
      r.set = now
      r.hand = document.documentElement.style.getPropertyValue('--intro-hand')
    }
    if (v === 'out' && r.out === null) r.out = now
    if (v === null && r.set !== null && r.end === null) r.end = now
  }).observe(document, { subtree: true, attributes: true, attributeFilter: ['data-intro'] })
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        r.lcp = e.startTime
        r.lcpEl = e.element ? e.element.tagName.toLowerCase() + (e.element.closest('#raaga-intro') ? ' (intro)' : '') : ''
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true })
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) if (!e.hadRecentInput) r.cls += e.value
    }).observe({ type: 'layout-shift', buffered: true })
  } catch {
    /* WebKit has neither entry type */
  }
  if (opts.deva) {
    const tick = () => {
      const deva = document.querySelector('#raaga-intro [data-part="deva"]')
      if (deva && r.set !== null && r.end === null && parseFloat(getComputedStyle(deva).opacity) > 0.01) {
        r.devaShown = true
        const family = getComputedStyle(deva).fontFamily.split(',')[0].replace(/["']/g, '').trim()
        let loaded = false
        document.fonts.forEach((f) => {
          if (f.family.replace(/["']/g, '') === family && f.status === 'loaded') loaded = true
        })
        if (!loaded) r.devaFallback = true
      }
      if (r.end === null && performance.now() < 10000) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }
}

/** A tab that has already shown the intro. */
function seen() {
  try {
    sessionStorage.setItem('raaga.intro', '1')
  } catch {
    /* storage refused: the intro will not play either */
  }
}

/** An engine that cannot run the intro's animations. */
function refuse() {
  const animate = Element.prototype.animate
  Element.prototype.animate = function (...args) {
    if (this.closest && this.closest('#raaga-intro')) throw new Error('animation refused')
    return animate.apply(this, args)
  }
}

let errors = []
/**
 * Not the page's errors: the not-found page is meant to answer 404 and the
 * browser says so, and WebKit throws for Next's prefetches when the page that
 * made them is left (a goto) while they are in flight.
 */
const noise = (label, text) =>
  (label === 'not found' && /\b404\b/.test(text)) || /_rsc=\S* due to access control checks/.test(text)
const listen = (page, label) => {
  page.on('pageerror', (e) => noise(label, e.message) || errors.push(`${label}: ${e.message}`))
  page.on('console', (m) => m.type() !== 'error' || noise(label, m.text()) || errors.push(`${label}: ${m.text()}`))
}
const open = async (browser, label, { context = {}, deva = false, before } = {}) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...context })
  if (context.javaScriptEnabled !== false) await ctx.addInitScript(recorder, { deva })
  if (before) await ctx.addInitScript(before)
  const page = await ctx.newPage()
  listen(page, label)
  return { ctx, page }
}
const home = (page, path = '/') => page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded', timeout: 30000 })
const state = (page) => page.evaluate(() => window.__intro)
const ended = (page, timeout = 6000) =>
  page.waitForFunction(() => window.__intro.end !== null, null, { timeout }).then(() => true, () => false)
const now = (page) => page.evaluate(() => performance.now())
const hidden = (page) => page.evaluate(() => getComputedStyle(document.getElementById('raaga-intro')).display === 'none')
const leftover = (page) =>
  page.evaluate(() => document.getAnimations().filter((a) => a.effect?.target?.closest?.('#raaga-intro')).length)
/** How long the hero's entrance is held, in ms. The minifier writes 0ms as 0s. */
const heroHeld = (page) =>
  page.evaluate(() => {
    const v = getComputedStyle(document.querySelector('[data-section="hero"]')).getPropertyValue('--hand').trim()
    return parseFloat(v) * (/ms$/.test(v) ? 1 : 1000)
  })
const released = (page, timeout = 6000) =>
  page
    .waitForFunction(() => !document.documentElement.style.getPropertyValue('--intro-hand'), null, { timeout })
    .then(() => true, () => false)
const heroDone = (page) =>
  page.evaluate(() =>
    document
      .querySelector('[data-section="hero"]')
      .getAnimations({ subtree: true })
      .every((a) => a.playState === 'finished' || a.effect.getComputedTiming().iterations === Infinity),
  )
const ctaBox = async (page) => {
  const box = await page.locator('[data-section="hero"] a[href="/contact"]').first().boundingBox()
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
}
const opacityOnly = (page) =>
  page.evaluate(() =>
    document
      .getAnimations()
      .filter((a) => a.effect?.target?.closest?.('#raaga-intro'))
      .every((a) =>
        a.effect.getKeyframes().every((k) =>
          // visibility: the overlay's CSS backstop (app/styles/intro.css), not motion
          Object.keys(k).every((p) =>
            ['offset', 'computedOffset', 'easing', 'composite', 'opacity', 'visibility'].includes(p),
          ),
        ),
      ),
  )

async function suite(name, browser) {
  const blink = name === 'Chromium'
  console.log(`\n  ${name}\n`)

  // A first visit, desktop
  let { ctx, page } = await open(browser, 'first visit', { deva: true })
  await home(page)
  let r = await state(page)
  check('a first visit plays the full intro', r.set !== null && r.hand === hand(full), r.hand || 'did not play')
  check('its overlay is hidden from assistive technology', (await page.getAttribute(`#${INTRO.id}`, 'aria-hidden')) === 'true')
  const delays = await page.evaluate(() => {
    const hero = document.querySelector('[data-section="hero"]')
    const of = (sel) => [...hero.querySelectorAll(sel)].map((el) => parseFloat(getComputedStyle(el).animationDelay))
    return { words: of('.word-mask > span'), photo: of('.on-load-unveil, .on-load-settle') }
  })
  const { words, photo } = delays
  check('the headline waits for the veil', words.length && Math.min(...words) * 1000 >= full.hand, `${words}`)
  check('the photograph (LCP) is not held', photo.length && photo.every((d) => d * 1000 < full.hand / 4), `${photo}`)
  check('it ends', await ended(page))
  r = await state(page)
  check(`the veil lifts at ${ms(r.out - r.set)} (score ${full.exit})`, Math.abs(r.out - r.set - full.exit) <= SLACK)
  const over = r.end - r.set
  check(`it is over at ${ms(over)}, inside 3.2 s`, over <= 3200 && Math.abs(over - full.end - 20) <= SLACK)
  check('नादतनुमनिशम् appears, in its own face only', r.devaShown && !r.devaFallback, JSON.stringify(r))
  check('it leaves nothing behind', (await hidden(page)) && (await leftover(page)) === 0)
  check(
    'it remembers having played in this tab only, and nowhere else',
    await page.evaluate((k) => sessionStorage.getItem(k) === '1' && localStorage.length === 0, INTRO.key),
  )
  check('the hero gets its own timing back', (await released(page)) && (await heroHeld(page)) === 0)
  check('the hero entrance has completed', await heroDone(page))

  await page.reload({ waitUntil: 'domcontentloaded' })
  check('a reload does not play it', (await state(page)).set === null && (await hidden(page)))

  await home(page, '/about')
  await home(page)
  check('a second arrival in the same tab does not play it', (await state(page)).set === null)

  await page.locator('header nav[aria-label="Main"] a[href="/about"]').click()
  await page.waitForURL(`${BASE}/about`)
  await page.goBack()
  await page.waitForURL(`${BASE}/`)
  await page.goForward()
  await page.waitForURL(`${BASE}/about`)
  await page.locator('header a[aria-label="RAAGA Home"]').click()
  await page.waitForURL(`${BASE}/`)
  const moved = (await state(page)).set === null && (await hidden(page)) && (await heroHeld(page)) === 0
  check('moving around the site never plays it', moved)

  const again = await ctx.newPage()
  listen(again, 'new tab')
  await home(again)
  r = await state(again)
  check('a new tab plays it again, in full', r.set !== null && r.hand === hand(full), r.hand || 'did not play')
  await ended(again)
  r = await state(again)
  check(`over at ${ms(r.end - r.set)} (score ${full.end})`, Math.abs(r.end - r.set - full.end - 20) <= SLACK)
  await again.reload({ waitUntil: 'domcontentloaded' })
  check('and a reload of that tab does not', (await state(again)).set === null && (await hidden(again)))
  await ctx.close()

  // Phone: the compact score
  ;({ ctx, page } = await open(browser, 'phone', { context: { viewport: { width: 390, height: 844 } } }))
  await home(page)
  r = await state(page)
  check('a phone plays the compact score', r.set !== null && r.hand === hand(full, INTRO.compact), r.hand || 'did not play')
  const parts = await page.evaluate(() =>
    document.getAnimations().map((a) => a.effect?.target?.getAttribute?.('data-part')).filter(Boolean),
  )
  check('without the widest ring or the rule', !parts.includes('ring3') && !parts.includes('rule'), parts.join(','))
  await ended(page)
  r = await state(page)
  const compactEnd = full.end * INTRO.compact + 20
  check(`and is over at ${ms(r.end - r.set)} (score ${Math.round(compactEnd)})`, Math.abs(r.end - r.set - compactEnd) <= SLACK)
  await ctx.close()

  // Arrivals that must not play it
  ;({ ctx, page } = await open(browser, 'deep link'))
  await home(page, '/about')
  check('a deep link does not play it', (await state(page)).set === null && (await hidden(page)))
  await page.locator('header a[aria-label="RAAGA Home"]').click()
  await page.waitForURL(`${BASE}/`)
  check('nor does going home from there', (await state(page)).set === null && (await hidden(page)))
  await home(page, '/about')
  // A real full page load, as a plain link or the not-found page makes.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  await page.evaluate(() => setTimeout(() => location.assign('/')))
  await page.waitForURL(`${BASE}/`)
  await page.waitForLoadState('domcontentloaded')
  check('nor a full page load from another page of the site', (await state(page)).set === null)
  await ctx.close()

  ;({ ctx, page } = await open(browser, 'not found'))
  await home(page, '/no-such-page-intro-check')
  await page.locator('main a[href="/"]').first().click()
  await page.waitForURL(`${BASE}/`)
  await page.waitForLoadState('domcontentloaded')
  check('nor leaving the not-found page for home', (await state(page)).set === null)
  await ctx.close()

  ;({ ctx, page } = await open(browser, 'fragment'))
  await home(page, '/#main')
  check('nor a link to a place on the homepage', (await state(page)).set === null && (await hidden(page)))
  await ctx.close()

  ;({ ctx, page } = await open(browser, 'late'))
  await page.route((url) => url.pathname === '/', async (route) => {
    if (route.request().resourceType() === 'document') await new Promise((ok) => setTimeout(ok, INTRO.late + 300))
    await route.continue()
  })
  await home(page)
  check('nor a page that took too long to arrive', (await state(page)).set === null && (await hidden(page)))
  await ctx.close()

  // Reduced motion
  ;({ ctx, page } = await open(browser, 'reduced motion', { context: { reducedMotion: 'reduce' } }))
  await home(page)
  r = await state(page)
  check('reduced motion: a first visit gets a plain dissolve', r.set !== null && r.hand === hand(still), r.hand || 'did not play')
  check('opacity only, nothing moves', await opacityOnly(page))
  await ended(page)
  r = await state(page)
  check(`over at ${ms(r.end - r.set)} (score ${still.end})`, Math.abs(r.end - r.set - still.end - 20) <= SLACK)
  const later = await ctx.newPage()
  listen(later, 'reduced motion, new tab')
  await home(later)
  r = await state(later)
  check('a new tab gets the same plain dissolve', r.set !== null && r.hand === hand(still), r.hand || 'did not play')
  await ctx.close()

  // Ways out
  ;({ ctx, page } = await open(browser, 'keyboard'))
  await home(page)
  let t = await now(page)
  await page.keyboard.press('Tab')
  if (blink) {
    check('Tab during the intro reaches the skip link', (await page.evaluate(() => document.activeElement?.getAttribute('href'))) === '#main')
  }
  await ended(page)
  r = await state(page)
  check(`and lifts the veil in ${ms(r.end - t)}`, r.end !== null && r.end - t <= INTRO.skip.fade + SLACK)
  if (blink) {
    await page.keyboard.press('Tab')
    check('focus moves on from there: no trap', await page.evaluate(() => !!document.activeElement?.closest('header')))
  }
  await ctx.close()

  for (const [label, hold] of [['a click', 0], ['a slow click', 450]]) {
    ;({ ctx, page } = await open(browser, label))
    let popups = 0
    ctx.on('page', () => popups++)
    await home(page)
    const { x, y } = await ctaBox(page)
    t = await now(page)
    await page.mouse.move(x, y)
    await page.mouse.down()
    if (hold) await page.waitForTimeout(hold)
    await page.mouse.up()
    await page.waitForTimeout(700)
    r = await state(page)
    check(
      `${label} on the veil lifts it and reaches nothing beneath`,
      r.end !== null && page.url() === `${BASE}/` && popups === 0,
      `${page.url()}, ${popups} popups, end ${r.end}`,
    )
    await ctx.close()
  }

  ;({ ctx, page } = await open(browser, 'click after lift'))
  await home(page)
  await page.waitForFunction(() => window.__intro.out !== null, null, { timeout: 5000 })
  const cta = await ctaBox(page)
  await page.mouse.click(cta.x, cta.y)
  const through = await page.waitForURL(`${BASE}/contact`, { timeout: 4000 }).then(() => true, () => false)
  check('once the veil is lifting, a click reaches the page', through, page.url())
  await ctx.close()

  ;({ ctx, page } = await open(browser, 'hidden'))
  await home(page)
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  const gone = (await state(page)).end !== null && (await hidden(page)) && (await heroHeld(page)) === 0
  check('switching away ends it at once, and the hero is not held', gone)
  await ctx.close()

  ;({ ctx, page } = await open(browser, 'leave mid-intro'))
  await home(page)
  await page.keyboard.press('Escape')
  await page.locator('header nav[aria-label="Main"] a[href="/about"]').click()
  await page.waitForURL(`${BASE}/about`)
  check('leaving the homepage early gives the hero its timing back', await released(page, 1500))
  await page.goBack()
  await page.waitForURL(`${BASE}/`)
  await page.waitForTimeout(3200)
  check('so coming back shows it without waiting', (await heroHeld(page)) === 0 && (await heroDone(page)))
  await ctx.close()

  // When things fail
  ;({ ctx, page } = await open(browser, 'animation refused', { before: refuse }))
  await home(page)
  const opened = (await state(page)).set === null && (await hidden(page)) && (await heroHeld(page)) === 0
  check('if its animations fail, the page opens at once', opened)
  await ctx.close()

  ;({ ctx, page } = await open(browser, 'no javascript', { context: { javaScriptEnabled: false } }))
  await home(page)
  const plain = !(await page.locator(`#${INTRO.id}`).isVisible()) && (await page.locator('h1').isVisible())
  check('without JavaScript there is no overlay, only the page', plain)
  await ctx.close()

  ;({ ctx, page } = await open(browser, 'late fonts', { deva: true }))
  await page.route(/\.woff2$/, async (route) => {
    await new Promise((ok) => setTimeout(ok, 3000))
    await route.continue()
  })
  await home(page)
  await ended(page)
  r = await state(page)
  check('if the Sanskrit face is late, the line is left out', r.set !== null && !r.devaShown && !r.devaFallback, JSON.stringify(r))
  await ctx.close()

  if (blink) {
    const touch = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }
    ;({ ctx, page } = await open(browser, 'long tap', { context: touch }))
    await home(page)
    const cdp = await ctx.newCDPSession(page)
    const menu = await page.locator('button[aria-controls="mobile-nav"]').boundingBox()
    const tap = { x: menu.x + menu.width / 2, y: menu.y + menu.height / 2 }
    await cdp.send('Input.synthesizeTapGesture', { ...tap, duration: 450, tapCount: 1, gestureSourceType: 'touch' })
    await page.waitForTimeout(700)
    r = await state(page)
    check(
      'a long tap on the veil lifts it and reaches nothing beneath',
      r.end !== null && (await page.locator('#mobile-nav').count()) === 0,
      `end ${r.end}, menu ${await page.locator('#mobile-nav').count()}`,
    )
    await ctx.close()

    ;({ ctx, page } = await open(browser, 'swipe', { context: touch }))
    await home(page)
    const swipe = await ctx.newCDPSession(page)
    await swipe.send('Input.synthesizeScrollGesture', { x: 195, y: 600, yDistance: -400, gestureSourceType: 'touch' })
    await ended(page, 2000)
    const swiped = (await state(page)).end !== null && (await page.evaluate(() => scrollY)) > 0
    check('a swipe lifts it and scrolls the page', swiped)
    await ctx.close()

    ;({ ctx, page } = await open(browser, 'slow CPU'))
    const cpu = await ctx.newCDPSession(page)
    await cpu.send('Emulation.setCPUThrottlingRate', { rate: 4 })
    await home(page)
    if ((await state(page)).set !== null) await ended(page, 10000)
    r = await state(page)
    check(
      `a slow phone CPU (4x): ${r.set === null ? 'skipped' : `over at ${ms(r.end - r.set)}`}, nothing left behind`,
      (r.set === null || r.end !== null) && (await hidden(page)) && (await leftover(page)) === 0,
    )
    await ctx.close()

    ;({ ctx, page } = await open(browser, 'slow network', { deva: true }))
    const net = await ctx.newCDPSession(page)
    await net.send('Network.enable')
    const kbps = (400 * 1024) / 8
    await net.send('Network.emulateNetworkConditions', { offline: false, latency: 400, downloadThroughput: kbps, uploadThroughput: kbps })
    await home(page)
    if ((await state(page)).set !== null) await ended(page, 10000)
    r = await state(page)
    check(
      `a slow connection (400 kbps): ${r.set === null ? 'skipped' : 'played'}, Sanskrit never in a fallback face`,
      (r.set === null || r.end !== null) && !r.devaFallback && (await hidden(page)),
      JSON.stringify(r),
    )
    await ctx.close()

    // Paint metrics, as a fair A/B: fresh contexts in turn in a warm browser,
    // since a cold first load is slower for reasons of its own.
    const paint = async (intro) => {
      ;({ ctx, page } = await open(browser, intro ? 'paint, intro' : 'paint', { before: intro ? undefined : seen }))
      await home(page)
      await page.waitForLoadState('load')
      await page.waitForTimeout(full.end + 400)
      const m = await state(page)
      await ctx.close()
      return m
    }
    const median = (runs, key) => runs.map((m) => m[key]).sort((a, b) => a - b)[runs.length >> 1]
    await paint(false)
    const runs = { intro: [], none: [] }
    for (let i = 0; i < 3; i++) {
      runs.intro.push(await paint(true))
      runs.none.push(await paint(false))
    }
    const els = new Set([...runs.intro, ...runs.none].map((m) => m.lcpEl))
    check(`the LCP element is the same with or without it (${[...els]})`, els.size === 1 && !runs.intro[0].lcpEl.includes('intro'))
    const [lcpWith, lcpWithout] = [median(runs.intro, 'lcp'), median(runs.none, 'lcp')]
    check(`LCP ${ms(lcpWith)} with the intro, ${ms(lcpWithout)} without`, lcpWith <= lcpWithout + 50)
    const [clsWith, clsWithout] = [median(runs.intro, 'cls'), median(runs.none, 'cls')]
    check(`no layout shift from it (CLS ${clsWith.toFixed(3)} with, ${clsWithout.toFixed(3)} without)`, clsWith <= clsWithout + 0.005)
  }

  check('no console errors or uncaught exceptions', errors.length === 0, errors.join(' | '))
  errors = []
}

for (const [name, engine] of [['Chromium', chromium], ['WebKit', webkit]]) {
  const browser = await engine.launch()
  try {
    await suite(name, browser)
  } finally {
    await browser.close()
  }
}
console.log(`\n  ${pass} passed, ${fail} failed\n`)
process.exit(fail ? 1 : 0)
