export interface LearningGuide {
  slug: string
  title: string
  description: string
  intro: string
  sections: {
    id: string
    title: string
    paragraphs: string[]
    bullets?: string[]
  }[]
  related: { label: string; href: string }[]
  sources: { label: string; href: string }[]
}

export const learningGuides: LearningGuide[] = [
  {
    slug: 'choosing-singing-classes-hyderabad',
    title: 'How to choose singing classes in Hyderabad',
    description:
      'Compare music classes by what is taught, teacher feedback, travel and practice expectations. A practical checklist for Hyderabad adults and parents.',
    intro:
      'Searching for music classes in Hyderabad brings together very different lessons: Carnatic vocal, Hindustani singing, film songs, keyboard, guitar and more. Before comparing schools, decide what you want to learn and what you can attend regularly. This checklist helps you turn a long list of results into a useful conversation with a teacher.',
    sections: [
      {
        id: 'choose-the-subject',
        title: 'Start with the music you want to learn',
        paragraphs: [
          'A music school may teach several subjects, but a singing class is not automatically a Carnatic vocal class. If you are looking for sangeetham or classical singing lessons, ask which tradition is taught. Carnatic and Hindustani are distinct traditions. Film-song coaching and instrument lessons answer different goals again.',
          'RAAGA teaches Carnatic vocal music. Its learning path begins with swara exercises and develops towards compositions and later improvisation. The NIOS Carnatic curriculum also separates foundational exercises such as Sarali Varisai and Alankaras from later forms such as Varnam and Kriti. Ask how a school will place you within its own curriculum, especially if you have studied before.',
        ],
      },
      {
        id: 'listen-for-feedback',
        title: 'Check how the teacher listens to you',
        paragraphs: [
          'Use a trial to understand the teaching, not to judge how polished you already sound. Notice whether you get a chance to sing, whether a correction is explained, and whether you understand what to try next. An impressive performance by the teacher alone does not tell you how a lesson will work.',
          'For a child, consider whether the instructions are understandable and whether there is room to ask questions. For an adult returning after a gap, ask how the teacher checks what you remember. A batch label is less useful than knowing what you will actually work on.',
        ],
      },
      {
        id: 'check-the-journey',
        title: 'Test the journey, not just the map distance',
        paragraphs: [
          'For in-person classes in Hyderabad, check the trip at the time you would usually travel. Include the return journey and any school or work commitments around it. A nearby class that fits your week may be easier to attend than a place that looks convenient only on a map.',
          'RAAGA has centres at Jubilee Hills and Phoenix Arena, Hitech City. Check the specific centre with the team before travelling. If either journey is difficult to sustain, compare a live online lesson instead of choosing a location you are unlikely to reach regularly.',
        ],
      },
      {
        id: 'questions-before-joining',
        title: 'Leave with clear answers',
        paragraphs: [
          'Keep your first enquiry simple: say whether you are an adult learner or a parent, whether the learner is new or returning, and which location or format you prefer. You do not need to send a child\'s name or date of birth to discuss suitable classes.',
          'Before joining, ask the questions below. Choose based on the answers and your experience of the lesson, not a promise to finish a syllabus or perform by a fixed date.',
        ],
        bullets: [
          'Which level and group would suit the learner, and why?',
          'What class timings are currently available at the chosen centre or online?',
          'How will each learner receive feedback?',
          'What should be practised between lessons, and how are doubts handled?',
          'What is the process if a class is missed or the learner needs a different pace?',
        ],
      },
    ],
    related: [
      { label: 'What to expect when joining RAAGA', href: '/getting-started' },
      { label: 'Explore the Carnatic curriculum', href: '/learning' },
      { label: 'Visit the Jubilee Hills centre', href: '/music-classes/jubilee-hills' },
      { label: 'Visit the Hitech City centre', href: '/music-classes/hitech-city' },
    ],
    sources: [
      { label: 'NIOS: Carnatic Music learning materials', href: 'https://digital.nios.ac.in/topic.php?id=243en' },
    ],
  },
  {
    slug: 'online-or-in-person-carnatic-classes',
    title: 'Online or in-person Carnatic classes: which suits you?',
    description:
      'Compare live online and in-person Carnatic lessons by travel, sound, teacher feedback and home setup before choosing a class format.',
    intro:
      'The useful question is not whether online or in-person music classes are always better. It is which format lets you attend, hear the teacher clearly, sing back and get corrections. Your travel, home environment and learning preferences all belong in that decision. A trial should test those practical details as well as the lesson itself.',
    sections: [
      {
        id: 'in-person-fit',
        title: 'When an in-person class may fit',
        paragraphs: [
          'Consider a centre if you prefer learning in a shared room, want a clear break from work or school screens, and can make the journey consistently. You can hear the demonstration directly and see how the teacher indicates tala, the rhythmic cycle. You are not relying on your home microphone or connection.',
          'At RAAGA, the physical choices are Jubilee Hills and Phoenix Arena, Hitech City. Ask about current availability at the centre you can actually attend. Check the journey around the likely class time, and discuss any access needs before your visit. Do not assume a preferred slot is available until the team confirms it.',
        ],
      },
      {
        id: 'online-fit',
        title: 'When a live online class may fit',
        paragraphs: [
          'Online learning removes the trip to a centre, but it still needs a protected place in your week. Consider it if travel is the main obstacle and you have somewhere you can listen and sing without frequent interruptions. If you live outside India, confirm the lesson time in both time zones.',
          'Distinguish a live lesson from watching a recorded demonstration. Ask how the teacher will listen to your singing and correct it during the class. Also ask how notes or other practice material are shared. Do not assume that a live class includes recordings or permission to make your own.',
        ],
      },
      {
        id: 'test-your-setup',
        title: 'Test sound before buying equipment',
        paragraphs: [
          'Use your existing device for an initial sound check with the teacher. Put it on a stable surface and check that both your face and tala gestures can be seen. Test a sung phrase, not just a spoken hello. If the teacher cannot hear the notes clearly, adjust the setup together before treating it as a singing problem.',
          'Some meeting apps filter background sound in ways that also affect music. Zoom, for example, documents a separate setting for musicians. Follow the guidance for the platform your teacher actually uses; this does not mean you need that particular app or a professional microphone. Ask whether headphones help with your setup and keep other audio sources from interfering.',
        ],
      },
      {
        id: 'compare-a-trial',
        title: 'Use the same checklist for either format',
        paragraphs: [
          'A useful trial leaves you knowing what to practise next and how to ask for help. For a child learning online, ask what support is expected from a parent or guardian, including getting the device ready. For an adult, be honest about how much quiet space the household can provide.',
          'Choose the format that works in your normal week, not just on an unusually quiet day. If your needs change later, ask about available alternatives rather than assuming you can switch centres, groups or formats automatically.',
        ],
        bullets: [
          'Could you hear the demonstration and follow the instructions?',
          'Did the teacher hear you sing and explain a correction?',
          'Was the class level suitable for your current experience?',
          'Can you repeat this travel or home arrangement regularly?',
          'Are the timing, practice expectations and next steps clear?',
        ],
      },
    ],
    related: [
      { label: 'Explore live online classes', href: '/online-classes' },
      { label: 'Classes at Jubilee Hills', href: '/music-classes/jubilee-hills' },
      { label: 'Classes at Hitech City', href: '/music-classes/hitech-city' },
      { label: 'A guide for adult learners', href: '/carnatic-music-classes/adults' },
    ],
    sources: [
      { label: 'Zoom: audio settings for music', href: 'https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0059985' },
    ],
  },
  {
    slug: 'practising-carnatic-music-at-home',
    title: 'How to practise Carnatic music between lessons',
    description:
      'Plan Carnatic practice around your teacher\'s exercises, pitch and feedback. A simple home-practice checklist for beginners, adults and parents.',
    intro:
      'Home practice starts with the work your guru has set, not a new exercise found online. The aim is to return to class with a clearer understanding of that work and useful questions. This guide helps you organise practice; it does not prescribe a pitch, vocal technique or fixed amount of singing for every learner.',
    sections: [
      {
        id: 'leave-with-a-plan',
        title: 'Write down the actual task',
        paragraphs: [
          'Before the lesson ends, check which exercise or passage to revisit and what the teacher wants you to notice. Pitch, the swara sequence, tala and words are different tasks. If you only write "practise the lesson", it can be difficult to remember which correction mattered.',
          'A notebook can hold three things: the assigned material, the teacher\'s correction and a question for next time. Use the notation or terms your teacher has taught you. If you do not understand an instruction, ask for it to be demonstrated again rather than copying a version from an unrelated recording.',
        ],
      },
      {
        id: 'use-the-teachers-reference',
        title: 'Keep the pitch and material consistent',
        paragraphs: [
          'Use the pitch reference, exercise and pace chosen by your guru. If you have been asked to use a shruti box or app, confirm the setting and how to use it before practising alone. A recording by another singer is not a reason to change your own pitch or try to match their range.',
          'The NIOS Carnatic materials include foundational work such as Sarali Varisai, Janta Varisai and Alankaras before later compositions. Those names describe areas of study, not a race through a checklist. Your teacher decides what needs revision and when another exercise or composition is appropriate.',
        ],
      },
      {
        id: 'practise-with-a-question',
        title: 'Work on the correction, not just the whole lesson',
        paragraphs: [
          'Choose a specific point from the last class to pay attention to. That might be remembering a swara sequence or following the tala as demonstrated. Ask your teacher how to break down a difficult passage instead of repeatedly guessing at it. Moving faster or adding more material is not a substitute for understanding the instruction.',
          'If you are unsure whether you are singing something correctly, note where the uncertainty starts. A precise question such as "I lose the sequence on this line" gives the next lesson a useful starting point. Tell the teacher what you tried so they can hear the issue and respond.',
        ],
      },
      {
        id: 'make-practice-manageable',
        title: 'Make a plan that fits the learner',
        paragraphs: [
          'Agree a practice plan with your guru that takes account of the learner\'s level and other commitments. There is no single duration in this guide that everyone needs to meet. Set aside a suitable space and have the assigned notes ready so that beginning does not become a separate task.',
          'Parents can help by keeping materials available and asking what the child was asked to practise. Unless the teacher has given specific guidance, avoid introducing extra exercises or turning practice into preparation for an unplanned performance. Adult returners should also discuss earlier training rather than assuming their previous routine is the right starting point now.',
        ],
        bullets: [
          'Confirm the assigned exercise, pitch reference and pace.',
          'Keep the most recent correction beside your notes.',
          'Write down doubts instead of hiding them until later.',
          'Ask permission before recording a lesson or another learner.',
          'Review the practice plan with your teacher as learning develops.',
        ],
      },
    ],
    related: [
      { label: 'Beginner Carnatic music classes', href: '/carnatic-music-classes/beginners' },
      { label: 'Learning at RAAGA', href: '/learning' },
      { label: 'Classes for children and parent guidance', href: '/carnatic-music-classes/children' },
      { label: 'Starting or returning as an adult', href: '/carnatic-music-classes/adults' },
    ],
    sources: [
      { label: 'NIOS: Carnatic Music theory and practical materials', href: 'https://digital.nios.ac.in/topic.php?id=243en' },
    ],
  },
]
