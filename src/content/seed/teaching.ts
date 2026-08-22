/**
 * Guru Parampara — the Gurus.
 *
 * WORDING PROVENANCE, and it matters here more than anywhere else on the site.
 *
 * An earlier draft hedged every lineage claim to institutional level ("the
 * school's teaching lineage draws on…") because we had no authority to say the
 * Gurus studied under those maestros. The client's content master makes that
 * claim directly and in their own words — "trained under eminent maestros
 * including…" — so it is theirs to make and it is reproduced as written.
 *
 * Everything below is the client's copy. Do not soften it and do not embellish
 * it. In particular: do not attach a specific maestro to a specific Guru, do
 * not name an award, an institution or a year, and do not put a number on
 * "renowned cultural institutions". The client wrote what they could support.
 */

export interface LineageReference {
  order: number
  name: string
  honorific?: string
}

export interface ScholarlyWork {
  order: number
  title: string
  note: string
}

export interface TeachingPrinciple {
  order: number
  title: string
  body: string
}

/** The client's summary paragraph, split for web readability only. */
export const gurusIntro = [
  'Our Gurus are accomplished musicians, scholars, performers and authors, trained under eminent maestros.',
  'With over two decades of experience, they have served renowned cultural institutions, authored books on Carnatic music, and received numerous State and National honours.',
  'Students are thoughtfully guided to the Guru best suited for their learning journey.',
]

export const lineageReferences: LineageReference[] = [
  {
    order: 1,
    honorific: 'Padma Bhushan Dr.',
    name: 'Nookala Chinna Satyanarayana',
  },
  {
    order: 2,
    honorific: 'Sri',
    name: 'Dwaram Durgaprasada Rao',
  },
]

export const scholarlyWorks: ScholarlyWork[] = [
  {
    order: 1,
    title: 'Swararaga Kadambam',
    note: 'Authored by our Gurus.',
  },
  {
    order: 2,
    title: 'Bhasuri',
    note: 'Authored by our Gurus.',
  },
]

export const teachingPrinciples: TeachingPrinciple[] = [
  {
    order: 1,
    title: 'The Guru–Shishya Parampara',
    body: 'Carnatic Sangeetham is transmitted, not delivered. It passes from teacher to student by ear and by repetition — a phrase sung, a phrase returned, corrected, returned again. Almost nothing about that process has needed to change, and we have not changed it.',
  },
  {
    order: 2,
    title: 'A tradition of excellence',
    body: 'Our Gurus were trained under eminent maestros and hold their students to the standards of that tradition — in śruti, in laya, and in the discipline of daily practice.',
  },
  {
    order: 3,
    title: 'Experience and expertise',
    body: 'Over two decades of teaching and performance across the Carnatic repertoire, from a beginner’s first Sarali Swaras through to Manodharma Sangeetham.',
  },
  {
    order: 4,
    title: 'Personalised guidance',
    body: 'Every voice is different in range, in timbre and in the speed at which it settles. Students are thoughtfully guided to the Guru best suited to their learning journey.',
  },
]
