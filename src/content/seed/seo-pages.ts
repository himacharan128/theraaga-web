import type { SeoLandingPage } from '../types'

/**
 * RAAGA's focused SEO hub. These pages are intentionally few: each answers a
 * different decision a learner or parent is making, using claims already
 * supported by the school's published curriculum, FAQ and teaching content.
 *
 * Where to learn (centres, online) is deliberately NOT repeated here: the
 * centre pages and the homepage router own location, and every page ends on
 * FinalCta, which owns the trial booking.
 *
 * Do not turn this into a Hyderabad locality grid unless a page has a real,
 * specific reason to exist. Nearby-area terms belong on the physical-centre
 * pages until the client supplies distinct community or travel information.
 */
export const seoLandingPages: SeoLandingPage[] = [
  {
    slug: 'beginners',
    title: 'Beginner Carnatic Music Classes in Hyderabad',
    description:
      'Start Carnatic singing at RAAGA in Hyderabad or live online. Learn what beginners study, how practice works and what to ask before booking a trial.',
    eyebrow: 'For first-time learners',
    h1: 'Carnatic music classes for beginners.',
    intro:
      'Looking for beginner Carnatic music or sangeetham classes in Hyderabad? RAAGA teaches vocal music from the first swaras, with no earlier musical training expected. Children and adults begin by listening, matching pitch and keeping a steady rhythm.',
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
        body: 'The early path moves through Sarali Swaras, Janta Swaras and Alankaras. These note patterns develop shruti, or pitch, and laya, or rhythm. Geetams bring those skills together in the first complete compositions. Progress depends on how securely a student can sing each stage, not on finishing a fixed number of lessons.',
      },
      {
        title: 'What to practise between classes',
        body: 'Return to the exercises your teacher has corrected, listening for steady pitch and an even beat. A short practice routine that you can repeat matters more than trying to learn several new songs at once. Ask your teacher what to repeat and what to listen for before moving to the next exercise.',
      },
      {
        title: 'What to ask at your first class',
        body: 'Tell us whether you are learning for yourself or enquiring as a parent, and whether in-person or online lessons suit you. Use the trial to understand how the teacher listens and corrects, how a batch is matched to your level, and what regular attendance would involve. Confirm current timings with the team before making a plan.',
      },
    ],
    related: [
      { label: 'See the full Carnatic curriculum', href: '/learning' },
      { label: 'Carnatic classes for children', href: '/carnatic-music-classes/children' },
      { label: 'Carnatic classes for adults', href: '/carnatic-music-classes/adults' },
      { label: 'Plan your first class', href: '/getting-started' },
      { label: 'Practising Carnatic music at home', href: '/guides/practising-carnatic-music-at-home' },
    ],
  },
  {
    slug: 'children',
    title: 'Carnatic Music Classes for Kids in Hyderabad',
    description:
      'Carnatic singing classes for children from five in Hyderabad. Explore small-group learning, language questions, practice and a first class at RAAGA.',
    eyebrow: 'For young learners',
    h1: 'Carnatic music classes for children.',
    intro:
      'RAAGA welcomes children from five to Carnatic vocal classes in Hyderabad and live online. Lessons begin with short swara exercises, listening and rhythm. A first class helps a parent understand the teaching and whether their child is ready for regular lessons.',
    highlights: [
      {
        title: 'Small batches',
        body: 'A maximum of six students means every child sings directly to the teacher during class and receives individual correction.',
      },
      {
        title: 'Music before language',
        body: 'Children do not need Telugu, Sanskrit or Tamil to begin. Lessons start with swaras; when compositions are introduced, their meaning is taught alongside the music.',
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
        title: 'How a parent can support practice',
        body: 'Make room for a regular practice routine using the exercises covered in class. You do not need to teach the music yourself: ask the Guru which phrases need repetition and what your child should listen for. Notice steadier pitch, rhythm and attention, rather than counting how many songs have been completed.',
      },
      {
        title: 'Choosing a class your child can attend regularly',
        body: 'Consider the journey from school or home, the available class timings and whether a centre or live online learning fits your family. Discuss your child’s broad age group and any earlier music learning with the team. When enquiring online, provide your own contact details as the parent or guardian, not your child’s name or date of birth.',
      },
    ],
    related: [
      { label: 'Beginner Carnatic music classes', href: '/carnatic-music-classes/beginners' },
      { label: 'Classes at Jubilee Hills', href: '/music-classes/jubilee-hills' },
      { label: 'Classes at Hitech City', href: '/music-classes/hitech-city' },
      { label: 'What to know before joining', href: '/getting-started' },
      { label: 'Choosing singing classes in Hyderabad', href: '/guides/choosing-singing-classes-hyderabad' },
    ],
  },
  {
    slug: 'adults',
    title: 'Carnatic Music Classes for Adults in Hyderabad',
    description:
      'Start or return to Carnatic singing with RAAGA in Hyderabad or online. Adult batches, traditional vocal training and guidance on finding your starting point.',
    eyebrow: 'For adult beginners and returners',
    h1: 'Carnatic music classes for adults.',
    intro:
      'You can begin Carnatic singing as an adult without earlier vocal training. RAAGA teaches first-time learners and adults returning after a break, at its Hyderabad centres and live online. The starting point depends on your current singing, not your age.',
    highlights: [
      {
        title: 'Start from zero',
        body: 'No earlier vocal training is required. The first exercises build the pitch, rhythm and listening habits that make later repertoire possible.',
      },
      {
        title: 'Learn with your own cohort',
        body: 'Adult learners are taught separately from young children, so the room has the right pace and space for an adult beginner.',
      },
    ],
    sections: [
      {
        title: 'Returning to music after a break',
        body: 'Share which exercises or compositions you learned and what you still feel comfortable singing. Your earlier experience is useful, but revisiting pitch, rhythm or a familiar geetam may be the right first step. Discuss a suitable starting level with the teacher instead of choosing a batch only from the last piece you once learned.',
      },
      {
        title: 'Fitting singing lessons around work',
        body: 'Compare your available time with current class timings, including the journey to a centre and time to practise between lessons. Online classes are another option if travel makes attendance difficult. Ask the team which batches match your level and availability; do not assume that every centre has the same schedule.',
      },
      {
        title: 'What adult Carnatic lessons work towards',
        body: 'Training begins with swaras and tala, then develops through geetams, varnams and kritis towards manodharma, or improvisation. These are stages of study, not a fixed completion timetable. The aim is to sing with a steadier pitch, understand the rhythm and bring meaning to the compositions you learn.',
      },
    ],
    related: [
      { label: 'Beginner Carnatic music classes', href: '/carnatic-music-classes/beginners' },
      { label: 'Online Carnatic music classes', href: '/online-classes' },
      { label: 'The Carnatic syllabus', href: '/learning' },
      { label: 'Plan a trial class', href: '/getting-started' },
      { label: 'Online or in-person lessons?', href: '/guides/online-or-in-person-carnatic-classes' },
    ],
  },
  {
    slug: 'performance-training',
    title: 'Carnatic Vocal Performance Training in Hyderabad',
    description:
      'Prepare for Carnatic vocal performances with RAAGA in Hyderabad. Work on repertoire, rhythm and expression, with opportunities suited to your learning stage.',
    eyebrow: 'Kala Pradarśanam',
    h1: 'Carnatic music performance training.',
    intro:
      'RAAGA prepares Carnatic vocal students in Hyderabad to share their music through individual kutcheris, group concerts and other performances. Preparation starts with the compositions a student can sing securely, then works on expression, continuity and readiness for an audience.',
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
        title: 'Performance opportunities at RAAGA',
        body: 'Students are prepared for individual kutcheris, group concerts, thematic presentations, cultural festivals and annual student recitals. The right opportunity depends on a student’s stage of learning and readiness.',
      },
      {
        title: 'What concert training develops',
        body: 'A performance asks for more than knowing the notes. Students learn to sustain a piece, recover focus, communicate meaning and trust the work they have done in practice.',
      },
      {
        title: 'Are you ready for concert preparation?',
        body: 'Tell the Guru about the repertoire you currently sing and any earlier performance experience. Knowing a composition from memory is one part of readiness; staying in pitch, keeping tala and singing it consistently also matter. Concert preparation follows your learning stage, so a trial or enquiry is not a promise of a performance slot or date.',
      },
    ],
    related: [
      { label: 'See the Carnatic curriculum', href: '/learning' },
      { label: 'Carnatic academic pathways', href: '/carnatic-music-classes/academic-pathways' },
      { label: 'The teaching lineage', href: '/gurus' },
    ],
  },
  {
    slug: 'academic-pathways',
    title: 'Carnatic Music Exam Preparation in Hyderabad',
    description:
      'Carnatic music exam preparation in Hyderabad with RAAGA. Guidance for Certificate, Diploma, B.A. and M.A. Music study, with qualifications awarded externally.',
    eyebrow: 'Vidwat Pātham',
    h1: 'Carnatic music academic pathways.',
    intro:
      'RAAGA provides Carnatic vocal training and exam preparation in Hyderabad for students considering Certificate, Diploma, B.A. Music or M.A. Music study. This is teaching and preparation: the relevant examining body or university awards the qualification, not RAAGA.',
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
        title: 'What to confirm before choosing a qualification',
        body: 'Check the current eligibility, syllabus, application dates and examination arrangements with the relevant institution. Share those details and your existing repertoire with the RAAGA team so the discussion can focus on preparation at the right level. Teaching support does not replace the institution’s admission requirements or guarantee an examination result.',
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
    ],
  },
]
