import type { StaticImageData } from 'next/image'
import bhasuriCover from '@/assets/books/bhasuri.jpg'
import swararagaCover from '@/assets/books/swararaga-kadambam.jpg'

/**
 * Guru profiles, one page each at /gurus/<slug>.
 *
 * PROVENANCE. Two kinds of profile live here and each says where its facts
 * come from (`provenance`, printed on the page).
 *
 * Dr. Suryanarayana Polaki: on 2026-10-25 the owner named him as the author
 * of both books on the Gurus page and asked for his public record to be used.
 * Every fact comes from one of the `sources` listed on his profile: the
 * author's note printed with Swararaga Kadambam (as reproduced by the
 * bookseller), The Hans India's report of the Bhasuri release, and the
 * bookseller's catalogue entry for Bhasuri. Nothing is added beyond them.
 *
 * Bharathi Polaki and Bhasuri Polaki: on 2026-11-16 the owner supplied each
 * teacher's own profile (qualification, Guru, years of experience, levels,
 * languages, performances, biography and teaching philosophy). The copy below
 * is that profile, split into sections for the web and nothing more. Fields
 * the form left as a placeholder (Bhasuri's teaching languages, AIR
 * accreditation) are left out rather than guessed. No honorific is added
 * that the teacher did not use. Photographs are to follow: a profile without
 * one renders complete as text, and adding `photo` later costs one import.
 *
 * The general rule still holds for anyone the owner has not named in the
 * same way: no teacher, award or institution attached to a Guru unless the
 * owner or the teacher supplied it.
 *
 * "Dr." is the owner's form of Suryanarayana Polaki's name; the 2015 sources
 * print "Sri" and "Guru". The spelling variants are listed so search engines
 * and assistants can tell this Polaki Suryanarayana from the several
 * unrelated people who share the name.
 */

export interface GuruBook {
  title: string
  /** The title as printed in its own script, when it is not English. */
  originalTitle?: string
  subtitle?: string
  language: 'en' | 'te'
  publisher?: string
  /** Printed by the author himself (the catalogue lists the publisher as "Polaki"). */
  selfPublished?: boolean
  /** A year, never a guessed day. */
  published?: string
  pages?: number
  summary: string
  cover?: StaticImageData
}

export interface GuruProfile {
  slug: string
  /** Only when the teacher uses one; never added. */
  honorific?: string
  name: string
  /** Other spellings of the name in print, for search engines. */
  alternateNames?: string[]
  /** The teacher's own professional title. */
  role: string
  /** The one-paragraph answer to "who is this", for the page lede and the schema. */
  summary: string
  /** One sentence printed on the page saying where these facts come from. */
  provenance: string
  birthPlace?: string
  /** The qualification as the teacher states it, for example "M.A. in Music, Andhra University". */
  qualification?: string
  /** Teachers exactly as the teacher or the author's note names them, in that order. */
  teachers: string[]
  /** Years stated by the teacher. Strings, never counters: "40 years". */
  experience?: { music: string; teaching: string }
  levels?: string[]
  /** Languages the teacher teaches in. Display names: "Telugu", "English". */
  languages?: string[]
  /** The teacher's own statement of how they teach. */
  philosophy?: string
  sections: { id: string; title: string; paragraphs: string[] }[]
  education?: { name: string; place?: string; kind: 'university' | 'college' }[]
  awards?: { title: string; year: string }[]
  books?: GuruBook[]
  /** Published sources, when the profile is built from a public record. */
  sources?: { label: string; href: string }[]
  /** A portrait, when the teacher has supplied one. Nothing is rendered in its place until then. */
  photo?: StaticImageData
}

