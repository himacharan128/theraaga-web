import type { Pillar } from '../types'

/**
 * Five of the client's six draft pillars appear near-verbatim on Shankar
 * Mahadevan Academy's homepage — "Performance Opportunities" is word-for-word
 * identical, and "All Age Groups Welcome" mirrors their "for all age groups".
 * All six are replaced.
 *
 * The two claims no national player can make are led with: delivery into
 * clubhouses, and a published syllabus with real stage timings.
 */
export const pillars: Pillar[] = [
  {
    order: 1,
    title: 'We come to your community.',
    body: 'Reach six families in your gated community and we teach at your clubhouse — no drop-offs, no traffic, no Sunday morning lost.',
  },
  {
    order: 2,
    title: 'A syllabus you can actually see.',
    body: 'Sarali Varisai to Manodharma, published in full with the time each stage takes, so you always know where your child stands.',
  },
  {
    order: 3,
    title: 'Small enough that no one hides at the back.',
    body: 'Batches are capped at six, and every student sings alone in every class.',
  },
  {
    order: 4,
    title: 'You stay with one teacher.',
    body: 'Not a rotating panel. You learn in a line, the way this music has always been taught.',
  },
  {
    order: 5,
    title: 'No prerequisite — not language, not talent, not age.',
    body: 'Compositions are in Telugu, Sanskrit and Tamil, and we teach the meaning line by line. Beginners at five and beginners at fifty start the same way.',
  },
  {
    order: 6,
    title: 'A stage, every term.',
    body: 'Open Baithak mornings, Sangama workshops and our annual Sangeeta Sandhya. A student who has performed once practises differently forever.',
  },
]
