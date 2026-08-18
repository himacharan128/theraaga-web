import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { whatsappHref } from '@/lib/whatsapp'
import { getSite } from '@/data/content'

/**
 * The fold budget is 360 × ~640 CSS px — India's dominant mobile resolution is
 * 360×800 and Android is 92.4% of traffic. Discipline, audience, both
 * localities and "beginners welcome" all have to be literal, scannable text
 * inside that box. The poetry lives in the eyebrow, not instead of the facts.
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
            Nāda · Hyderabad since {site.foundedYear}
          </p>

          {/* One step down on small screens. At 390px the step-4 clamp resolves
              to ~42px, which pushed the primary CTA below the fold — fatal when
              the dominant arrival is a WhatsApp forward with ten seconds of
              patience. */}
          <h1 className="mt-5 max-w-[14ch] text-[length:var(--text-step-4)] font-[300] sm:text-[length:var(--text-step-5)]">
            Carnatic music and vocal classes,{' '}
            <span className="italic text-accent">one note at a time.</span>
          </h1>

          <p className="u-measure mt-5 text-[length:var(--text-step-0)] font-[300] leading-[var(--lh-snug)] text-text-secondary sm:mt-6 sm:text-[length:var(--text-step-1)]">
            At RAAGA, a school of Indian classical music in Hyderabad, learn at our{' '}
            <strong className="font-[400] text-text-primary">Jubilee Hills</strong>{' '}
            and{' '}
            <strong className="font-[400] text-text-primary">
              Phoenix Arena, Hitech City
            </strong>{' '}
            centres, or{' '}
            <strong className="font-[400] text-text-primary">online</strong>{' '}
            from anywhere in the world. Beginners are welcome. Most students
            start with no training at all.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row">
            <ButtonLink href="/contact">Book a trial</ButtonLink>
            <ButtonLink variant="secondary" href={whatsappHref('HERO')}>
              <WhatsAppIcon />
              Ask on WhatsApp
            </ButtonLink>
          </div>

          <p className="mt-4 flex items-center gap-2 font-[var(--font-ui)] text-[length:var(--text-step--1)] text-text-muted">
            <span className="size-1.5 rounded-full bg-accent-muted" aria-hidden="true" />
            A complete first class, so you can see how we teach before deciding.
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
            <p className="deva mt-5 text-[length:var(--text-step-5)] leading-none">नाद</p>
            <p className="mt-4 font-[var(--font-display)] text-[length:var(--text-step-1)] font-[300] leading-[var(--lh-snug)] text-[color-mix(in_srgb,var(--color-on-accent)_90%,transparent)]">
              A voice becomes music through patient listening, repetition and care.
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}
