import Image from 'next/image'
import type { CSSProperties } from 'react'
import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { WhatsAppLink } from '@/components/ui/WhatsAppLink'
import { getSite } from '@/data/content'
import saraswati from '@/assets/home/saraswati-carving.jpg'

/**
 * The maroon chapter that opens the site: the programme cover of a kutcheri.
 *
 * Headline, subtitle and the primary button label are the CLIENT'S OWN COPY
 * from their content master. Do not "optimise" them. The secondary button was
 * approved as "Ask on WhatsApp" on 2026-10-03. The one added line under the
 * subtitle names the centres, the ages and that beginners are welcome, because
 * the client's hero says neither what is taught nor where, and the visitor is
 * a parent opening a WhatsApp forward on a 360px phone.
 *
 * COMPOSITION. The words stand on the deep maroon at the left; the carving
 * stands in a brass-lined temple niche at the right, with the school's line in
 * Sanskrit inscribed above it. On a phone the niche follows the buttons. A
 * zari border closes the chapter above and below.
 *
 * The chapter declares `data-hero-tone="maroon"` so the header takes the
 * maroon ink on the very first paint, before its observer has run.
 *
 * THE PRINT IS 1188px WIDE and is never shown larger than 300px here, cropped
 * to the goddess's face and the hands on the veena.
 *
 * The photograph is decorative (`alt=""`): an antique wooden relief carving of
 * Saraswati playing the veena, NOT a RAAGA teacher or student, so nothing may
 * caption it as one.
 */

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

export async function Hero() {
  const site = await getSite()
  const line = site.sanskritLine

  return (
    <section
      data-section="hero"
      data-has-content="true"
      data-tone="dark"
      data-hero-tone="maroon"
      className="tone-maroon relative"
    >
      <div aria-hidden="true" className="zari" />
      <div className="u-shell grid gap-y-10 py-9 md:grid-cols-12 md:items-center md:gap-x-10 md:py-[clamp(2.5rem,6vw,5rem)] lg:gap-x-16">
        <div className="md:col-span-7">
          <p className="kicker on-load" style={d(100)}>
            Carnatic Sangeetham · A decade in Hyderabad
          </p>

          <h1 className="t-hero t-hero-fit on-load mt-5 text-balance text-fg md:mt-6" style={d(220)}>
            A Journey Through the <em className="italic text-kicker">Timeless Tradition</em> of
            Carnatic Sangeetham
          </h1>

          <p className="t-standfirst on-load mt-6 max-w-[34ch] text-fg md:mt-7" style={d(420)}>
            Rooted in the Guru-Shishya Parampara, {site.shortName} nurtures music
            with devotion, discipline and sincerity.
          </p>

          <p className="t-body on-load mt-4 max-w-[48ch] text-fg-2" style={d(520)}>
            Carnatic vocal classes for children and adults at our{' '}
            <strong className="font-medium text-fg">Jubilee Hills</strong> and{' '}
            <strong className="font-medium text-fg">Phoenix Arena, Hitech City</strong>{' '}
            centres, <strong className="font-medium text-fg">online</strong> worldwide,
            or hosted in your community. Beginners welcome.
          </p>

          <div className="on-load mt-8 flex flex-col gap-3 xs:flex-row xs:flex-wrap md:mt-9" style={d(640)}>
            <ButtonLink href="/contact" arrow>
              Begin Your Musical Journey
            </ButtonLink>
            <WhatsAppLink location="hero" className="btn btn-secondary">
              <WhatsAppIcon />
              Ask on WhatsApp
            </WhatsAppLink>
          </div>
        </div>

        {/* The niche: the school's line inscribed above the carving. */}
        <div
          className="on-load w-full max-w-60 justify-self-center text-center md:col-span-5 md:col-start-8 md:max-w-[300px] md:justify-self-end"
          style={d(300)}
        >
          <div className="mb-4">
            <p lang="sa" className="deva text-[1.75rem] leading-snug text-fg">
              {line.devanagari}
            </p>
            <p className="font-display text-base italic text-kicker">{line.roman}</p>
            <p className="t-small mt-0.5 text-fg-2">{line.gloss}</p>
          </div>
          <div className="niche">
            <div className="media relative h-[320px] md:h-[520px]">
              <Image
                src={saraswati}
                alt=""
                fill
                preload
                sizes="(min-width: 768px) 300px, 240px"
                placeholder="blur"
                className="object-cover object-[50%_62%]"
              />
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="zari" />
    </section>
  )
}
