import { PageHero } from '@/components/layout/PageHero'
import { ButtonLink } from '@/components/ui/Button'

/**
 * The 404 message, shared by the two not-found boundaries so they cannot
 * drift: `(site)/not-found.tsx` (notFound() inside a public page, already
 * wrapped in the site chrome) and `global-not-found.tsx` (unmatched URLs, which
 * bypass every layout and must add the chrome themselves).
 *
 * Set as a statement: the one sentence at hero scale and the two ways on
 * beside it, with nothing else competing for a visitor who is already lost.
 * It is the whole page, so it keeps a page's foot before the footer.
 */
export function NotFoundContent() {
  return (
    <div className="pb-[clamp(3.5rem,8vw,7rem)]">
      <PageHero
        variant="statement"
        eyebrow="404"
        title="We could not find that page."
        lede={
          <p>
            The link may be old or mistyped. You can start again from the home
            page, or get in touch and we will help.
          </p>
        }
      >
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink variant="secondary" href="/contact">
          Contact us
        </ButtonLink>
      </PageHero>
    </div>
  )
}
