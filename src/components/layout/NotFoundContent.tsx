import { PageHero } from '@/components/layout/PageHero'
import { ButtonLink } from '@/components/ui/Button'

/**
 * The 404 message, shared by the two not-found boundaries so they cannot
 * drift: `(site)/not-found.tsx` (notFound() inside a public page, already
 * wrapped in the site chrome) and `global-not-found.tsx` (unmatched URLs, which
 * bypass every layout and must add the chrome themselves).
 */
export function NotFoundContent() {
  return (
    <PageHero
      eyebrow="404"
      title="We could not find that page."
      lede={
        <p>
          The link may be old or mistyped. You can start again from the home
          page, or get in touch and we will help.
        </p>
      }
    >
      <div className="flex flex-wrap gap-4">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink variant="secondary" href="/contact">
          Contact us
        </ButtonLink>
      </div>
    </PageHero>
  )
}
