/**
 * Guru Parampara — the institutional teaching content.
 *
 * WORDING RULE, and it is a legal one as much as an editorial one.
 * The lineage names below are references the SCHOOL's teaching tradition draws
 * on. Nothing here may be phrased so as to imply that a named maestro
 * personally taught a specific current teacher — that is a claim only the
 * client can make, and only if it is true. Every string is therefore written at
 * institutional level ("the school's teaching lineage draws on…"), never
 * "our guru studied under…".
 *
 * Individual teacher profiles live in `faculty` and are deliberately empty
 * until the client supplies real names, bios and portraits.
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

/**
 * TIER 1: the client should confirm the exact relationship to each name before
 * we add any biographical detail. Until then we list them as what they
 * verifiably are — references the tradition draws on.
 */
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
    note: 'A contribution to Carnatic musical scholarship.',
  },
  {
    order: 2,
    title: 'Bhasuri',
    note: 'A contribution to Carnatic musical scholarship.',
  },
]

export const teachingPrinciples: TeachingPrinciple[] = [
  {
    order: 1,
    title: 'The Guru–Shishya Parampara',
    body: 'Carnatic music is transmitted, not delivered. It passes from teacher to student by ear and by repetition. A phrase is sung, returned, corrected and returned again. Almost nothing about that process has needed to change, and we have not changed it.',
  },
  {
    order: 2,
    title: 'A tradition of excellence',
    body: 'The school’s teaching draws on a lineage of distinguished Carnatic musicians and scholars, and holds its students to the standards of that tradition in intonation, rhythm and the discipline of daily practice.',
  },
  {
    order: 3,
    title: 'Experience and expertise',
    body: 'Teaching here has been shaped by years of performance and instruction across the Carnatic repertoire, from a beginner’s first Sarali Swaras through to Manodharma Sangeetham.',
  },
  {
    order: 4,
    title: 'Personalised guidance',
    body: 'Every voice is different in range, in timbre and in the speed at which it settles. Students are taught individually within small batches, so the pace follows the learner rather than the syllabus.',
  },
]
