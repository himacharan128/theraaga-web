import type { SeoLandingPage } from '../types'

/**
 * RAGA's focused SEO hub. These pages are intentionally few: each answers a
 * different decision a learner or parent is making, using claims already
 * supported by the school's published curriculum, FAQ and teaching content.
 *
 * Do not turn this into a Hyderabad locality grid unless a page has a real,
 * specific reason to exist. Nearby-area terms belong on the physical-centre
 * pages until the client supplies distinct community or travel information.
 */
export const seoLandingPages: SeoLandingPage[] = [
  {
    slug: 'beginners',
    title: 'Carnatic Music Classes for Beginners',
    description:
      'Begin Carnatic music with RAGA in Hyderabad. Learn swaras, pitch and rhythm from the first lesson at Jubilee Hills, Hitech City or live online.',
    eyebrow: 'For first-time learners',
    h1: 'Carnatic music classes for beginners.',
    intro:
      'No musical background is expected. The first lesson begins with the swaras, the seven notes that carry the rest of Carnatic music, and builds from there one phrase at a time.',
    highlights: [
      {
        title: 'Start with the fundamentals',
        body: 'Sarali Swaras develop pitch, rhythm and a steady voice before a student is asked to carry a full composition.',
      },
      {
        title: 'No language background needed',
        body: 'Early learning is built around swaras. When lyrics arrive, the meaning is taught alongside the music, line by line.',
      },
      {
        title: 'Try a complete first class',
        body: 'A trial lets you see how the teaching works before deciding on the right centre or online option.',
      },
    ],
    sections: [
      {
        title: 'What a beginner learns first',
        body: 'The early path moves through Sarali Swaras, Janta Swaras and Alankaras. These are not warm-ups to rush through. They build the ear, the sense of tala and the vocal steadiness needed for every later stage.',
      },
      {
        title: 'A pace that respects the learner',
        body: 'Children from five and adults beginning at any age are welcome. Small batches make it possible for the teacher to listen to each student rather than teaching only to the room.',
      },
      {
        title: 'Learn in Hyderabad or live online',
        body: 'Choose RAGA at Jubilee Hills, Phoenix Arena in Hitech City or live online. The traditional progression stays the same in each setting.',
      },
    ],
    related: [
      { label: 'See the full Carnatic curriculum', href: '/learning' },
      { label: 'Carnatic classes for children', href: '/carnatic-music-classes/children' },
      { label: 'Carnatic classes for adults', href: '/carnatic-music-classes/adults' },
      { label: 'Book a trial class', href: '/contact' },
    ],
  },
  {
    slug: 'children',
    title: 'Carnatic Music Classes for Children',
    description:
      'Carnatic music classes for children from five at RAGA, Hyderabad. Small batches in Jubilee Hills and Hitech City, plus live online learning.',
    eyebrow: 'For young learners',
    h1: 'Carnatic music classes for children.',
    intro:
      'RAGA welcomes children from five, when most are ready to sit, listen and match a pitch. Learning starts with short, repeatable swara exercises and grows gradually into music, rhythm and confidence.',
    highlights: [
      {
        title: 'Small batches',
        body: 'A maximum of six students means every child sings directly to the teacher during class and receives individual correction.',
      },
      {
        title: 'Music before language',
        body: 'Children do not need Telugu, Sanskrit or Tamil to begin. The first year begins with swaras, then introduces composition meanings carefully.',
      },
      {
        title: 'A long view of learning',
        body: 'The aim is not a rushed song for the next stage programme. It is an ear, a voice and a lasting relationship with Carnatic music.',
      },
    ],
    sections: [
      {
        title: 'How children begin',
        body: 'The first stage is Sarali Swaras: simple ascending and descending note patterns that help a child hear and reproduce pitch. Repetition is made musical, not mechanical, and rhythm is introduced alongside the notes.',
      },
      {
        title: 'What parents can expect',
        body: 'Progress is gradual because Carnatic music is cumulative. A steady weekly class and small amounts of regular practice matter more than trying to move quickly through a syllabus.',
      },
      {
        title: 'Where your child can learn',
        body: 'Classes are available at Jubilee Hills and Phoenix Arena in Hitech City. Live online learning is also available for families outside Hyderabad.',
      },
    ],
    related: [
      { label: 'Beginner Carnatic music classes', href: '/carnatic-music-classes/beginners' },
      { label: 'Classes at Jubilee Hills', href: '/music-classes/jubilee-hills' },
      { label: 'Classes at Hitech City', href: '/music-classes/hitech-city' },
      { label: 'Book a trial class', href: '/contact' },
    ],
  },
  {
    slug: 'adults',
    title: 'Carnatic Music Classes for Adults',
    description:
      'Carnatic music classes for adults in Hyderabad and online. Begin at any age with RAGA, whether you are returning to music or starting from zero.',
    eyebrow: 'For adult beginners and returners',
    h1: 'Carnatic music classes for adults.',
    intro:
      'It is not too late to begin. RAGA teaches adults who are starting for the first time and those returning to music after years away, with the same traditional progression and a pace that makes room for real life.',
    highlights: [
      {
        title: 'Start from zero',
        body: 'No earlier vocal training is required. The first exercises build the pitch, rhythm and listening habits that make later repertoire possible.',
      },
      {
        title: 'Learn with your own cohort',
        body: 'Adult learners are taught separately from young children, so the room has the right pace and space for an adult beginner.',
      },
      {
        title: 'Choose in-person or online',
        body: 'Learn at Jubilee Hills or Hitech City, or join a live online class from outside Hyderabad and across time zones.',
      },
    ],
    sections: [
      {
        title: 'The adult learning advantage',
        body: 'Adults often move efficiently through the early exercises because they can hear patterns, understand structure and practise deliberately. The essential skill is being willing to sound like a beginner while the voice settles.',
      },
      {
        title: 'A traditional journey, not a shortcut',
        body: 'The sequence begins with swaras and tala, then expands into geetams, varnams, kritis and eventually manodharma. Each stage gives the next one a foundation.',
      },
      {
        title: 'Make the first step simple',
        body: 'Book a trial class or ask a question on WhatsApp. We will help you choose the centre or online option that fits your learning goals.',
      },
    ],
    related: [
      { label: 'Beginner Carnatic music classes', href: '/carnatic-music-classes/beginners' },
      { label: 'Online Carnatic music classes', href: '/online-classes' },
      { label: 'The Carnatic syllabus', href: '/learning' },
      { label: 'Book a trial class', href: '/contact' },
    ],
  },
  {
    slug: 'performance-training',
    title: 'Carnatic Music Performance Training',
    description:
      'Carnatic music performance training at RAGA, Hyderabad. Build repertoire, confidence and concert readiness through recitals, group concerts and recordings.',
    eyebrow: 'Kala Pradarśanam',
    h1: 'Carnatic music performance training.',
    intro:
      'Performance is part of the learning journey, not an add-on at the end. RAGA prepares students to share their music with an audience as their repertoire, confidence and musical maturity grow.',
    highlights: [
      {
        title: 'Build towards the stage',
        body: 'Technique, repertoire and expression are developed in class so performance is grounded in the music rather than treated as a one-day event.',
      },
      {
        title: 'Learn to listen in an ensemble',
        body: 'Group concerts ask students to hold their line, listen to others and stay present inside a shared musical experience.',
      },
      {
        title: 'Keep a record of growth',
        body: 'Studio recordings and digital performances give students a way to revisit and share the music they have prepared.',
      },
    ],
    sections: [
      {
        title: 'Performance opportunities at RAGA',
        body: 'Students are prepared for individual kutcheris, group concerts, thematic presentations, cultural festivals and annual student recitals. The right opportunity depends on a student’s stage of learning and readiness.',
      },
      {
        title: 'What concert training develops',
        body: 'A performance asks for more than knowing the notes. Students learn to sustain a piece, recover focus, communicate meaning and trust the work they have done in practice.',
      },
      {
        title: 'The stage rests on the foundation',
        body: 'Concert preparation grows from the same traditional sequence that begins with swaras. The deeper the foundation, the more freely a student can sing in front of an audience.',
      },
    ],
    related: [
      { label: 'See the Carnatic curriculum', href: '/learning' },
      { label: 'Carnatic academic pathways', href: '/carnatic-music-classes/academic-pathways' },
      { label: 'The teaching lineage', href: '/gurus' },
      { label: 'Book a trial class', href: '/contact' },
    ],
  },
  {
    slug: 'academic-pathways',
    title: 'Carnatic Music Academic Pathways',
    description:
      'Carnatic music academic preparation at RAGA, Hyderabad. Structured guidance for Certificate, Diploma, B.A. Music and M.A. Music pathways.',
    eyebrow: 'Vidwat Pātham',
    h1: 'Carnatic music academic pathways.',
    intro:
      'For students who want a formal music qualification alongside serious practice, RAGA provides structured preparation and guidance through the traditional Carnatic vocal syllabus.',
    highlights: [
      {
        title: 'A structured foundation',
        body: 'The journey from Sarali Swaras through advanced repertoire gives academic study a musical foundation rather than a list of topics to memorise.',
      },
      {
        title: 'Preparation at each level',
        body: 'Guidance is available for Certificate, Diploma, B.A. Music and M.A. Music pathways according to the student’s level and goals.',
      },
      {
        title: 'Music and meaning together',
        body: 'Students study melody, rhythm, expression and lyrical understanding, so formal preparation remains connected to the music itself.',
      },
    ],
    sections: [
      {
        title: 'From regular class to formal study',
        body: 'Academic preparation is built into a student’s musical growth. As technique and repertoire become secure, guidance can be aligned to the stage and qualification a learner wants to pursue.',
      },
      {
        title: 'Qualifications we prepare students for',
        body: 'RAGA guides students preparing for Certificate Course, Diploma, B.A. Music and M.A. Music pathways. The school does not claim to confer these qualifications itself; the right route depends on the relevant examining or university body.',
      },
      {
        title: 'A longer relationship with the art',
        body: 'For students moving towards performance, teaching or research, disciplined study develops the musical vocabulary and cultural understanding needed to continue independently.',
      },
    ],
    related: [
      { label: 'See the full Carnatic syllabus', href: '/learning' },
      { label: 'Carnatic performance training', href: '/carnatic-music-classes/performance-training' },
      { label: 'Carnatic classes for adults', href: '/carnatic-music-classes/adults' },
      { label: 'Book a trial class', href: '/contact' },
    ],
  },
]
