import type { Mode } from '../types'

/**
 * A neighbourhood RAAGA serves from one of its two centres, without a branch
 * of its own. One page per area, at /music-classes/[slug], beside the centre
 * pages.
 *
 * Why these pages exist, and the line they must not cross. A parent in
 * Banjara Hills searches for "music classes banjara hills", not for the name
 * of the centre two neighbourhoods over, and a hub page cannot rank for a
 * dozen localities at once. Google's doorway-page policy targets pages that
 * swap a place name into the same copy and funnel to the same form. These
 * pages avoid that by saying only what is true and specific to the place: no
 * branch here, which centre is nearest, how far it is by road, how long the
 * journey realistically takes, and what the alternative is when the journey
 * does not fit a family's week.
 *
 * Distances are road distances between the locality and the centre (or, for
 * Hitech City, the Hitech City area, because Phoenix Arena's street address
 * is still unconfirmed and is never guessed). They were measured on the
 * OpenStreetMap road network on 2026-11-12 and rounded. Journey times are
 * ranges wide enough to hold at most hours; the page tells the reader to test
 * the trip at the intended class time rather than trust a map estimate.
 *
 * Never add to these pages: a claim that students come from the area, a
 * batch day or time, a venue in a residential community, or any fee.
 */
export interface Area {
  slug: string
  /** The locality name as a Hyderabad local says it. */
  name: string
  /** Other names a centre's catchment list uses for this page. */
  aliases?: string[]
  /** The name as it reads mid-sentence, when that differs: "the Financial District". */
  prose?: string
  /** The centre a family here would normally travel to. */
  nearest: Mode
  /** Set when the other centre is a comparable journey. */
  alsoNear?: Mode
  /** Road distance to the nearest centre, as copy: "about 6 km". */
  distance: string
  /** The <title> before " | RAAGA". At most 52 characters. */
  title: string
  /** The meta description, 120 to 160 characters. */
  description: string
  /** Opens the page: the honest statement of where the nearest centre is. */
  intro: string
  /** The journey, in the terms a parent uses to plan a weekly class. */
  travel: string
  /** When the journey does not fit: online, a hosted community class, or the other centre. */
  alternative: string
  /** Places a reader here might also be coming from, as /music-classes slugs. */
  neighbours: string[]
}