export const guruProfiles: GuruProfile[] = [
  {
    slug: 'suryanarayana-polaki',
    honorific: 'Dr.',
    name: 'Suryanarayana Polaki',
    alternateNames: [
      'Polaki Suryanarayana',
      'Surya Narayana Polaki',
      'Guru Polaki Suryanarayana',
      'పోలాకి సూర్యనారాయణ',
    ],
    role: 'Carnatic vocalist, Guru and author',
    summary:
      'Dr. Suryanarayana Polaki is a Carnatic vocalist and one of the Gurus at RAAGA. He is the author of two books on Carnatic music: Bhasuri, a beginner’s guide in English, and Swararaga Kadambam in Telugu.',
    provenance:
      'From the author’s note printed with Swararaga Kadambam, The Hans India’s report of the Bhasuri release and the bookseller’s catalogue entry for Bhasuri, listed below.',
    birthPlace: 'Vizianagaram, Andhra Pradesh',
    qualification: 'Sangeetha Praveena, Sri Venkateswara University, Tirupati',
    teachers: [
      'Mahamahopadhyaya Padma Bhushan Dr. Nookala Chinna Satyanarayana',
      'Sri Dwaram Durga Prasad',
      'Dr. Mythili',
      'Sri P.V.S.S. Sastri',
      'Sri B.A. Narayana',
      'Sri P. Raju',
      'Sri P. Chinna',
    ],
    education: [
      { name: 'Sri Venkateswara University', place: 'Tirupati', kind: 'university' },
      { name: 'Maharaja’s Government College of Music and Dance', place: 'Vizianagaram', kind: 'college' },
    ],
    awards: [
      { title: 'National Scholarship, Ministry of Human Resource Development, Government of India', year: '1986' },
      { title: 'Best Singer award with a gold medal, Government of Andhra Pradesh', year: '1997-98' },
    ],
    sections: [
      {
        id: 'training',
        title: 'Training',
        paragraphs: [
          'He was born in Vizianagaram. His training includes the Sangeetha Praveena, a diploma from Sri Venkateswara University, Tirupati, and a certificate from the Maharaja’s Government College of Music and Dance, Vizianagaram.',
          'He is described as the manasa putra, the disciple held as a son, of Mahamahopadhyaya Padma Bhushan Dr. Nookala Chinna Satyanarayana. The author’s note in Swararaga Kadambam names these as his Gurus:',
        ],
      },
      {
        id: 'honours',
        title: 'Honours',
        paragraphs: [
          'In 1986 he received a National Scholarship from the Ministry of Human Resource Development, Government of India. In 1997-98 the Government of Andhra Pradesh gave him its Best Singer award, with a gold medal.',
        ],
      },
      {
        id: 'concerts-and-lectures',
        title: 'Concerts, broadcasts and lectures',
        paragraphs: [
          'He has given concerts and talks on All India Radio, Doordarshan and Bhakti TV and for many cultural organisations, and has served as an adviser to their music programmes.',
          'He lectured on the forms of Carnatic music at a meeting of the North Central Zone Cultural Centre, Allahabad, and has given lectures and concerts at seminars held by the Government of Kerala.',
        ],
      },
      {
        id: 'teaching',
        title: 'Teaching',
        paragraphs: [
          'He taught Carnatic vocal at Saptaparni in Hyderabad, where his book Bhasuri was released in August 2015, and has taught students online. He is one of the Gurus at RAAGA.',
        ],
      },
    ],
    books: [
      {
        title: 'Bhasuri',
        subtitle: 'A Beginner’s Guide to Carnatic Music',
        language: 'en',
        publisher: 'Kalajyothi Press',
        published: '2015',
        pages: 250,
        summary:
          'Written in English for school and college students in India and abroad, and for other students of music. It was released on 1 August 2015 at Saptaparni, Banjara Hills, Hyderabad.',
        cover: bhasuriCover,
      },
      {
        title: 'Swararaga Kadambam',
        originalTitle: 'స్వర రాగ కదంబం',
        language: 'te',
        selfPublished: true,
        pages: 198,
        summary:
          'A Telugu textbook for students and lovers of Carnatic music, from the Sarali Swaras to the Mangalam. It introduces the seven swaras, the raga lakshana of each piece and the exercises, gives word-by-word meanings for the geethams, swarajatis and kritis, and adds life sketches of the vaggeyakaras.',
        cover: swararagaCover,
      },
    ],
    sources: [
      {
        label: 'The Hans India, 4 August 2015: “Music wins hearts”, the release of Bhasuri',
        href: 'https://www.thehansindia.com/posts/index/hans/2015-08-03/music-wins-hearts/167585',
      },
      {
        label: 'Swararaga Kadambam, with the author’s note (Logili Book House)',
        href: 'https://www.logili.com/books/polaki-suryanarayana/p-7488847-45439138101-cat.html',
      },
      {
        label: 'Bhasuri: A Beginner’s Guide to Carnatic Music (Best Book Centre)',
        href: 'https://www.bestbookcentre.com/books/music-and-dance/bhasuri-a-beginners-guide-to-carnatic-music',
      },
    ],
  },
  {
    slug: 'bharathi-polaki',
    name: 'Bharathi Polaki',
    role: 'Senior Carnatic Classical Vocalist and Guru',
    summary:
      'Bharathi Polaki is a Carnatic classical vocalist and music educator at RAAGA, with over 40 years of musical experience and 20 years of teaching. She holds a Master’s degree in Music from Andhra University and trained under Padma Bhushan Dr. Nookala Chinna Satyanarayana.',
    provenance: 'From the profile Bharathi Polaki supplied to RAAGA in November 2026.',
    qualification: 'M.A. in Music, Andhra University',
    teachers: ['Padma Bhushan Dr. Nookala Chinna Satyanarayana'],
    experience: { music: '40 years', teaching: '20 years' },
    levels: ['Beginner', 'Intermediate', 'Advanced'],
    languages: ['Telugu', 'English'],
    education: [{ name: 'Andhra University', kind: 'university' }],
    philosophy:
      'She believes in upholding the traditional values of Carnatic music through systematic learning, disciplined practice and dedicated guidance, and focuses on developing musical excellence, a deep understanding of the art form and the confidence to express oneself through music.',
    sections: [
      {
        id: 'training',
        title: 'Training',
        paragraphs: [
          'Bharathi Polaki holds a Master’s degree in Music from Andhra University and received her musical training under the guidance of the distinguished Padma Bhushan awardee Dr. Nookala Chinna Satyanarayana. She has over 40 years of musical experience.',
        ],
      },
      {
        id: 'honours',
        title: 'Honours',
        paragraphs: [
          'She has received several awards, honours and recognitions for her contributions to Carnatic classical music.',
        ],
      },
      {
        id: 'performances',
        title: 'Performances',
        paragraphs: [
          'She has rendered numerous Carnatic vocal performances at cultural platforms, music festivals and sabhas, and has performed for All India Radio.',
        ],
      },
      {
        id: 'teaching',
        title: 'Teaching',
        paragraphs: [
          'With 20 years of teaching experience across beginner, intermediate and advanced levels, in Telugu and English, she is dedicated to nurturing musical talent and imparting the richness of Carnatic classical music.',
          'Her approach combines traditional musical values with a structured learning experience.',
        ],
      },
    ],
  },
  {
    slug: 'bhasuri-polaki',
    name: 'Bhasuri Polaki',
    role: 'Carnatic Classical Vocal Instructor',
    summary:
      'Bhasuri Polaki is a Carnatic classical vocal instructor at RAAGA, with 20 years of musical experience and five years of teaching. She holds a Diploma in Carnatic Classical Music and trained under Dwaram Sathyanarayana.',
    provenance: 'From the profile Bhasuri Polaki supplied to RAAGA in November 2026.',
    qualification: 'Diploma in Carnatic Classical Music',
    teachers: ['Dwaram Sathyanarayana'],
    experience: { music: '20 years', teaching: '5 years' },
    levels: ['Beginner', 'Intermediate'],
    philosophy:
      'She believes in building a strong musical foundation through systematic learning, consistent practice and individual guidance, and focuses on nurturing each student’s musical abilities while developing an appreciation for the depth and tradition of Carnatic music.',
    sections: [
      {
        id: 'training',
        title: 'Training',
        paragraphs: [
          'Bhasuri Polaki holds a Diploma in Carnatic Classical Music and received her musical training under the guidance of Dwaram Sathyanarayana. With 20 years of musical experience, she has developed a strong foundation in traditional Carnatic music.',
        ],
      },
      {
        id: 'performances',
        title: 'Performances',
        paragraphs: [
          'She is actively involved in Carnatic classical music, with participation in musical performances and cultural events, and has given several vocal performances at cultural programmes, music gatherings and other musical occasions.',
        ],
      },
      {
        id: 'teaching',
        title: 'Teaching',
        paragraphs: [
          'With five years of teaching experience, she has worked with students at beginner and intermediate levels, guiding them in developing their vocal skills and their understanding of the art form.',
          'Her musical journey encompasses both learning and teaching, with an emphasis on musical discipline, practice and appreciation of classical traditions. She is passionate about nurturing students and helping them build a strong foundation in Carnatic vocal music.',
        ],
      },
    ],
  },
]
