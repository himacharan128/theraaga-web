import type { StaticImageData } from 'next/image'
import bhasuriCover from '@/assets/books/bhasuri.jpg'
import swararagaCover from '@/assets/books/swararaga-kadambam.jpg'

/**
 * Guru profiles, one page each at /gurus/<slug>.
 *
 * PROVENANCE. On 2026-10-25 the owner named Dr. Suryanarayana Polaki as the
 * author of both books on the Gurus page and asked for his public record to be
 * used. Every fact below comes from one of the sources listed on the profile:
 * the author's note printed with Swararaga Kadambam (as reproduced by the
 * bookseller), The Hans India's report of the Bhasuri release, and the
 * bookseller's catalogue entry for Bhasuri. Nothing is added beyond them. The
 * general rule against naming a Guru's teacher, award or institution still
 * holds for anyone the owner has not named in the same way.
 *
 * "Dr." is the owner's form of his name; the 2015 sources print "Sri" and
 * "Guru". The spelling variants are listed so search engines and assistants
 * can tell this Polaki Suryanarayana from the several unrelated people who
 * share the name.
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
  honorific: string
  name: string
  alternateNames: string[]
  role: string
  /** The one-paragraph answer to "who is he", for the page lede and the schema. */
  summary: string
  birthPlace: string
  sections: { id: string; title: string; paragraphs: string[]; bullets?: string[] }[]
  /** Teachers exactly as the author's note names them, in its order. */
  teachers: string[]
  education: { name: string; place: string; kind: 'university' | 'college' }[]
  awards: { title: string; year: string }[]
  books: GuruBook[]
  sources: { label: string; href: string }[]
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
    birthPlace: 'Vizianagaram, Andhra Pradesh',
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
]
