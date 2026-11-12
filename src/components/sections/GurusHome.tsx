import Image from 'next/image'
import Link from 'next/link'
import { Section } from '@/components/layout/Section'
import { Arrow } from '@/components/ui/Button'
import { getGurusIntro, getLineageReferences, getScholarlyWorks } from '@/data/content'

/**
 * The Gurus, on the homepage: the client's own paragraph verbatim, the lineage
 * reference in a brass oval, and the two books. It says what the Gurus page
 * says and no more; in particular nothing here attaches a maestro to a
 * specific Guru (see content/seed/teaching.ts).
 */
export async function GurusHome() {
  const [intro, lineage, works] = await Promise.all([
    getGurusIntro(),
    getLineageReferences(),
    getScholarlyWorks(),
  ])
  const maestro = lineage.find((l) => l.photo) ?? lineage[0]

  return (
    <Section
      id="gurus"
      tone="paper"
      eyebrow="Guru Parampara · The Gurus"
      title="Taught by musicians, scholars and authors."
      renderIf={intro.length > 0}
      className="border-y border-line"
    >
      <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-10">
        {maestro && (
          <figure className="reveal mx-auto w-full max-w-44 text-center md:col-span-4 md:max-w-64">
            {maestro.photo && (
              <div className="oval">
                <div className="media relative h-50 md:h-auto md:aspect-[4/5]">
                  <Image
                    src={maestro.photo}
                    alt={`Portrait of ${maestro.honorific ? `${maestro.honorific} ` : ''}${maestro.name}`}
                    fill
                    sizes="(min-width: 768px) 260px, 170px"
                    quality={65}
                    placeholder="blur"
                    className="object-cover object-top"
                  />
                </div>
              </div>
            )}
            <figcaption className="t-small mt-4 text-fg-3">
              <span className="t-label block text-accent-muted">Lineage reference</span>
              <span className="mt-1 block font-display text-lg font-medium leading-tight text-fg">
                {maestro.honorific && `${maestro.honorific} `}
                {maestro.name}
              </span>
              {maestro.note && <span className="mt-2 block max-w-[30ch] mx-auto">{maestro.note}</span>}
            </figcaption>
          </figure>
        )}

        <div className={`reveal ${maestro ? 'md:col-span-8' : 'md:col-span-12'}`}>
          {intro.map((para) => (
            <p key={para} className="t-standfirst mt-4 max-w-[48ch] text-fg-2 first:mt-0">
              {para}
            </p>
          ))}

          {works.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
              {works.map((w) => (
                <li key={w.order} className="flex max-w-[18rem] items-center gap-3">
                  {w.cover && (
                    <Image
                      src={w.cover}
                      alt={`Cover of ${w.title}`}
                      width={56}
                      height={84}
                      sizes="56px"
                      placeholder="blur"
                      loading="lazy"
                      className="h-auto w-14 border border-line"
                    />
                  )}
                  <span className="block">
                    <span className="block font-display text-base font-medium text-fg">{w.title}</span>
                    <span className="t-meta mt-0.5 block text-fg-3">{w.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}

          <Link href="/gurus" className="link-arrow mt-8">
            Meet the Gurus
            <Arrow />
          </Link>
        </div>
      </div>
    </Section>
  )
}
