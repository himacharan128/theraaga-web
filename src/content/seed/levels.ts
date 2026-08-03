import type { Level } from '../types'

/**
 * The Sādhana ladder — the highest-value section on the site.
 *
 * Drumeo and Pianote sell an INVENTED "10-Level Method" as their core
 * differentiator. This ladder is four centuries old and was verified against
 * the Tamil Nadu Dr. J Jayalalithaa Music and Fine Arts University 8-grade
 * Carnatic Vocal syllabus, which confirms the ordering:
 *   Grade 1  Sarali · Janta · Melsthayi varisai · Nottuswaram
 *   Grade 2  Dhatu · Keezh-sthayi varisai · Alankaram · Gitam
 *   Grade 3  Lakshana Gitam · Swarajathi · first Adi-tala Varnam · first kriti
 *   Grade 7–8 Kalpana Swaram · Raga Alapana · Kacheri Paddhati
 *
 * It therefore ships COMPLETE with zero client content, and citing the
 * university on the page is the strongest "cultural institution" signal we own.
 *
 * Durations are indicative and sourced from published Carnatic teaching
 * timelines. Every rung also carries a plain Beginner/Intermediate/Advanced
 * badge — every competitor pairs the two, and all aggregator search traffic is
 * keyed on "beginner".
 */
export const levels: Level[] = [
  {
    order: 1,
    slug: 'sarali-varisai',
    sanskrit: 'Sarali Varisai',
    devanagari: 'सरळि वरिसै',
    gloss: 'the first exercises',
    outcome: 'Sing the seven swaras in order, in three speeds, in tune.',
    duration: '~10 weeks',
    tier: 'beginner',
  },
  {
    order: 2,
    slug: 'janta-varisai',
    sanskrit: 'Janta Varisai',
    devanagari: 'जण्ट वरिसै',
    gloss: 'paired notes',
    outcome: 'Hold two notes cleanly together and keep your place in the tala.',
    duration: '~8 weeks',
    tier: 'beginner',
  },
  {
    order: 3,
    slug: 'alankaram',
    sanskrit: 'Alankāram',
    devanagari: 'अलंकारम्',
    gloss: 'patterns across the seven talas',
    outcome: 'Sing the same phrase in seven rhythmic cycles without losing count.',
    duration: '~10 weeks',
    tier: 'beginner',
  },
  {
    order: 4,
    slug: 'geetham',
    sanskrit: 'Gītam',
    devanagari: 'गीतम्',
    gloss: 'your first real songs',
    outcome: 'Sing a complete composition with words, from memory.',
    duration: '~8 weeks',
    tier: 'beginner',
  },
  {
    order: 5,
    slug: 'swarajathi',
    sanskrit: 'Swarajati',
    devanagari: 'स्वरजति',
    gloss: 'songs with structure',
    outcome: 'Move between swaras and lyrics inside one piece.',
    duration: '~8 weeks',
    tier: 'intermediate',
  },
  {
    order: 6,
    slug: 'varnam',
    sanskrit: 'Varṇam',
    devanagari: 'वर्णम्',
    gloss: 'the athlete’s stage',
    outcome:
      'Sing a varnam in two speeds. This is where a voice becomes a trained voice.',
    duration: '~50 weeks',
    tier: 'intermediate',
  },
  {
    order: 7,
    slug: 'kriti',
    sanskrit: 'Kṛti',
    devanagari: 'कृति',
    gloss: 'the concert repertoire',
    outcome:
      'Sing Tyagaraja, Dikshitar and Syama Sastri — the music a kutcheri is made of.',
    duration: '~40 weeks',
    tier: 'advanced',
  },
  {
    order: 8,
    slug: 'manodharma',
    sanskrit: 'Manodharma',
    devanagari: 'मनोधर्म',
    gloss: 'your own imagination',
    outcome:
      'Improvise. Alapana, kalpana swaram, niraval — the music becomes yours.',
    duration: 'ongoing',
    tier: 'advanced',
  },
]

export const LADDER_SOURCE =
  'Stage order follows the Carnatic Vocal grade syllabus of the Tamil Nadu Dr. J Jayalalithaa Music and Fine Arts University. Durations are indicative and vary with practice.'
