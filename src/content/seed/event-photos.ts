import type { EventPhoto } from '../types'

/**
 * Photographs from RAAGA's own events, shown on /events.
 *
 * EVERY ENTRY IS GATED, ON PURPOSE. Most of these pictures plainly show
 * children, and a child is anyone under 18 under the DPDP Act 2023. The privacy
 * notice promises that no photograph of a student under eighteen is published
 * without specific written guardian consent. Ages cannot be verified from a
 * photograph, so the conservative default applies to all of them:
 * `hasMinors: true, guardianConsentObtained: false`. `getEventPhotos()` in
 * `src/data/content.ts` filters these in the query, so today /events shows no
 * photograph and no gallery heading at all.
 *
 * HOW THE OWNER RECORDS CONSENT, per photograph:
 *   1. Obtain the guardians' specific written consent for every minor in it.
 *   2. Set `guardianConsentObtained: true` and add `obtainedAt: 'YYYY-MM-DD'`.
 *      (If, after checking, nobody under 18 appears, `hasMinors: false` is the
 *      other way through the gate.)
 *   3. Un-ignore that one file by adding `!public/events/<file>.jpg` to
 *      `.gitignore`, directly under `public/events/*`. Until then the file is
 *      kept out of git, because this repository is PUBLIC and committing a file
 *      publishes it.
 *
 * The files are `/events/<name>.jpg` in `public/`, resized to 1600px at most
 * with every byte of metadata (including GPS) stripped. `media.src` is a plain
 * string path, not an import, so a gated photograph is never bundled.
 *
 * Alt text describes only what is visible. No names.
 *
 * The order is the display order, grouped by occasion. The occasion captions
 * are the owner's; the Tyagaraja Aradhana is held at Thiruvaiyaru, and
 * "Aynavilli" is spelled as she wrote it.
 */
const gated = { hasMinors: true, guardianConsentObtained: false } as const

export const eventPhotos: EventPhoto[] = [
  {
    id: 'event-img-0707',
    occasion: 'Annual concerts',
    media: {
      src: '/events/img_0707.jpg',
      alt: 'Singers in silk saris seated on a pink carpet in front of an orange wall, with a violinist at the left and a mridangam player at the right',
      aspect: '3/2',
    },
    consent: { ...gated },
  },
  {
    id: 'event-img-0825',
    occasion: 'Annual concerts',
    media: {
      src: '/events/img_0825.jpg',
      alt: 'Girls and women in bright traditional dress singing together on a low stage, with a mridangam player at the right and a flowering tree behind them',
      aspect: '3/2',
    },
    consent: { ...gated },
  },
  {
    id: 'event-img-3028',
    occasion: 'Annual concerts',
    media: {
      src: '/events/img_3028.jpg',
      alt: 'Singers seated on the floor of a courtyard under strings of lights, holding sheets of notes, with a stringed instrument leaning at the left',
      aspect: '16/9',
    },
    consent: { ...gated },
  },
  {
    id: 'event-img-3030',
    occasion: 'Annual concerts',
    media: {
      src: '/events/img_3030.jpg',
      alt: 'Singers seated on a striped mat keeping time with their hands, with a garlanded deity picture behind them and girls sitting on a low wall at the right',
      aspect: '16/9',
    },
    consent: { ...gated },
  },
  {
    id: 'event-img-0834',
    occasion: 'Cultural events',
    media: {
      src: '/events/img_0834.jpg',
      alt: 'Singers seated close together on a white sheet in a room, with microphones in front of them and children holding up phones in the foreground',
      aspect: '4/3',
    },
    consent: { ...gated },
  },
  {
    id: 'event-img-0843',
    occasion: 'Cultural events',
    media: {
      src: '/events/img_0843.jpg',
      alt: 'Group portrait of adults and children in festive traditional dress, standing and kneeling in rows against a white wall',
      aspect: '3/2',
    },
    consent: { ...gated },
  },
  {
    id: 'event-img-0861',
    occasion: 'Cultural events',
    media: {
      src: '/events/img_0861.jpg',
      alt: 'An evening concert in an open-air amphitheatre, with young singers and a mridangam player on a carpeted stage and an audience on the stone steps',
      aspect: '3/2',
    },
    consent: { ...gated },
  },
  {
    id: 'event-img-0863',
    occasion: 'Cultural events',
    media: {
      src: '/events/img_0863.jpg',
      alt: 'A man in white seated beside young singers on a carpeted stage at dusk, with microphones, floodlights and an audience seated on patterned paving',
      aspect: '3/2',
    },
    consent: { ...gated },
  },
  {
    id: 'event-img-2106',
    occasion: 'Saraswati Puja',
    media: {
      src: '/events/img_2106.jpg',
      alt: 'Group photograph of women, a man and a boy seated and standing around a garlanded framed picture and a small deity statue',
      aspect: '4/3',
    },
    consent: { ...gated },
  },
  {
    id: 'event-img-2489',
    occasion: 'Concert at the Aynavilli temple',
    media: {
      src: '/events/img_2489.jpg',
      alt: 'Singers seated on a striped platform at a temple concert, with microphones in front of them and stone pillars behind',
      aspect: '3/2',
    },
    consent: { ...gated },
  },
  {
    id: 'event-img-2492',
    occasion: 'Concert at the Aynavilli temple',
    media: {
      src: '/events/img_2492.jpg',
      alt: 'Women singing side by side at a temple concert beneath a fringed canopy, with onlookers standing behind them',
      aspect: '3/2',
    },
    consent: { ...gated },
  },
  {
    id: 'event-img-2689',
    occasion: 'Concert at the Aynavilli temple',
    media: {
      src: '/events/img_2689.jpg',
      alt: 'Singers seated on the floor of a temple hall around microphones, with a banner hung behind them and garlanded pictures at the right',
      aspect: '4/3',
    },
    consent: { ...gated },
  },
  {
    id: 'event-img-5123',
    occasion: 'Tyagaraja Aradhana at Thiruvaiyaru',
    media: {
      src: '/events/img_5123.jpg',
      alt: 'Rows of women in colourful saris seated on sand behind rope barriers and microphones, under a large decorated tent with bright lights',
      aspect: '4/3',
    },
    consent: { ...gated },
  },
]
