import { ImageResponse } from 'next/og'

/**
 * The WhatsApp preview card is, functionally, the real homepage — far more
 * people see it than ever load the site.
 *
 * Constraints encoded here:
 *  · 1200×630, the 1.91:1 that WhatsApp centre-crops to. All text is kept well
 *    inside the centre 80% so nothing is clipped on any client.
 *  · Locality is front-loaded, because WhatsApp truncates at roughly two lines
 *    on a phone.
 *  · LATIN ONLY. `next/og` caps the whole bundle at 500 KB, accepts only
 *    TTF/OTF/WOFF, and Satori has no automatic fallback for Devanagari — a full
 *    Noto Devanagari alone would blow the budget. The नादब्रह्म line is
 *    deliberately absent here and lives on the page instead.
 *  · System serif only, so there is no font fetch in the render path at all.
 *
 * WhatsApp caches previews per-URL for weeks with no purge tool, so FREEZE this
 * before the first link is forwarded. If it must change later, version the
 * distributed URL.
 */
export const alt =
  'RAGA: Carnatic music and vocal classes in Hyderabad. Jubilee Hills, Phoenix Arena Hitech City, or online.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#F7F3EA',
          padding: '84px 110px',
          fontFamily: 'Georgia, serif',
          position: 'relative',
        }}
      >
        {/* gold hairline — ornament doing a structural job */}
        <div
          style={{
            position: 'absolute',
            top: 56,
            left: 110,
            right: 110,
            height: 1,
            background: '#C9A227',
            opacity: 0.5,
          }}
        />

        <div
          style={{
            display: 'flex',
            fontSize: 26,
            letterSpacing: 10,
            color: '#8C6A15',
            textTransform: 'uppercase',
          }}
        >
          RAGA
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 26,
            fontSize: 62,
            lineHeight: 1.12,
            color: '#221E1A',
            maxWidth: 900,
          }}
        >
          Carnatic music &amp; vocal classes in Hyderabad
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 30,
            fontSize: 30,
            color: '#4A423A',
            maxWidth: 860,
          }}
        >
          Jubilee Hills · Hitech City · Online
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 38,
            fontSize: 25,
            color: '#6B1F2A',
          }}
        >
          For children and adults · Beginners welcome · Book a trial
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 56,
            left: 110,
            right: 110,
            height: 1,
            background: '#C9A227',
            opacity: 0.5,
          }}
        />
      </div>
    ),
    size,
  )
}
