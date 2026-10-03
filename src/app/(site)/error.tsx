'use client'

import { useEffect } from 'react'
import { Button, ButtonLink } from '@/components/ui/Button'
import { whatsappHref } from '@/lib/whatsapp'

/**
 * The public error boundary. Until now a server error on any marketing route
 * rendered Next's unstyled default — on the one page view where the visitor has
 * already decided something is wrong.
 *
 * Two deliberate choices. It offers WhatsApp, because a parent who hit an error
 * on the way to enquiring should not have to come back later to do it; the
 * school's contact route does not depend on this page working. And it shows no
 * stack, message or digest — error text can carry internal paths and query
 * detail, and it is useless to the reader either way.
 */
export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Server-side errors are already captured in the platform logs; this is the
    // only record of a client-side one. console.error, not telemetry: the
    // analytics transport is a fixed event union and this is not one of them.
    console.error('[raaga] route error', error.digest ?? error.message)
  }, [error])

  return (
    <section className="section-shell section-shell--default py-[var(--spacing-section)]">
      <div className="u-shell">
        <p className="u-eyebrow mb-4">Something went wrong</p>
        <h1 className="max-w-[18ch] text-[length:var(--text-step-4)]">
          This page didn’t load.
        </h1>
        <p className="u-measure mt-6 text-[length:var(--text-step-0)] text-text-secondary">
          The fault is ours, not yours. Trying again usually works. If it
          doesn’t, a message reaches us directly.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button type="button" onClick={reset}>
            Try again
          </Button>
          <ButtonLink href="/" variant="secondary">
            Back to the homepage
          </ButtonLink>
          <ButtonLink
            href={whatsappHref('ERROR')}
            variant="ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            Message us on WhatsApp
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
