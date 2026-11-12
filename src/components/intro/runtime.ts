import type { Ease, IntroScore } from './score'

/**
 * The intro's runtime. Intro.tsx serialises this function into an inline
 * script that runs while the document is still being parsed, before any of the
 * page has painted. So it is self-contained (no imports and nothing from module
 * scope: every value arrives in `s`), and it avoids syntax whose compiled form
 * would reach for a helper (optional chaining, nullish coalescing, spread).
 *
 * It decides:
 *   plays in full once per tab, on a fresh, visible load of "/" with no
 *   #fragment, arriving from outside the site and in time (`late`); every new
 *   tab plays it again. Never on a reload, back/forward, a second arrival in
 *   the same tab, a background tab, prerender or any other route, never on a
 *   full page load from another page of the site (a plain link, the not-found
 *   page), and never when storage is refused, since then it could not
 *   remember having played.
 *
 * It plays:
 *   Web Animations on transform and opacity (and clip-path on two small
 *   parts), so the compositor runs them while the page hydrates underneath.
 *   The hero's own CSS entrance waits for the veil (`--intro-hand` and
 *   `--intro-pace` on <html>, read by [data-section='hero'] in
 *   app/styles/motion.css) and gets its normal timing back once it has run.
 *
 * It gets out of the way:
 *   any key, wheel, swipe or scroll lifts the veil from wherever it stands,
 *   and so does a tap or click, on release: that click lands on the veil
 *   itself, so the tap that skips can never reach a link beneath it. Input
 *   passes through once the veil starts lifting; a hidden page ends it at
 *   once. Any error, or a missing API, ends it immediately and leaves the
 *   page exactly as it would have been. And if this script never runs at
 *   all, the overlay stays display:none, or hides itself at 3.2 s
 *   (app/styles/intro.css).
 */
