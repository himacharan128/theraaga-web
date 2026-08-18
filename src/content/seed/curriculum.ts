import type { AcademicPathway, CurriculumStage, PerformanceStrand } from '../types'

/**
 * Sangeetha Mārgam — the musical journey.
 *
 * Drumeo and Pianote sell an INVENTED "10-Level Method" as their core
 * differentiator. This progression is four centuries old and is the standard
 * order of Carnatic vocal instruction, corroborated by the Carnatic Vocal grade
 * syllabus of the Tamil Nadu Dr. J Jayalalithaa Music and Fine Arts University.
 *
 * It therefore ships COMPLETE with zero client content — the single most
 * valuable page on the site needs nothing from the client to be true.
 *
 * Each stage carries both its traditional name and a plain-English gloss. A
 * parent who has never heard the word "varnam" must still be able to read this
 * page top to bottom and understand what their child will actually be doing.
 *
 * Durations are indicative and vary with practice and age; they are labelled as
 * such wherever they render.
 */
export const curriculum: CurriculumStage[] = [
  {
    order: 1,
    slug: 'sarali-swaras',
    name: 'Sarali Swaras',
    devanagari: 'सरळि स्वर',
    gloss: 'the first exercises',
    body: 'The foundation of everything that follows. The seven swaras, Sa, Ri, Ga, Ma, Pa, Dha and Ni, are sung in ascending and descending order in Mayamalavagowla. This raga is chosen for beginners because its intervals train the voice most evenly.',
    outcome: 'Sing the seven swaras in order, in three speeds, in tune with the tanpura.',
    duration: '~10 weeks',
    tier: 'beginner',
  },
  {
    order: 2,
    slug: 'janta-swaras',
    name: 'Janta Swaras',
    devanagari: 'जण्ट स्वर',
    gloss: 'paired notes',
    body: 'Each swara is doubled: sa-sa, ri-ri and ga-ga. This teaches the voice to strike a note twice with equal weight. This is where breath control and the first stress patterns of Carnatic phrasing are built.',
    outcome: 'Hold two notes cleanly together and keep your place in the tala.',
    duration: '~8 weeks',
    tier: 'beginner',
  },
  {
    order: 3,
    slug: 'alankaras',
    name: 'Alankaras',
    devanagari: 'अलंकार',
    gloss: 'patterns across the seven talas',
    body: 'Fixed melodic patterns are sung across the sapta tala, the seven rhythmic cycles. The same phrase is carried through changing time signatures, which is how a student learns to keep tala independently of melody.',
    outcome: 'Sing one phrase through seven rhythmic cycles without losing count.',
    duration: '~10 weeks',
    tier: 'beginner',
  },
  {
    order: 4,
    slug: 'geetams',
    name: 'Geetams',
    devanagari: 'गीतम्',
    gloss: 'your first real songs',
    body: 'The first compositions with lyrics are simple and continuous, without the sectional repetition of later forms. A geetam is the moment exercises become music, and most students remember their first one for life.',
    outcome: 'Sing a complete composition with words, from memory.',
    duration: '~8 weeks',
    tier: 'beginner',
  },
  {
    order: 5,
    slug: 'swarapallavis',
    name: 'Swarapallavis',
    devanagari: 'स्वरपल्लवि',
    gloss: 'short melodic sentences',
    body: 'Brief pallavi-like passages set to swaras, sung as a bridge between the geetam and more structured forms. They introduce the idea of a melodic line that returns and resolves.',
    outcome: 'Shape a short melodic phrase and bring it back to its resting note.',
    duration: '~6 weeks',
    tier: 'intermediate',
  },
  {
    order: 6,
    slug: 'swarajatis',
    name: 'Swarajatis',
    devanagari: 'स्वरजति',
    gloss: 'songs with structure',
    body: 'The first compositions are built in distinct sections: pallavi, anupallavi and charanam. A swarajati moves between passages sung in swaras and passages sung in lyrics, which is the architecture every later form uses.',
    outcome: 'Move between swaras and lyrics inside a single piece.',
    duration: '~8 weeks',
    tier: 'intermediate',
  },
  {
    order: 7,
    slug: 'varnams',
    name: 'Varnams',
    devanagari: 'वर्णम्',
    gloss: 'the athlete’s stage',
    body: 'The most demanding technical form in the repertoire, and the one that concentrates the characteristic phrases of a raga into a single composition. A varnam is sung in two speeds and is traditionally how a kutcheri opens.',
    outcome: 'Sing a varnam in two speeds. This is where a voice becomes a trained voice.',
    duration: '~1 year',
    tier: 'intermediate',
  },
  {
    order: 8,
    slug: 'keertanas',
    name: 'Keertanas',
    devanagari: 'कीर्तन',
    gloss: 'devotional compositions',
    body: 'Melodically direct compositions in which the words carry the weight. They include devotional repertoire by Annamacharya, Bhadrachala Ramadasu and Purandara Dasa. Keertanas train diction, meaning and expression rather than ornament.',
    outcome: 'Sing with clear diction and let the meaning of the text shape the line.',
    duration: 'ongoing',
    tier: 'intermediate',
  },
  {
    order: 9,
    slug: 'kritis',
    name: 'Kritis',
    devanagari: 'कृति',
    gloss: 'the concert repertoire',
    body: 'The central form of Carnatic music, and the body of work left by the Trinity: Tyagaraja, Muthuswami Dikshitar and Syama Sastri. A kriti carries the full weight of a raga alongside sangatis, the successive variations that unfold a single line.',
    outcome: 'Hold a kriti with its sangatis. This is the music a kutcheri is actually made of.',
    duration: 'ongoing',
    tier: 'advanced',
  },
  {
    order: 10,
    slug: 'manodharma-sangeetham',
    name: 'Manodharma Sangeetham',
    devanagari: 'मनोधर्म संगीतम्',
    gloss: 'your own imagination',
    body: 'The improvised half of Carnatic music, and the point of everything before it. Raga alapana explores a raga without rhythm; niraval reshapes a single line of text; kalpana swaram improvises in swaras against the tala.',
    outcome: 'Improvise within a raga. The music stops being borrowed and becomes yours.',
    duration: 'a lifetime',
    tier: 'advanced',
  },
]

