import type { Pillar } from '../types'

/**
 * Four, not six.
 *
 * Five of the client's six original draft pillars appeared near-verbatim on
 * Shankar Mahadevan Academy's homepage — "Performance Opportunities" was
 * word-for-word identical, and "All Age Groups Welcome" mirrored their "for all
 * age groups". A differentiator your largest competitor already prints is not a
 * differentiator, so all of them were rewritten.
 *
 * These four are things the school can actually stand behind on day one, with
 * no client data: how it teaches, how closely, in what order, and where that
 * order can lead.
 */
export const pillars: Pillar[] = [
  {
    order: 1,
    title: 'Authentic Carnatic training',
    body: 'Taught in the Guru Shishya Parampara, by ear, by repetition and one phrase at a time. Not a syllabus invented for a website.',
  },
  {
    order: 2,
    title: 'Individual attention',
    body: 'Every voice settles at its own pace. Students are taught individually within small batches, so the teaching follows the learner.',
  },
  {
    order: 3,
    title: 'Traditional progression',
    body: 'Sarali Swaras through to Manodharma Sangeetham, published in full, so you always know which stage you are at and what comes next.',
  },
  {
    order: 4,
    title: 'Performance and academic pathways',
    body: 'Kutcheris, recitals and recordings for those who want the stage. Certificate, Diploma and degree preparation for those who want a qualification.',
  },
]