export function runIntro(s: IntroScore): void {
  const d = document.documentElement
  const anims: Animation[] = []
  const timers: number[] = []
  const inputs = ['keydown', 'wheel', 'touchmove', 'scroll']
  let root: HTMLElement | null = null
  let css: CSSStyleDeclaration | null = null
  let stage = 0 // 1 playing, 2 lifting, 3 done
  let t0 = 0
  let pace = 1
  let handBack = 0
  let watch: ResizeObserver | null = null

  function ease(name: Ease) {
    return (css && css.getPropertyValue('--ease-' + name).trim()) || name
  }

  function later(fn: () => void, ms: number) {
    timers.push(window.setTimeout(fn, ms))
  }

  /** Gives the hero its own entrance timing back. */
  function release() {
    clearTimeout(handBack)
    d.style.removeProperty('--intro-hand')
    d.style.removeProperty('--intro-pace')
    if (watch) watch.disconnect()
  }

  /** Holds the hero's entrance until `hand` ms after the first frame. */
  function holdHero(hand: number) {
    d.style.setProperty('--intro-hand', Math.round(hand) + 'ms')
    d.style.setProperty('--intro-pace', String(pace))
    clearTimeout(handBack)
    handBack = window.setTimeout(release, hand + s.settle - (performance.now() - t0))
  }

  /**
   * Next keeps a page the visitor has left in the document, hidden, and
   * restarts its CSS entrance when they return. If they leave the homepage
   * before its entrance has run, its timing goes back at once, so a return
   * never waits on an intro that has gone.
   */
  function watchHero() {
    const hero = document.querySelector('[data-section="hero"]')
    if (!hero || typeof ResizeObserver !== 'function') return
    watch = new ResizeObserver((entries) => {
      if (!entries[0].contentRect.height) release()
    })
    watch.observe(hero)
  }

  function quiet() {
    inputs.forEach((type) => removeEventListener(type, lift, true))
    if (root) root.removeEventListener('click', lift)
  }

  /** The end: the overlay returns to display:none and every animation is dropped. */
  function finish() {
    if (stage === 3) return
    stage = 3
    quiet()
    document.removeEventListener('visibilitychange', onHide)
    removeEventListener('pagehide', finish)
    timers.forEach(clearTimeout)
    d.removeAttribute('data-intro')
    anims.forEach((a) => a.cancel())
  }

  function onHide() {
    if (document.visibilityState !== 'hidden') return
    release()
    finish()
  }

  /** Any input while the composition plays lifts the veil from where it stands. */
  function lift(e: Event) {
    if (stage !== 1 || !root) return
    if (e.type === 'keydown' && /^(Shift|Control|Alt|Meta)$/.test((e as KeyboardEvent).key)) return
    stage = 2
    quiet()
    anims.forEach((a) => a.pause())
    holdHero(performance.now() - t0 + s.skip.hand)
    watchHero()
    anims.push(
      root.animate([{ opacity: 0 }], {
        duration: s.skip.fade,
        easing: ease(s.skip.ease),
        fill: 'forwards',
      }),
    )
    later(finish, s.skip.fade)
  }

  try {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    root = document.getElementById(s.id)
    if (
      !root ||
      typeof root.animate !== 'function' ||
      location.pathname !== '/' ||
      location.hash ||
      document.visibilityState !== 'visible' ||
      (nav && nav.type !== 'navigate') ||
      document.referrer.indexOf(location.origin + '/') === 0 ||
      performance.now() > s.late ||
      d.hasAttribute('data-intro') ||
      sessionStorage.getItem(s.key)
    ) {
      return
    }

    sessionStorage.setItem(s.key, '1')
    const name = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'still' : 'full'

    const mode = s.modes[name]
    const wide = matchMedia(s.wide).matches
    const k = name === 'full' && !wide ? s.compact : 1
    const veil = root
    const scripted: Animation[] = []
    let firstScripted = Infinity

    css = getComputedStyle(d)
    pace = mode.pace
    t0 = performance.now()
    stage = 1
    d.setAttribute('data-intro', 'run')
    holdHero(mode.hand * k)

    mode.tracks.forEach((t) => {
      if (t.wide && !wide) return
      const el = t.part === 'veil' ? veil : veil.querySelector<HTMLElement>('[data-part="' + t.part + '"]')
      if (!el) return
      const a = el.animate(t.frames, {
        delay: t.at * k,
        duration: t.dur * k,
        easing: ease(t.ease),
        fill: t.out ? 'forwards' : 'both',
      })
      anims.push(a)
      if (t.script) {
        scripted.push(a)
        firstScripted = Math.min(firstScripted, t.at * k)
      }
    })

    // Nāda is set only in its own face. If Tiro Devanagari has not loaded by
    // the moment the line would appear, the line is left out, never shown in a
    // fallback that swaps mid-phrase. This asks the face itself: fonts.check()
    // also says yes once a face has failed, when the fallback is all there is.
    const deva = veil.querySelector<HTMLElement>('[data-part="deva"]')
    if (deva && scripted.length) {
      later(() => {
        if (performance.now() - t0 >= firstScripted) return
        const family = getComputedStyle(deva).fontFamily.split(',')[0].replace(/["']/g, '').trim()
        let loaded = false
        if (document.fonts) {
          document.fonts.forEach((face) => {
            if (face.family.replace(/["']/g, '') === family && face.status === 'loaded') loaded = true
          })
        }
        if (!loaded) scripted.forEach((a) => a.cancel())
      }, firstScripted - 40)
    }

    later(() => {
      if (stage !== 1) return
      stage = 2
      quiet()
      d.setAttribute('data-intro', 'out')
      watchHero()
    }, mode.exit * k)
    later(finish, mode.end * k + 20)

    inputs.forEach((type) => addEventListener(type, lift, { capture: true, passive: true }))
    // On the veil itself, not the window: iOS Safari sends a tap's click only
    // to an element that listens for it.
    veil.addEventListener('click', lift)
    document.addEventListener('visibilitychange', onHide)
    addEventListener('pagehide', finish)
  } catch {
    release()
    finish()
  }
}
