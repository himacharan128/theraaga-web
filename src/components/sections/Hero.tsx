import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { whatsappHref } from '@/lib/whatsapp'
import { getSite } from '@/data/content'

/**
 * Headline, subtitle and both button labels are the CLIENT'S OWN COPY from their
 * content master. Do not "optimise" them.
 *
 * One addition, deliberately: a single factual line under the subtitle naming
 * the centres, the ages and that beginners are welcome. The client's hero is
 * evocative but says neither what is taught nor where, and the fold budget is
 * 360 × ~640 CSS px for a parent opening a WhatsApp forward — India's dominant
 * mobile resolution is 360×800 and Android is 92.4% of traffic. The line is
 * additive, never contradictory: brand voice on top, orientation underneath.
 *
 * The LCP element is deliberately the H1 TEXT on flat ivory, not a photograph.
 * That is also why shipping with no client photography costs this page nothing
 * where it matters most.
 *
 * The right-hand column is a TYPOGRAPHIC composition, not a frame waiting for
 * an asset. A visible "photo to follow" placeholder tells every visitor the
 * site is unfinished; this reads as a deliberate choice, because it is one.
 */
export async function Hero() {
  const site = await getSite()

  return (
    <section
      data-section="hero"
      data-has-content="true"
      className="relative overflow-hidden border-b border-border"
    >
      <span
        aria-hidden="true"
        className="absolute -right-32 top-14 size-[30rem] rounded-full border border-[color-mix(in_srgb,var(--color-accent)_11%,transparent)] sm:-right-20"
      />
      <span
        aria-hidden="true"
        className="absolute -right-16 top-28 size-80 rounded-full border border-[color-mix(in_srgb,var(--color-gold-hairline)_20%,transparent)]"
      />
      <div className="u-shell relative grid items-center gap-10 py-8 sm:py-12 md:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 xl:py-24">
        <div className="relative z-10">
          <p className="u-eyebrow inline-flex items-center gap-3 rounded-full border border-[color-mix(in_srgb,var(--color-accent-muted)_28%,transparent)] bg-[color-mix(in_srgb,var(--color-surface)_72%,transparent)] px-3.5 py-2">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
            Nāda · Carnatic Sangeetham · Hyderabad since {site.foundedYear}
          </p>

          {/* One step down on small screens. At 390px the step-4 clamp resolves
              to ~42px, which pushed the primary CTA below the fold — fatal when
              the dominant arrival is a WhatsApp forward with ten seconds of
              patience. */}
          {/* The client's headline runs to nine words, so it steps down twice on
              small screens. At step-5 it alone consumed the whole 360×640 fold
              and pushed both buttons out of view. */}
          <h1 className="mt-5 max-w-[19ch] text-[length:var(--text-step-3)] font-[300] sm:text-[length:var(--text-step-4)] lg:text-[length:var(--text-step-5)]">
            A Journey Through the{' '}
            <span className="italic text-accent">Timeless Tradition</span> of
            Carnatic Sangeetham
          </h1>

          <p className="u-measure mt-5 text-[length:var(--text-step-0)] font-[300] leading-[var(--lh-snug)] text-text-secondary sm:mt-6 sm:text-[length:var(--text-step-1)]">
            Rooted in the Guru–Shishya Parampara, {site.shortName} nurtures music
            with devotion, discipline and sincerity.
          </p>

          {/* The orientation line. Not in the client's copy, but a hero that
              names neither the subject nor the city fails the one visitor this
              site is built for. */}
          <p className="u-measure mt-4 text-[length:var(--text-step--1)] leading-[var(--lh-body)] text-text-muted">
            Carnatic vocal for children and adults at our{' '}
            <strong className="font-[400] text-text-secondary">Jubilee Hills</strong>{' '}
            and{' '}
            <strong className="font-[400] text-text-secondary">
              Phoenix Arena, Hitech City
            </strong>{' '}
            centres, <strong className="font-[400] text-text-secondary">online</strong>{' '}
            worldwide, or hosted in your community. Beginners welcome.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row">
            <ButtonLink href="/contact">Begin Your Musical Journey</ButtonLink>
            <ButtonLink variant="secondary" href="/about">
              Explore {site.shortName}
            </ButtonLink>
          </div>

          {/* WhatsApp keeps its place as a co-primary path without becoming a
              third button: in this category it is how enquiries actually
              arrive, and the client's two-button hero leaves no room for it. */}
          <p className="mt-5 font-[var(--font-ui)] text-[length:var(--text-step--1)] text-text-muted">
            Prefer to ask first?{' '}
            <a
              href={whatsappHref('HERO')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-accent underline underline-offset-4"
            >
              <WhatsAppIcon />
              Message us on WhatsApp
            </a>
          </p>
        </div>

        <aside className="relative z-10 mx-auto flex min-h-[19rem] w-full max-w-md flex-col justify-end overflow-hidden rounded-[var(--radius-lg)] bg-[linear-gradient(145deg,#7a2934,#511721)] p-7 text-on-accent shadow-[var(--shadow-lift)] sm:p-9 lg:max-w-none">
          <span
            aria-hidden="true"
            className="motion-orbit absolute -right-12 -top-12 size-60 rounded-full border border-[color-mix(in_srgb,var(--color-gold-hairline)_44%,transparent)] motion-reduce:transform-none"
          />
          <span
            aria-hidden="true"
            className="absolute -right-2 -top-2 size-40 rounded-full border border-[color-mix(in_srgb,var(--color-on-accent)_16%,transparent)]"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-12 right-8 flex items-end gap-2 opacity-50"
          >
            {[28, 50, 36, 68, 48, 82, 58].map((height, i) => (
              <span
                key={i}
                className="w-1.5 rounded-full bg-[color-mix(in_srgb,var(--color-gold-hairline)_80%,transparent)]"
                style={{ height }}
              />
            ))}
          </span>
          <div className="relative max-w-[18rem]">
            <p className="font-[var(--font-ui)] text-[0.7rem] font-medium uppercase tracking-[0.18em] text-[color-mix(in_srgb,var(--color-on-accent)_70%,transparent)]">
              The beginning
            </p>
            <p className="deva mt-5 text-[length:var(--text-step-3)] leading-[1.35]">
              {site.sanskritLine.devanagari}
            </p>
            <p className="mt-4 font-[var(--font-display)] text-[length:var(--text-step-1)] font-[300] italic leading-[var(--lh-snug)] text-[color-mix(in_srgb,var(--color-on-accent)_92%,transparent)]">
              ♪ {site.sanskritLine.roman} ♪
            </p>
            <p className="mt-3 font-[var(--font-ui)] text-[length:var(--text-step--1)] text-[color-mix(in_srgb,var(--color-on-accent)_70%,transparent)]">
              {site.sanskritLine.gloss}
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}
