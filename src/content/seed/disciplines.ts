import type { Discipline } from '../types'

/**
 * Carnatic vocal only at launch — this matches the client's own poster, which
 * says "Traditional Carnatic Vocal Music". The keyboard/bhajan list appeared
 * only in an earlier AI-generated layout draft, not in anything the client
 * actually wrote.
 *
 * `planned` disciplines are a data change, never a deploy. Deliberately only
 * THREE of them: listing seven coming-soon instruments from a school with one
 * teacher reads as padding to anyone who counts.
 */
export const disciplines: Discipline[] = [
  {
    slug: 'carnatic-vocal',
    name: 'Carnatic Vocal',
    sanskrit: 'Gāna',
    blurb:
      'The core of the school. From your first Sarali Varisai to raga alapana and your own manodharma, taught in the traditional order, by ear and one phrase at a time.',
    status: 'active',
    order: 1,
  },
  { slug: 'violin', name: 'Violin', blurb: '', status: 'planned', order: 2 },
  { slug: 'veena', name: 'Veena', blurb: '', status: 'planned', order: 3 },
  { slug: 'mridangam', name: 'Mridangam', blurb: '', status: 'planned', order: 4 },
]
