import { Accordion } from '@/components/ui/Accordion'
import { Section } from '@/components/layout/Section'
import { getFaqs } from '@/data/content'

/**
 * Ten real answers, seeded: the client edits rather than authors.
 *
 * Built from the actual ranked question set (UrbanPro answer titles, Quora,
 * rasikas.org, competitor FAQ pages), with the eight decision-blocking ones
 * ordered first so they are reachable on a phone without hunting.
 *
 * The heading holds a rail at the left on wide screens while the questions
 * scroll past it, so a long list never loses its title.
 *
 * NO FAQPage JSON-LD. Google stopped showing FAQ rich results on 7 May 2026 and
 * removed the documentation on 15 June 2026, so the markup is inert. The
 * content still earns its keep for conversion and for AI answer surfaces,
 * which need no special markup at all.
 */
export async function Faq({
  limit,
  eyebrow = 'Before you ask',
  title = 'Questions parents actually ask.',
  layout = 'rail',
  tone = 'default',
}: {
  /** The homepage shows only the first few decision-blocking questions. */
  limit?: number
  eyebrow?: string
  title?: string
  layout?: 'rail' | 'stack'
  tone?: 'default' | 'paper'
} = {}) {
  const faqs = await getFaqs()
  const ordered = [...faqs]
    .sort((a, b) => Number(b.blocking) - Number(a.blocking) || a.order - b.order)
    .slice(0, limit ?? faqs.length)

  return (
    <Section
      id="faq"
      layout={layout}
      tone={tone}
      eyebrow={eyebrow}
      title={title}
      renderIf={ordered.length > 0}
      className={tone === 'paper' ? 'border-t border-line' : ''}
    >
      <Accordion
        items={ordered.map((f) => ({
          id: f.order,
          question: f.question,
          answer: f.answer,
        }))}
      />
    </Section>
  )
}