export const CURRICULUM_SOURCE =
  'Stage order follows the standard progression of Carnatic vocal instruction, corroborated by the Carnatic Vocal grade syllabus of the Tamil Nadu Dr. J Jayalalithaa Music and Fine Arts University. Durations are indicative and vary with practice.'

/**
 * Vidwat Pātham — for students who want the qualification as well as the music.
 * Named only; we do not state which body confers them until the client confirms
 * the affiliations, because an unearned accreditation claim is the single most
 * damaging thing a school can publish.
 */
export const academicPathways: AcademicPathway[] = [
  {
    order: 1,
    name: 'Certificate Course',
    body: 'A structured first qualification for students who want their learning formally recognised alongside regular class work.',
  },
  {
    order: 2,
    name: 'Diploma',
    body: 'A longer programme for students who have completed the foundational stages and want to study the repertoire in depth.',
  },
  {
    order: 3,
    name: 'B.A. Music',
    body: 'Preparation and guidance for students pursuing an undergraduate degree in music.',
  },
  {
    order: 4,
    name: 'M.A. Music',
    body: 'Advanced guidance for postgraduate study, for students moving towards teaching, research or performance as a career.',
  },
]

/**
 * Kala Pradarśanam. A student who has performed once practises differently
 * forever — which is why this is a strand of the teaching, not an extra.
 */
export const performanceStrands: PerformanceStrand[] = [
  {
    order: 1,
    name: 'Individual kutcheris',
    body: 'Solo concert opportunities, in the traditional kutcheri format.',
  },
  {
    order: 2,
    name: 'Group concerts',
    body: 'Ensemble performances where students learn to listen and hold a line together.',
  },
  {
    order: 3,
    name: 'Thematic presentations',
    body: 'Programmes built around a composer, a raga or a devotional tradition.',
  },
  {
    order: 4,
    name: 'Cultural festivals',
    body: 'Performances at wider cultural and seasonal music events.',
  },
  {
    order: 5,
    name: 'Annual student recitals',
    body: 'The yearly occasion for every student to perform what they have prepared.',
  },
  {
    order: 6,
    name: 'Studio recordings and digital performances',
    body: 'Recorded work, so students build something they can keep and share.',
  },
]
