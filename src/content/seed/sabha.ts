import type { EventKind, JournalTopic } from '../types'

/**
 * Sabha — Events.
 *
 * These are the KINDS of gathering RAAGA holds, taken from the client's content
 * master. They are not dated occurrences, and nothing here implies a scheduled
 * date. Real dated events go in the `events` collection and render above this
 * list once they exist; until then this page is still true and still useful,
 * because a parent asking "does this school put students on a stage" gets a
 * straight answer.
 */
export const eventKinds: EventKind[] = [
  {
    order: 1,
    name: 'Concerts',
    body: 'Kutcheris where students perform the repertoire they have prepared, in the traditional concert format.',
  },
  {
    order: 2,
    name: 'Workshops',
    body: 'Focused sessions on a particular aspect of practice — a raga, a form, or an element of technique.',
  },
  {
    order: 3,
    name: 'Lecture demonstrations',
    body: 'Explanatory sessions where the music is unpacked as it is sung, for students and for listeners new to the tradition.',
  },
  {
    order: 4,
    name: 'Guru Purnima',
    body: 'The annual observance honouring the teacher, and the lineage the teaching descends from.',
  },
  {
    order: 5,
    name: 'Tyagaraja Aradhana',
    body: 'The annual commemoration of Saint Tyagaraja, whose kritis form the heart of the Carnatic concert repertoire.',
  },
  {
    order: 6,
    name: 'Student performances',
    body: 'Recitals through the year that give every student an occasion to sing for an audience.',
  },
]

/**
 * Manana — the Journal.
 *
 * The client supplied seven subject areas. Those are real editorial intent, so
 * they are published as subjects. Articles are not invented: the page shows the
 * subjects and says plainly that writing is being prepared, which is honest and
 * still communicates the school's scholarly bent.
 */
export const journalTopics: JournalTopic[] = [
  {
    order: 1,
    name: 'Ragas',
    devanagari: 'राग',
    body: 'The scales, phrases and moods that give each raga its identity.',
  },
  {
    order: 2,
    name: 'Great Composers',
    body: 'Tyagaraja, Muthuswami Dikshitar, Syama Sastri and the vaggeyakaras whose work forms the repertoire.',
  },
  {
    order: 3,
    name: 'Kritis Explained',
    body: 'Individual compositions read closely — the text, the raga, and what the sangatis do.',
  },
  {
    order: 4,
    name: 'Shruti & Laya',
    devanagari: 'श्रुति · लय',
    body: 'Pitch and rhythm: the two disciplines every other skill rests on.',
  },
  {
    order: 5,
    name: 'Voice Culture',
    body: 'Caring for the voice, building range and stamina, and singing without strain.',
  },
  {
    order: 6,
    name: 'Practice Tips',
    body: 'How to make daily sādhana productive, for beginners and for advanced students alike.',
  },
  {
    order: 7,
    name: 'Guru Parampara',
    devanagari: 'गुरुपरम्परा',
    body: 'The lineages of Carnatic music, and what is carried forward through them.',
  },
]
