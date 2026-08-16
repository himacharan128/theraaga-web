import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { AscendingScale } from '@/components/ui/Ornament'
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
      className="border-b border-border"
    >
      <div className="u-shell grid items-center gap-12 py-10 sm:py-14 md:py-24 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <div>
          <p className="u-eyebrow">
            Nāda · Carnatic vocal · Hyderabad since {site.foundedYear}
          </p>

          {/* One step down on small screens. At 390px the step-4 clamp resolves
              to ~42px, which pushed the primary CTA below the fold — fatal when
              the dominant arrival is a WhatsApp forward with ten seconds of
              patience. */}
          <h1 className="mt-4 text-[length:var(--text-step-3)] font-[300] sm:mt-5 sm:text-[length:var(--text-step-4)]">
            Carnatic vocal classes for children and adults in Hyderabad.
          </h1>

          <p className="u-measure mt-5 text-[length:var(--text-step-0)] font-[300] leading-[var(--lh-snug)] text-text-secondary sm:mt-6 sm:text-[length:var(--text-step-1)]">
            At our{' '}
            <strong className="font-[400] text-text-primary">Jubilee Hills</strong>{' '}
            and{' '}
            <strong className="font-[400] text-text-primary">
              Phoenix Arena, Hitech City
            </strong>{' '}
            centres, or{' '}
            <strong className="font-[400] text-text-primary">online</strong>{' '}
            from anywhere in the world. Beginners are welcome — most students
            start with no training at all.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row">
            <ButtonLink href="/contact">Book a free trial</ButtonLink>
            <ButtonLink variant="secondary" href={whatsappHref('HERO')}>
              <WhatsAppIcon />
              Ask on WhatsApp
            </ButtonLink>
          </div>

          <p className="mt-4 font-[var(--font-ui)] text-[length:var(--text-step--1)] text-text-muted">
            A free first class, so you can see how we teach before deciding.
          </p>
        </div>

        {/* Typographic composition — the seven swaras, which is what the whole
            school is built on. Zero payload, no asset dependency, and it says
            something true about the subject rather than filling a hole. */}
        <aside
          aria-hidden="true"
          className="hidden border border-border bg-surface px-8 py-14 text-center lg:block"
        >
          <p className="deva text-[length:var(--text-step-5)] leading-[1.15] text-accent">
            सा&nbsp;रि&nbsp;ग&nbsp;म
            <br />
            प&nbsp;ध&nbsp;नि
          </p>
          <div className="mt-10">
            <AscendingScale />
          </div>
          <p className="mt-8 font-[var(--font-display)] text-[length:var(--text-step-0)] font-[300] italic leading-[var(--lh-snug)] text-text-muted">
            Seven notes. Everything else
            <br />
            is what you do with them.
          </p>
        </aside>
      </div>
    </section>
  )
}
