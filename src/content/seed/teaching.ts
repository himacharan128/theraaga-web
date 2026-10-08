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

import type { StaticImageData } from 'next/image'
import nookalaPhoto from '@/assets/gurus/nookala.jpg'
import bhasuriCover from '@/assets/books/bhasuri.jpg'
import swararagaCover from '@/assets/books/swararaga-kadambam.jpg'

export interface LineageReference {
  order: number
  name: string
  honorific?: string
  /** One owner-approved line about the maestro. Client facts only. */
  note?: string
  /**
   * Portrait, imported statically so next/image gets its intrinsic size and a
   * blur placeholder. Optional: an entry without one renders as a finished
   * text card. Usage rights for the photographs are unconfirmed; to drop them,
   * remove the import, this field and the `photo` line below.
   */
  photo?: StaticImageData
}

export interface ScholarlyWork {
  order: number
  title: string
  note: string
  /**
   * Cover image, imported statically so next/image gets its intrinsic size.
   * Optional: a book without a cover renders as a finished text entry.
   */
  cover?: StaticImageData
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
    note: 'A revered maestro of Carnatic Sangeetham, honoured with the Padma Bhushan, one of India’s highest civilian awards.',
    photo: nookalaPhoto,
  },
]

export const scholarlyWorks: ScholarlyWork[] = [
  {
    order: 1,
    title: 'Swararaga Kadambam',
    note: 'Authored by our Gurus.',
    cover: swararagaCover,
  },
  {
    order: 2,
    title: 'Bhasuri',
    note: 'Authored by our Gurus.',
    cover: bhasuriCover,
  },
]

export const teachingPrinciples: TeachingPrinciple[] = [
  {
    order: 1,
    title: 'The Guru-Shishya Parampara',
    body: 'Carnatic Sangeetham passes from teacher to student by ear and by repetition: a phrase sung, a phrase returned, corrected, returned again. Almost nothing about that process has needed to change, and we have not changed it.',
  },
  {
    order: 2,
    title: 'A tradition of excellence',
    body: 'Our Gurus were trained under eminent maestros and hold their students to the standards of that tradition: in śruti, in laya, and in the discipline of daily practice.',
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
