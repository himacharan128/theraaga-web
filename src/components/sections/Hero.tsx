import Image from 'next/image'
import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { whatsappHref } from '@/lib/whatsapp'
import { getSite } from '@/data/content'
import tambura from '@/assets/home/tambura.jpg'

/**
 * Headline, subtitle and the primary button label are the CLIENT'S OWN COPY
 * from their content master. Do not "optimise" them. The secondary button was
 * the client's "Explore RAAGA"; the owner approved changing it to "Ask on
 * WhatsApp" on 2026-10-03 after the site review, because the nav already offers
 * About and WhatsApp is how enquiries actually arrive.
 *
 * One addition, deliberately: a single factual line under the subtitle naming
 * the centres, the ages and that beginners are welcome. The client's hero is
 * evocative but says neither what is taught nor where, and the fold budget is
 * 360 × ~640 CSS px for a parent opening a WhatsApp forward — India's dominant
 * mobile resolution is 360×800 and Android is 92.4% of traffic. The line is
 * additive, never contradictory: brand voice on top, orientation underneath.
 *
 * The LCP element is deliberately the H1 TEXT on flat ivory, not a photograph.
 * On a phone the photo card sits below the buttons, so the photo is NOT
 * `priority`: it is lazy, low fetch-priority, and must never be what the page
 * waits for. It is not the first thing a parent sees, so it must not be the
 * first thing the page spends bytes on. Measured: on a 360x800 phone the text
 * is the LCP; on taller phones (375x812 and up) the top of the card peeks above
 * the fold and the lazy image can overtake the paragraph as LCP, which is why it
 * is kept to ~9-24 KB of AVIF at phone widths.
 *
 * The right-hand card is a photograph with the Sanskrit line set over a maroon
 * fade. The photograph is decorative (`alt=""`): the text carries the meaning,
 * and it is a stock-style image of someone with a tambura, NOT a RAAGA teacher
 * or student, so nothing may caption it as one. The card's maroon ground and
 * fade stay in place under it, so if the image ever fails to load the text
 * keeps its contrast and the card still reads as a designed panel.
 */
export async function Hero() {
  const site = await getSite()

  return (
    <section
      data-section="hero"
      data-has-content="true"
      className="relative overflow-hidden border-b border-border"
    >
      <div className="u-shell relative grid items-center gap-10 py-8 sm:py-12 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-16 xl:py-24">
        <div className="relative z-10">
          {/* Three ideas in one pill wrapped it onto two lines, which left the
              dot floating at the top-left of a box instead of centred on a
              line. Two ideas, no chrome, one line. */}
          <p className="u-eyebrow">
            Carnatic Sangeetham · A decade in Hyderabad
          </p>

          {/* One step down on small screens. At 390px the step-4 clamp resolves
              to ~42px, which pushed the primary CTA below the fold — fatal when
              the dominant arrival is a WhatsApp forward with ten seconds of
              patience. */}
          {/* The client's headline runs to nine words, so it steps down twice on
              small screens. At step-5 it alone consumed the whole 360×640 fold
              and pushed both buttons out of view. */}
          {/* Set at step-4 rather than step-5 on desktop. At step-5 the nine
              words broke to five lines and stranded "Through" and "Tradition"
              each alone — the rag was the loudest thing on the page. At this
              size it falls to three lines with the italic phrase carried whole,
              which is a deliberate typographic moment instead of an accident. */}
          <h1 className="mt-5 max-w-[20ch] text-[length:var(--text-step-3)] font-[300] sm:text-[length:var(--text-step-4)]">
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
          <p className="u-measure mt-4 text-[length:var(--text-step-0)] leading-[var(--lh-body)] text-text-secondary">
            Carnatic vocal classes for children and adults at our{' '}
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
            <ButtonLink variant="secondary" href={whatsappHref('HERO')}>
              <WhatsAppIcon />
              Ask on WhatsApp
            </ButtonLink>
          </div>
        </div>

        <aside className="relative z-10 mx-auto flex min-h-[34rem] lg:min-h-[19rem] w-full max-w-md flex-col justify-end overflow-hidden rounded-[var(--radius-lg)] lg:my-2 lg:max-w-none bg-[linear-gradient(145deg,#7a2934,#511721)] p-7 text-on-accent shadow-[var(--shadow-lift)] sm:p-9 lg:max-w-none">
          {/* The tall tambura is the subject, so the crop is anchored to keep
              her face and the neck in view; the maroon fade below takes the
              lower part of the frame, which is the bowl and the sand. The orbit
              rings and tanpura strings that used to sit here were cut: over a
              photograph of a real tambura they competed with its own strings. */}
          <Image
            src={tambura}
            alt=""
            fill
            sizes="(min-width: 1280px) 520px, (min-width: 1024px) 45vw, min(448px, 90vw)"
            placeholder="blur"
            fetchPriority="low"
            className="object-cover object-[50%_78%]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-accent)_14%,transparent)] bg-[linear-gradient(to_top,#511721_0%,rgba(81,23,33,0.97)_32%,rgba(81,23,33,0.85)_40%,rgba(81,23,33,0.6)_47%,rgba(81,23,33,0.32)_54%,rgba(81,23,33,0)_62%)]"
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
    </section>
  )
}
