import Image from 'next/image'
import type { CSSProperties } from 'react'
import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
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
 * COMPOSITION, art-directed separately for each size:
 *
 * - From lg, the words stand on parchment at the left and the photograph hangs
 *   at the right as a tall print, never cropped, pegs to bowl. The school's
 *   line in Sanskrit is set straight into the print's empty dawn sky, like an
 *   inscription, where it covers neither the singer nor the instrument.
 * - On a tablet the print is narrower and the inscription sits beneath it.
 * - On a phone the photograph opens the hero, cropped to a wide frame of the
 *   hand on the tanpura's neck and the singer's face (the old tall crop showed
 *   mostly sky). The Sanskrit line closes the hero as an epigraph.
 *
 * THE PHOTOGRAPH IS ONLY 736px WIDE, so it is never shown much larger than it
 * is: about 470px at most on a desktop, the phone's width on a phone. Do not
 * add a zoom or parallax to it; any scale above 1 shows the softness.
 *
 * LCP. In this layout the photograph is the largest element in the first
 * screen at every size, so it loads first (`preload`). The headline's words
 * are split for their entrance and could never be the LCP element anyway.
 *
 * MOTION, CSS only and once: the photograph is unveiled upward and settles to
 * its true size, the headline's words rise in sequence, then the supporting
 * lines and the label arrive. Nothing loops; all of it stops under reduced
 * motion.
 *
 * The photograph is decorative (`alt=""`): it is a stock-style image of someone
 * with a tanpura, NOT a RAAGA teacher or student, so nothing may caption it as
 * one. The Sanskrit label is the school's line, deliberately not a figcaption.
 */

type Word = { text: string; italic?: boolean; br?: boolean }

const HEADLINE: Word[] = [
  { text: 'A' },
  { text: 'Journey' },
  { text: 'Through' },
  { text: 'the', br: true },
  { text: 'Timeless', italic: true },
  { text: 'Tradition', italic: true, br: true },
  { text: 'of' },
  { text: 'Carnatic' },
  { text: 'Sangeetham' },
]

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

export async function Hero() {
  const site = await getSite()
  const line = site.sanskritLine

  return (
    <section data-section="hero" data-has-content="true" className="relative">
      <div className="u-shell grid md:grid-cols-12 md:items-start md:gap-x-8 md:pt-[clamp(1.5rem,3vw,2.5rem)] md:pb-12 lg:gap-x-10">
        <div className="pt-9 pb-2 md:col-span-7 md:pt-[clamp(1rem,4vh,3rem)]">
          <p className="kicker on-load" style={d(300)}>
            Carnatic Sangeetham · A decade in Hyderabad
          </p>

          {/* On a phone and from lg the headline is set as three deliberate
              lines, the italic phrase alone on the middle one; the size is
              capped so the longest line always fits (see .t-hero-fit and
              --fs-hero). On a tablet's narrow column it wraps freely. */}
          <h1 className="t-hero t-hero-fit mt-5 text-balance text-fg md:mt-7 md:max-w-[13ch] lg:max-w-none">
            {HEADLINE.map((w, i) => (
              <span key={w.text}>
                <span className="word-mask">
                  <span
                    className={w.italic ? 'italic text-kicker' : undefined}
                    style={{ '--i': i } as CSSProperties}
                  >
                    {w.text}
                  </span>
                </span>{' '}
                {w.br && <br className="md:max-lg:hidden" />}
              </span>
            ))}
          </h1>

          <p className="t-standfirst on-load mt-6 max-w-[34ch] text-fg-2 md:mt-8" style={d(820)}>
            Rooted in the Guru-Shishya Parampara, {site.shortName} nurtures music
            with devotion, discipline and sincerity.
          </p>

          <p className="t-body on-load mt-4 max-w-[48ch] text-fg-3" style={d(940)}>
            Carnatic vocal classes for children and adults at our{' '}
            <strong className="font-medium text-fg">Jubilee Hills</strong> and{' '}
            <strong className="font-medium text-fg">Phoenix Arena, Hitech City</strong>{' '}
            centres, <strong className="font-medium text-fg">online</strong> worldwide,
            or hosted in your community. Beginners welcome.
          </p>

          <div className="on-load mt-8 flex flex-col gap-3 xs:flex-row xs:flex-wrap md:mt-10" style={d(1060)}>
            <ButtonLink href="/contact" arrow>
              Begin Your Musical Journey
            </ButtonLink>
            <ButtonLink variant="secondary" href={whatsappHref('HERO')}>
              <WhatsAppIcon />
              Ask on WhatsApp
            </ButtonLink>
          </div>
        </div>

        {/* The print and its inscription. On a phone this wrapper dissolves
            (display: contents) so the photograph can open the hero and the
            inscription close it, without repeating either in the markup. */}
        <div className="max-md:contents md:relative md:col-span-5 md:col-start-8">
          <div
            className="media on-load-unveil relative order-first -mx-[var(--gutter)] aspect-[16/9] sm:aspect-[2/1] md:mx-0 md:aspect-[736/1150]"
            style={d(0)}
          >
            <Image
              src={tambura}
              alt=""
              fill
              preload
              sizes="(min-width: 1280px) 480px, (min-width: 768px) 40vw, 100vw"
              placeholder="blur"
              className="on-load-settle object-cover object-[50%_48%] md:object-center"
              style={d(0)}
            />
          </div>

          {/* The school's line. An epigraph after the buttons on a phone, a
              caption line under the print on a tablet, and from lg an
              inscription set in the print's empty sky. Every lg position is a
              percentage of the uncropped print, so the type keeps clear of the
              tanpura's pegs (which begin 44.8% across) at any width. */}
          <div
            className="on-load order-last mt-12 md:mt-6 lg:absolute lg:top-[6.5%] lg:left-[5%] lg:mt-0 lg:w-[38%]"
            style={d(1300)}
          >
            <p className="kicker lg:before:hidden">The beginning</p>
            <p lang="sa" className="deva mt-4 text-[2.25rem] leading-[1.3] text-fg md:mt-3 md:text-[1.75rem] lg:mt-2 lg:text-[1.375rem] xl:text-[1.75rem]">
              {line.devanagari}
            </p>
            <p className="mt-1 font-display text-[1.125rem] italic text-fg-2 lg:text-[0.875rem] xl:text-[1.0625rem]">
              {line.roman}
            </p>
            <p className="t-small mt-1 max-w-[30ch] text-fg-3 lg:text-[0.75rem] xl:text-[0.8125rem]">{line.gloss}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
