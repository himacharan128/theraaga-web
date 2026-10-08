import { Fragment } from 'react'

/**
 * An address should wrap between its parts ("Jawahar Colony," then
 * "Venkatagiri"), never inside one. Each comma-separated part is an
 * inline-block, so the preferred breaks fall between parts, and a part too
 * long for a narrow phone still wraps inside itself rather than overflowing.
 *
 * The text content is unchanged ("Road Number 24, Jawahar Colony,
 * Venkatagiri"), so copying, screen readers and the release check that looks
 * for the exact street all see the address as written.
 */
export function AddressLine({ text }: { text: string }) {
  const parts = text.split(/\s*[,\n]\s*/).filter(Boolean)
  return parts.map((part, i) => {
    const last = i === parts.length - 1
    return (
      <Fragment key={`${i}:${part}`}>
        <span className="inline-block">
          {part}
          {last ? '' : ','}
        </span>
        {last ? null : ' '}
      </Fragment>
    )
  })
}
