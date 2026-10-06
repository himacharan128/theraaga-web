import Image from 'next/image'
import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { NadaRings, Strings, SwaraMarquee } from '@/components/ui/Ornament'
import { whatsappHref } from '@/lib/whatsapp'
import { getSite } from '@/data/content'
import tambura from '@/assets/home/tambura.jpg'

/**
 * Headline, subtitle and the primary button label are the CLIENT'S OWN COPY
 * from their content master. Do not "optimise" them. The secondary button was
 * approved as "Ask on WhatsApp" on 2026-10-03. The one added line under the
 * subtitle names the centres, the ages and that beginners are welcome, because
 * the client's hero says neither what is taught nor where, and the visitor is
 * a parent opening a WhatsApp forward on a 360px phone.
 *
 * Motion, all CSS: the headline rises word by word, four tanpura strings hum
 * at the left edge, rings of sound leave the headline, the photograph breathes
 * very slowly, and the seven swaras pass along the bottom edge. None of it
 * costs a request or a byte of JavaScript, and all of it stops under
 * prefers-reduced-motion.
 *
 * The LCP element is deliberately the H1 TEXT on flat ivory, not a photograph.
 * On a phone the photo card sits below the buttons, so the photo is NOT
 * `priority`: it is lazy, low fetch-priority, and must never be what the page
 * waits for. The photograph is decorative (`alt=""`): it is a stock-style image
 * of someone with a tambura, NOT a RAAGA teacher or student, so nothing may
 * caption it as one. The card's maroon ground and fade stay in place under it,
 * so if the image ever fails to load the text keeps its contrast.
 */

type Word = { text: string; italic?: boolean }

const HEADLINE: Word[] = [
  { text: 'A' },
  { text: 'Journey' },
  { text: 'Through' },
  { text: 'the' },
  { text: 'Timeless', italic: true },
  { text: 'Tradition', italic: true },
  { text: 'of' },
  { text: 'Carnatic' },
  { text: 'Sangeetham' },
]

const d = (ms: number) => ({ '--d': `${ms}ms` }) as React.CSSProperties

export async function Hero() {
  const site = await getSite()

  return (
    <section
      data-section="hero"
      data-has-content="true"
      className="relative overflow-hidden border-b border-border"
    >
      <Strings className="hidden xl:block" />
      <NadaRings className="left-[26%] top-[46%]" size="52rem" />

      <div className="u-shell relative grid items-center gap-10 py-10 sm:py-14 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-16 xl:py-24">
        <div className="relative z-10">
          <p className="u-eyebrow fade-in" style={d(0)}>
            Carnatic Sangeetham · A decade in Hyderabad
          </p>

          <h1 className="mt-6 max-w-[20ch] text-[length:var(--text-step-3)] font-[300] sm:text-[length:var(--text-step-4)]">
            {HEADLINE.map((w, i) => (
              <span key={i} className="rise-line mr-[0.24em]">
                <span
                  className={`rise-word ${w.italic ? 'italic text-accent' : ''}`}
                  style={{ '--i': i } as React.CSSProperties}
                >
                  {w.text}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="fade-in u-measure mt-6 text-[length:var(--text-step-0)] font-[300] leading-[var(--lh-snug)] text-text-secondary sm:text-[length:var(--text-step-1)]"
            style={d(700)}
          >
            Rooted in the Guru–Shishya Parampara, {site.shortName} nurtures music
            with devotion, discipline and sincerity.
          </p>

          <p
            className="fade-in u-measure mt-4 text-[length:var(--text-step-0)] leading-[var(--lh-body)] text-text-secondary"
            style={d(900)}
          >
            Carnatic vocal classes for children and adults at our{' '}
            <strong className="font-[400] text-text-primary">Jubilee Hills</strong> and{' '}
            <strong className="font-[400] text-text-primary">Phoenix Arena, Hitech City</strong>{' '}
            centres, <strong className="font-[400] text-text-primary">online</strong> worldwide,
            or hosted in your community. Beginners welcome.
          </p>

          <div className="fade-in mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row" style={d(1100)}>
            <ButtonLink href="/contact">Begin Your Musical Journey</ButtonLink>
            <ButtonLink variant="secondary" href={whatsappHref('HERO')}>
              <WhatsAppIcon />
              Ask on WhatsApp
            </ButtonLink>
          </div>
        </div>

        <aside
          className="fade-in relative z-10 mx-auto flex min-h-[34rem] w-full max-w-md flex-col justify-end overflow-hidden rounded-[var(--radius-md)] bg-accent-deep p-7 text-on-accent sm:p-9 lg:my-2 lg:min-h-[19rem] lg:max-w-none"
          style={d(500)}
        >
          <Image
            src={tambura}
            alt=""
            fill
            sizes="(min-width: 1280px) 520px, (min-width: 1024px) 45vw, min(448px, 90vw)"
            placeholder="blur"
            fetchPriority="low"
            className="ken object-cover object-[50%_78%]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_top,#612a2c_0%,rgba(97,42,44,0.97)_32%,rgba(97,42,44,0.85)_40%,rgba(97,42,44,0.6)_47%,rgba(97,42,44,0.32)_54%,rgba(97,42,44,0)_62%)]"
          />
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

      <div className="relative z-10 border-t border-border py-3">
        <SwaraMarquee />
      </div>
    </section>
  )
}
