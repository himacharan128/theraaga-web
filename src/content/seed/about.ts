import type { Tenet } from '../types'

/**
 * About — Parampara.
 *
 * The story paragraph and both statements below are the CLIENT'S OWN WORDS from
 * their content master, lightly split for web readability. Do not rewrite them
 * for tone: this is the one page where the school's self-description has to be
 * theirs rather than ours.
 */
export const story = [
  'RAAGA was founded in 2016 in Jubilee Hills, Hyderabad, to preserve, nurture and share the timeless tradition of Carnatic Sangeetham.',
  'Rooted in the Guru-Shishya Parampara, RAAGA guides every student with patience, discipline and devotion.',
  'Today RAAGA serves students through its centres at Jubilee Hills and Phoenix Arena, Hitech City, and through online learning across the world.',
]

export const vision =
  'To preserve and promote the rich heritage of Carnatic Sangeetham while inspiring future generations.'

/**
 * The client supplied five mission headings as bare phrases. The headings are
 * theirs verbatim; the single supporting line under each says only what the
 * heading already claims, so nothing is asserted that they did not.
 */
export const mission: Tenet[] = [
  {
    order: 1,
    title: 'Authentic Carnatic education',
    body: 'Taught in the traditional order, without shortcuts or simplification.',
  },
  {
    order: 2,
    title: 'Guru-Shishya Parampara',
    body: 'Learning passed directly from teacher to student, by ear and by repetition.',
  },
  {
    order: 3,
    title: 'Lifelong love for Sangeetham',
    body: 'Music experienced over a lifetime rather than consumed in moments.',
  },
  {
    order: 4,
    title: 'Confident performers',
    body: 'Students prepared to sit on a stage and sing, not only to practise.',
  },
  {
    order: 5,
    title: 'Accessible learning',
    body: 'Two centres in Hyderabad, live online classes, and teaching hosted within communities.',
  },
]
