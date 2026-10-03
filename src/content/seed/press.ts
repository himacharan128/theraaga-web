import metroIndia from '@/assets/press/metro-india-2026-09-26.jpg'
import sakshi from '@/assets/press/sakshi-2026-09-26.jpg'
import andhraJyothy from '@/assets/press/andhra-jyothy-2026-06-26.jpg'
import type { PressMention } from '../types'

/**
 * Newspaper coverage of RAAGA events, newest first.
 *
 * These are real clippings supplied by the owner. Each image is kept whole:
 * the masthead and the printed source line at its foot are the attribution, so
 * neither may be cropped off. Headlines are exactly as printed. The English
 * glosses on the Telugu headlines are translations and are labelled as such by
 * the component; they are never presented as the paper's own wording.
 *
 * Every clipping shows adults only, so none needs a consent block.
 */
export const pressMentions: PressMention[] = [
  {
    id: 'press-metro-india-2026-09-26',
    publication: 'Metro India',
    language: 'en',
    date: '2026-09-26',
    headline: 'Classical concert and Kolatam mark Ganapati Navaratri celebrations',
    occasion: 'Ganapati Navaratri concert, Jubilee Hills',
    clipping: metroIndia,
  },
  {
    id: 'press-sakshi-2026-09-26',
    publication: 'Sakshi',
    language: 'te',
    date: '2026-09-26',
    headline: 'ఆకట్టుకున్న కర్ణాటక శాస్త్రీయ సంగీత కచేరీ',
    headlineEnglish: 'A captivating Carnatic classical concert',
    occasion: 'Ganapati Navaratri concert, Jubilee Hills',
    clipping: sakshi,
  },
  {
    id: 'press-andhra-jyothy-2026-06-26',
    publication: 'Andhra Jyothy',
    language: 'te',
    date: '2026-06-26',
    headline: 'ఘనంగా ఆణి తిరుమంజనోత్సవాలు',
    headlineEnglish: 'Aani Thirumanjanam festival celebrated in grand style',
    occasion: 'Aani Thirumanjanam festival, Nataraja Swamy temple, Tamil Nadu',
    clipping: andhraJyothy,
  },
]