export const areas: Area[] = [
  {
    slug: 'banjara-hills',
    name: 'Banjara Hills',
    nearest: 'jubilee-hills',
    distance: 'about 6 km',
    title: 'Carnatic Music & Singing Classes near Banjara Hills',
    description:
      'Looking for Carnatic music or singing classes in Banjara Hills, Hyderabad? RAAGA teaches children and adults at Jubilee Hills, about 6 km away, and live online.',
    intro:
      'RAAGA has no branch in Banjara Hills, and we say so plainly. Our founding centre on Road Number 24, Jubilee Hills is the next neighbourhood over, about 6 km by road from the Banjara Hills main roads, so a weekly Carnatic vocal class is a short drive rather than a trip across the city.',
    travel:
      'From Road No. 12 or Road No. 1, Banjara Hills, allow 15 to 25 minutes by car to Jubilee Hills at most hours and longer in the evening peak. Test the journey at the time of the class you are considering, not at midday, and tap Directions on the Jubilee Hills page to open the exact pin in Google Maps.',
    alternative:
      'If the evening drive is the obstacle, the same Gurus teach live online to the same syllabus, so a child or an adult can learn from home in Banjara Hills. A residential community here can also host a RAAGA class on its own premises, arranged with the association.',
    neighbours: ['jubilee-hills', 'film-nagar', 'madhapur'],
  },
  {
    slug: 'film-nagar',
    name: 'Film Nagar',
    nearest: 'jubilee-hills',
    distance: 'about 5 km',
    title: 'Carnatic Music & Singing Classes near Film Nagar',
    description:
      'Carnatic vocal and singing classes for children and adults near Film Nagar, Hyderabad. RAAGA teaches at Jubilee Hills, about 5 km by road, and live online.',
    intro:
      'Film Nagar sits beside Jubilee Hills, and our centre on Road Number 24 is about 5 km away by road. For families around Film Nagar and the Jubilee Hills check post it is the nearest place to learn Carnatic vocal with the Guru in the room, in a batch of no more than six.',
    travel:
      'From most of Film Nagar allow 10 to 20 minutes by car, more in the evening peak through the Jubilee Hills check post. The centre is on Road Number 24 in Jawahar Colony, Venkatagiri; the Jubilee Hills page carries the address and a Directions link to the Google Maps pin.',
    alternative:
      'Children from five and adults begin with the same swara exercises, so the question is only which room suits your week. If no class time fits, live online lessons follow the same syllabus with the same Gurus, and a community in Film Nagar can host a class with its association’s consent.',
    neighbours: ['jubilee-hills', 'banjara-hills', 'manikonda'],
  },
  {
    slug: 'madhapur',
    name: 'Madhapur',
    nearest: 'phoenix-arena',
    alsoNear: 'jubilee-hills',
    distance: 'about 2 km',
    title: 'Carnatic Music & Singing Classes near Madhapur',
    description:
      'Carnatic music and singing classes near Madhapur, Hyderabad, for children and adults. Both RAAGA centres, Hitech City and Jubilee Hills, are within about 3 km.',
    intro:
      'Madhapur is the one neighbourhood within easy reach of both our centres: Phoenix Arena in Hitech City is about 2 km away and Jubilee Hills about 3 km. Families here choose by the class timing that fits the week rather than by distance.',
    travel:
      'Either centre is a journey of 10 to 15 minutes from most of Madhapur outside the evening rush around Cyber Towers and Durgam Cheruvu. A weekend class avoids that traffic altogether. Ask the team which centre currently has a batch at your level and time before deciding.',
    alternative:
      'If you travel for work or the week is unpredictable, live online lessons from home in Madhapur keep the same Guru and syllabus. Apartment communities in Madhapur can also ask about a class hosted on their own premises.',
    neighbours: ['hitech-city', 'jubilee-hills', 'kondapur', 'gachibowli'],
  },
  {
    slug: 'gachibowli',
    name: 'Gachibowli',
    nearest: 'phoenix-arena',
    distance: 'about 5 to 6 km',
    title: 'Carnatic Music & Singing Classes near Gachibowli',
    description:
      'Carnatic vocal and singing classes for children and adults near Gachibowli, Hyderabad. RAAGA teaches at Phoenix Arena, Hitech City, about 6 km away, and online.',
    intro:
      'Gachibowli is about 5 to 6 km from Phoenix Arena, our Hitech City centre, which makes it the practical choice for families in Gachibowli, Gopanpally and around the DLF and Wipro junctions. Jubilee Hills is further, at roughly 9 km.',
    travel:
      'Expect 15 to 25 minutes by car to Hitech City at most hours. The Gachibowli to Miyapur road and the Outer Ring Road service roads carry the IT-corridor evening traffic, so test the trip at your intended class time. Ask RAAGA to confirm the meeting point at Phoenix Arena before the first visit.',
    alternative:
      'Many families in Gachibowli have moved to Hyderabad from elsewhere in India or abroad; the children do not need Telugu, Sanskrit or Tamil to begin, because the first lessons are swaras. If the commute is the problem, live online classes keep the same teaching, and a gated community can host a class on site.',
    neighbours: ['hitech-city', 'kondapur', 'financial-district', 'madhapur'],
  },
  {
    slug: 'kondapur',
    name: 'Kondapur',
    nearest: 'phoenix-arena',
    distance: 'about 3 km',
    title: 'Carnatic Music & Singing Classes near Kondapur',
    description:
      'Carnatic music and singing classes near Kondapur, Hyderabad, for children and adults. RAAGA teaches at Phoenix Arena, Hitech City, about 3 km away, and online.',
    intro:
      'Kondapur to Hitech City is about 3 km by road, so Phoenix Arena is the closer of our two centres for families in Kondapur, Kothaguda and Masjid Banda. A weekly Carnatic vocal class here is a 10 to 15 minute journey outside peak traffic.',
    travel:
      'The Kondapur to Hitech City stretch slows badly on weekday evenings; a weekend or early-evening class is often the easier routine to keep. Confirm the meeting point at Phoenix Arena with the team before travelling, and compare that journey with the one to Jubilee Hills, about 7 km away, if its timings suit you better.',
    alternative:
      'Children from five start with Sarali Swaras; adults begin at any age with no earlier training. If neither centre fits the week, the same Gurus teach live online, and apartment communities in Kondapur can ask about a class hosted on their premises.',
    neighbours: ['hitech-city', 'madhapur', 'gachibowli'],
  },
  {
    slug: 'manikonda',
    name: 'Manikonda',
    nearest: 'phoenix-arena',
    alsoNear: 'jubilee-hills',
    distance: 'about 8 km',
    title: 'Carnatic Music & Singing Classes near Manikonda',
    description:
      'Carnatic vocal classes for children and adults near Manikonda, Hyderabad. Hitech City and Jubilee Hills centres are each about 8 km away; online classes too.',
    intro:
      'Manikonda is roughly equidistant from both our centres: about 8 km to Phoenix Arena in Hitech City and about 8 to 9 km to Jubilee Hills. Families in Manikonda, Puppalaguda and Alkapur Township usually decide by which class time fits the week, not by the map.',
    travel:
      'From Manikonda allow 20 to 30 minutes by car either way, longer when the Outer Ring Road approaches and the Gachibowli junction are busy. Check both journeys at your intended class time; the team can tell you which centre currently has a batch at your level.',
    alternative:
      'If the drive is the obstacle, live online lessons keep the same Guru and syllabus without the journey. Manikonda’s larger gated communities can also host a RAAGA class on their own premises, arranged with the residents’ association, so the children learn where they live.',
    neighbours: ['hitech-city', 'jubilee-hills', 'film-nagar', 'financial-district'],
  },
  {
    slug: 'kokapet',
    name: 'Kokapet',
    nearest: 'phoenix-arena',
    distance: 'about 12 km',
    title: 'Carnatic Music & Singing Classes near Kokapet',
    description:
      'Carnatic music classes for families in Kokapet and Narsingi, Hyderabad. RAAGA’s nearest centre is Hitech City, about 12 km away, with live online classes too.',
    intro:
      'Kokapet and Narsingi are about 12 km from Phoenix Arena in Hitech City, the nearer of our two centres, and further still from Jubilee Hills. We name the distance so you can plan honestly: for many families here a live online class, or one hosted in their own community, is the more reliable weekly routine.',
    travel:
      'By road via the Outer Ring Road the journey from Kokapet to Hitech City takes about 20 to 35 minutes depending on the hour. If you do travel, a weekend class is usually easier to keep than a weekday evening one. Confirm the meeting point at Phoenix Arena with the team before the first trip.',
    alternative:
      'The newer towers in Kokapet and Neopolis are home to many families from across India and abroad. A gated community there can host a RAAGA class on its own premises, arranged with the association, and live online lessons follow the same syllabus from Sarali Swaras onward for children from five and for adults.',
    neighbours: ['financial-district', 'gachibowli', 'hitech-city'],
  },
  {
    slug: 'financial-district',
    name: 'Financial District',
    prose: 'the Financial District',
    aliases: ['Nanakramguda'],
    nearest: 'phoenix-arena',
    distance: 'about 10 km',
    title: 'Carnatic Music Classes near the Financial District',
    description:
      'Carnatic vocal classes for kids and adults in Nanakramguda and the Financial District, Hyderabad. RAAGA teaches at Hitech City, about 10 km away, or online.',
    intro:
      'Nanakramguda, Gowlidoddi and the Financial District are about 10 km from Phoenix Arena in Hitech City. Many families here plan the week around office hours on the Outer Ring Road, so we set out the real choice: a drive to Hitech City, a class hosted in your community, or live online lessons.',
    travel:
      'From the Financial District allow 20 to 30 minutes by car to Hitech City outside peak traffic, via the Gachibowli road or the Outer Ring Road. Weekday evenings along this stretch are slow, and a weekend class is often the easier commitment. Ask the team to confirm the Phoenix Arena meeting point before travelling.',
    alternative:
      'A residential community in Nanakramguda or the Financial District can host a RAAGA class on its own premises, arranged with the association. Online, the same Gurus teach the same syllabus live, which also suits parents who split the year between Hyderabad and a posting abroad.',
    neighbours: ['gachibowli', 'kokapet', 'manikonda', 'hitech-city'],
  },
]
