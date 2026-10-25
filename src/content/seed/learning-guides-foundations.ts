import type { LearningGuide } from './learning-guides'

/**
 * Guides to the music itself, for the questions people put to a search engine
 * or an assistant before they look for a class: where do I start, how is this
 * different from Hindustani, what is a raga.
 *
 * Every factual line here is general musicology checked against the sources
 * each guide cites. Lines about RAAGA say only what the rest of the site
 * already says. No durations, ages or outcomes are promised.
 */
export const foundationGuides: LearningGuide[] = [
  {
    slug: 'carnatic-music-for-beginners',
    published: '2026-10-25',
    updated: '2026-10-25',
    title: 'Carnatic music for beginners: where to start',
    description:
      'What a beginner learns first in Carnatic music, in order: the seven swaras, shruti, tala, Sarali Swaras, alankaras and the first songs.',
    intro:
      'Carnatic music is learnt in an order that has changed little in about five hundred years. A beginner does not start with songs. They start with the seven notes, sung against a drone, in patterns that train the ear, the voice and the sense of rhythm together. This guide explains that order in plain words, so a new student or a parent knows what the first months hold.',
    sections: [
      {
        id: 'the-seven-swaras',
        title: 'The seven swaras',
        paragraphs: [
          'Carnatic music names its notes Sa, Ri, Ga, Ma, Pa, Dha and Ni, together the sapta swaras. Sa and Pa are fixed. The other five can each take more than one position, and which positions a raga uses is part of what makes it that raga.',
          'There is no fixed pitch for Sa. Each singer sings from a Sa that suits their voice, called their shruti, and everything else is sung relative to it. It differs from learner to learner, and the teacher helps each one find a comfortable shruti.',
        ],
      },
      {
        id: 'shruti-and-tala',
        title: 'Singing against a drone, keeping the beat',
        paragraphs: [
          'Practice is done against a drone that sounds Sa and Pa without a break: traditionally a tanpura, now often a shruti box or an app. Singing against it trains the ear to hear when a note is in tune.',
          'Rhythm is kept in tala, a repeating cycle counted on the hand with claps, waves and finger counts. The most common is Adi tala, a cycle of eight beats. Beginners learn to keep the tala while they sing from the first weeks.',
        ],
      },
      {
        id: 'the-first-lessons',
        title: 'The first lessons, in order',
        paragraphs: [
          'The graded beginner lessons go back to Purandara Dasa (c. 1470 to 1564), called the Pitamaha, the grandfather, of Carnatic music. He made Mayamalavagowla the raga for teaching, and most teachers still begin there. The usual order is:',
        ],
        bullets: [
          'Sarali Swaras (Sarali Varisai): the seven notes up and down, in set patterns and in three speeds.',
          'Janta Swaras: each note sung twice, for a clean and even attack.',
          'Dhatu Swaras and the upper and lower octave exercises, which many teachers add here: leaps between notes, and the range above and below the middle octave.',
          'Alankaras: patterns sung through the seven Suladi talas, so the beat is kept while the melody changes.',
          'Geethams: the first songs with words, often beginning with the Pillari Geethams.',
          'Swarajatis and varnams: longer pieces that bridge the exercises and concert music.',
          'Kritis: the main concert form, in pallavi, anupallavi and charanam.',
        ],
      },
      {
        id: 'how-long',
        title: 'How long before songs?',
        paragraphs: [
          'It depends on the learner’s age, how often classes are held and how much they practise between them. RAAGA’s curriculum gives an indicative time for each stage, but treat it as a guide, not a promise. Short, regular practice on the work the teacher has set does more than a long session once a week.',
        ],
      },
      {
        id: 'books-for-beginners',
        title: 'Books for beginners',
        paragraphs: [
          'Bhasuri: A Beginner’s Guide to Carnatic Music, in English, and Swararaga Kadambam, in Telugu, were written by Dr. Suryanarayana Polaki, one of the Gurus at RAAGA. Swararaga Kadambam runs from the Sarali Swaras to the Mangalam and gives word-by-word meanings for the songs.',
          'For theory, the National Institute of Open Schooling publishes free Carnatic music lessons in English. A book supports lessons with a teacher; it does not replace hearing and correcting the voice.',
        ],
      },
      {
        id: 'before-the-first-class',
        title: 'Before the first class',
        paragraphs: ['You do not need to read Western notation, own an instrument or know any ragas. It helps to:'],
        bullets: [
          'Tell the teacher whether the learner is new or has studied before.',
          'Ask which shruti to practise at, and which drone to use at home.',
          'Keep a notebook for the swaras taught in each class.',
          'Ask before recording a lesson.',
        ],
      },
    ],
    related: [
      { label: 'The full Carnatic curriculum, stage by stage', href: '/learning' },
      { label: 'Carnatic classes for beginners', href: '/carnatic-music-classes/beginners' },
      { label: 'Dr. Suryanarayana Polaki and his books', href: '/gurus/suryanarayana-polaki' },
      { label: 'Practising Carnatic music at home', href: '/guides/practising-carnatic-music-at-home' },
    ],
    sources: [
      { label: 'Wikipedia: Purandara Dasa', href: 'https://en.wikipedia.org/wiki/Purandara_Dasa' },
      { label: 'Wikipedia: Carnatic music', href: 'https://en.wikipedia.org/wiki/Carnatic_music' },
      { label: 'NIOS: Carnatic Music learning materials', href: 'https://digital.nios.ac.in/topic.php?id=243en' },
    ],
  },
  {
    slug: 'carnatic-vs-hindustani-music',
    published: '2026-10-25',
    updated: '2026-10-25',
    title: 'Carnatic and Hindustani music: the differences',
    description:
      'How Carnatic and Hindustani classical music differ in history, compositions, ragas, rhythm and instruments, and how to choose which one to learn.',
    intro:
      'India has two classical music traditions. Hindustani music is centred in the north, and Carnatic music in the south, including Telangana and Andhra Pradesh. They share early roots and core ideas such as raga and tala, but they sound different and are taught differently. If you are choosing classes, it helps to know which one you are looking for.',
    sections: [
      {
        id: 'shared-roots',
        title: 'Shared roots, separate paths',
        paragraphs: [
          'Both traditions grow from the same early theory of raga and tala. The separation is usually placed around the 12th and 13th centuries, as music in the north absorbed Persian influences. Sharangadeva’s 13th-century treatise, the Sangita Ratnakara, is often taken to mark the point where the two diverge.',
        ],
      },
      {
        id: 'composition-and-improvisation',
        title: 'Composition and improvisation',
        paragraphs: [
          'Carnatic music is built around composed songs. The kriti, in pallavi, anupallavi and charanam, is the heart of a concert, and much of the repertoire comes from Tyagaraja, Muthuswami Dikshitar and Syama Sastri, the Trinity of the late 18th and early 19th centuries. Improvisation, called manodharma, happens within and around the compositions, as alapana, niraval and kalpanaswaram.',
          'A Hindustani performance gives more of its time to the slow unfolding of a raga, with a short composition, the bandish, as its frame. The main vocal forms are dhrupad and khayal, with lighter forms such as thumri. Styles pass down through gharanas, schools linked to particular families and courts.',
        ],
      },
      {
        id: 'ragas-and-scales',
        title: 'Ragas and scales',
        paragraphs: [
          'Carnatic ragas are organised by the melakarta system: 72 parent scales, from which the other ragas are derived. Hindustani ragas are commonly grouped into thaats, a scheme set out by V. N. Bhatkhande in the early 20th century. In Carnatic music the gamaka, the oscillation or slide on a note, is central to how a raga is recognised.',
        ],
      },
      {
        id: 'rhythm-and-instruments',
        title: 'Rhythm and instruments',
        paragraphs: [
          'Both use tala. A Carnatic singer keeps the tala visibly on the hand, and a concert is usually accompanied by violin and mridangam, sometimes with ghatam or kanjira. Hindustani vocal music is commonly accompanied by tabla with harmonium or sarangi, and dhrupad traditionally by the pakhawaj.',
        ],
      },
      {
        id: 'which-to-learn',
        title: 'Which one should you learn?',
        paragraphs: [
          'Both are complete, lifelong disciplines, and neither is easier. Many families in Telangana and Andhra Pradesh choose Carnatic music because its songs are largely in Telugu, Sanskrit, Kannada and Tamil, and the Telugu composers Tyagaraja, Annamacharya and Bhakta Ramadasu are part of everyday life. If you want to sing those songs, Carnatic training is the direct route.',
          'RAAGA teaches Carnatic vocal music. If you are looking for Hindustani classes, ask a school whether it teaches that tradition specifically.',
        ],
      },
    ],
    related: [
      { label: 'Carnatic music for beginners: where to start', href: '/guides/carnatic-music-for-beginners' },
      { label: 'What is a raga?', href: '/guides/what-is-a-raga' },
      { label: 'The Carnatic curriculum at RAAGA', href: '/learning' },
      { label: 'Carnatic vocal classes in Hyderabad', href: '/music-classes' },
    ],
    sources: [
      { label: 'Wikipedia: Carnatic music', href: 'https://en.wikipedia.org/wiki/Carnatic_music' },
      { label: 'Wikipedia: Hindustani classical music', href: 'https://en.wikipedia.org/wiki/Hindustani_classical_music' },
    ],
  },
  {
    slug: 'what-is-a-raga',
    published: '2026-10-25',
    updated: '2026-10-25',
    title: 'What is a raga? A plain guide to Carnatic ragas',
    description:
      'What a raga is in Carnatic music: arohanam and avarohanam, the 72 melakartas, janya ragas, and why beginners learn in Mayamalavagowla.',
    intro:
      'A raga is the melodic framework of Indian classical music. It is more than a scale: it decides which notes are used, how the melody moves up and down, which notes are stressed and how they are ornamented. Two songs in the same raga share a recognisable colour, even when their words and rhythm differ.',
    sections: [
      {
        id: 'more-than-a-scale',
        title: 'More than a scale',
        paragraphs: [
          'Every raga has an arohanam, its notes in ascending order, and an avarohanam, its notes descending. The two can differ: a raga may skip a note on the way up and use it on the way down, or move in a zig-zag. Beyond the notes, each raga has characteristic phrases and gamakas, the oscillations and slides that shape each note. Listeners learn to recognise a raga by those phrases, much as you recognise a voice.',
        ],
      },
      {
        id: 'the-72-melakartas',
        title: 'The 72 melakartas',
        paragraphs: [
          'Carnatic music arranges its ragas around 72 melakarta, or parent, ragas. A melakarta uses all seven swaras in strict order, going up and coming down. Sa and Pa are fixed, Ma has two positions, and Ri with Ga, and Dha with Ni, can each be combined in six ways: two times six times six gives 72.',
          'The system was set out by Venkatamakhin in the 17th century in his Chaturdandi Prakashika, building on earlier work by Ramamatya. The 72 are grouped into 12 chakras of six, and a naming scheme called katapayadi encodes each raga’s number in the first two syllables of its name. Some well-known melakartas:',
        ],
        bullets: [
          'Mayamalavagowla, number 15',
          'Kharaharapriya, number 22',
          'Harikambhoji, number 28',
          'Dheerasankarabharanam, usually called Sankarabharanam, number 29',
          'Mechakalyani, usually called Kalyani, number 65',
        ],
      },
      {
        id: 'janya-ragas',
        title: 'Janya ragas',
        paragraphs: [
          'A raga derived from a melakarta is a janya raga. A janya may leave out notes, as Mohanam uses only five; move in a crooked order; or borrow a note from outside its parent. Many of the ragas heard most often in concerts, such as Mohanam, Hamsadhwani and Bilahari, are janya ragas.',
        ],
      },
      {
        id: 'why-mayamalavagowla',
        title: 'Why beginners start with Mayamalavagowla',
        paragraphs: [
          'Purandara Dasa made Mayamalavagowla the raga for teaching, and the tradition has kept it. Its notes are Sa, Ri1, Ga3, Ma1, Pa, Dha1 and Ni3. Its two halves have the same pattern of intervals, which makes the scale easy to hold in the ear while the voice learns to place each note.',
        ],
      },
      {
        id: 'learning-ragas',
        title: 'How ragas are learnt',
        paragraphs: [
          'Ragas are learnt through songs, not as lists of notes. A student who has sung a geetham, a varnam and a few kritis in a raga knows it in a way that reading its scale cannot give. At RAAGA, ragas are met through the compositions of the curriculum, in the traditional order.',
        ],
      },
    ],
    related: [
      { label: 'Carnatic music for beginners: where to start', href: '/guides/carnatic-music-for-beginners' },
      { label: 'Carnatic and Hindustani music: the differences', href: '/guides/carnatic-vs-hindustani-music' },
      { label: 'The Carnatic curriculum at RAAGA', href: '/learning' },
      { label: 'Carnatic classes for beginners', href: '/carnatic-music-classes/beginners' },
    ],
    sources: [
      { label: 'Wikipedia: Melakarta', href: 'https://en.wikipedia.org/wiki/Melakarta' },
      { label: 'Wikipedia: Mayamalavagowla', href: 'https://en.wikipedia.org/wiki/Mayamalavagowla' },
      { label: 'Wikipedia: Carnatic music', href: 'https://en.wikipedia.org/wiki/Carnatic_music' },
    ],
  },
]
