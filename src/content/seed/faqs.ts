import type { Faq } from '../types'

/**
 * Built from the real ranked question set — pulled from UrbanPro answer titles,
 * Quora, rasikas.org and competitor FAQ pages. `blocking: true` marks the ones
 * that actually stop a decision; those render expanded-first on mobile.
 *
 * Ship as normal server-rendered accordion HTML and skip FAQPage JSON-LD:
 * Google switched FAQ rich results off on 7 May 2026 and removed the docs on
 * 15 June 2026. The content still earns its keep for conversion and for AI
 * answer surfaces, which need no special markup.
 *
 * NOTE the fees answer carries NO number, by standing instruction.
 */
export const faqs: Faq[] = [
  {
    order: 1,
    question: 'What is the right age to start?',
    answer:
      'Five is a comfortable starting age, when a child can usually sit for half an hour and match a pitch. We have started children at four when they were ready, and we teach adults who are beginning for the first time in their fifties. There is no upper limit and no late.',
    blocking: true,
  },
  {
    order: 2,
    question: 'My child speaks no Telugu, Sanskrit or Tamil. Is that a problem?',
    answer:
      'No. Almost none of our beginners do. The first year is entirely swaras: Sa Ri Ga Ma. They are syllables, not a language. When compositions begin, we teach the meaning line by line before a single word is sung. Children who speak only English learn this music perfectly well.',
    blocking: true,
  },
  {
    order: 3,
    question: 'Is thirty too late to begin?',
    answer:
      'No. Adults usually progress through the early exercises faster than children because they understand structure and can practise deliberately. What adults need is permission to sound like a beginner for a few months. We teach adult batches separately so nobody is sitting beside an eight-year-old.',
    blocking: true,
  },
  {
    order: 4,
    question: 'How many students are in a batch?',
    answer:
      'Six at most. In Carnatic music every student has to sing alone in front of the teacher in every class, and that stops being possible beyond about six people. If a batch fills, we open another rather than stretch it.',
    blocking: true,
  },
  {
    order: 5,
    question: 'How long until my child can sing a full kriti?',
    answer:
      'Honestly: about two to three years of steady weekly practice. The first six to twelve months build the foundation with varisais, alankarams and first geethams. Varnams take the better part of a year on their own. Anyone promising a kriti in three months is skipping the part that makes the voice.',
    blocking: true,
  },
  {
    order: 6,
    question: 'Are online classes as good as in person?',
    answer:
      'For one-to-one and small groups, very nearly. What works less well online is a large batch, because the teacher cannot hear individual voices over a shared connection. That is why online batches are kept smaller. Many of our students outside Hyderabad have never had another option, and they progress.',
    blocking: true,
  },
  {
    order: 7,
    question: 'Where exactly are your centres?',
    answer:
      'We teach at two centres in Hyderabad: Jubilee Hills, where the school began in 2016, and Phoenix Arena in Hitech City, which is easier for families in Madhapur, Gachibowli and Kondapur. The syllabus and teaching are identical at both. Message us and we will send you directions and current timings.',
    blocking: true,
  },
  {
    order: 8,
    question: 'What are the fees?',
    answer:
      'Fees depend on where you learn and on the batch. A group class at one of our centres and a one-to-one online class are priced differently. Message us on WhatsApp and we will tell you straight away, with no obligation.',
    blocking: true,
  },
  {
    order: 9,
    question: 'Do we need to buy a tanpura or a shruti box?',
    answer:
      'Not to begin. A free shruti app on a phone is genuinely fine for the first year, and that is what most of our students use. If the learning continues, an electronic shruti box is a modest and worthwhile purchase. We will tell you when it is time rather than at the start.',
    blocking: false,
  },
  {
    order: 10,
    question: 'What happens if we miss a class?',
    answer:
      'Tell us in advance and we will fit in a make-up where the timetable allows. Carnatic music is cumulative, with each week building directly on the last. Consistent attendance matters more here than in most things a child is enrolled in.',
    blocking: false,
  },
]
