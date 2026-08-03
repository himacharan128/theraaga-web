import { ButtonLink, WhatsAppIcon } from '@/components/ui/Button'
import { Section } from '@/components/layout/Section'
import { shareHref } from '@/lib/whatsapp'

/**
 * The clubhouse channel is the founder's actual go-to-market, and no competitor
 * found does this at all.
 *
 * Note the second CTA: the entire distribution model is a resident pasting a
 * link into an apartment-complex WhatsApp group, and until now we gave that
 * person nothing. One wa.me link with a pre-written pasteable message is the
 * cheapest growth mechanic on the page.
 *
 * The "six families" line is softened from a promise to a norm, because
 * Hyderabad clubhouses are controlled by the residents' association or the
 * builder's facility manager — not by the parent reading this.
 */
export function CommunityCta() {
  return (
    <Section id="communities-cta" tone="accent">
      <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="u-eyebrow !text-[color-mix(in_srgb,var(--color-on-accent)_72%,transparent)]">
            For gated communities
          </p>
          <h2 className="mt-4 text-[length:var(--text-step-3)] font-[300] text-on-accent">
            We bring Carnatic music to your community.
          </h2>
          <p className="u-measure mt-5 text-[color-mix(in_srgb,var(--color-on-accent)_88%,transparent)]">
            No drop-offs, no traffic, no Sunday morning lost. Six interested
            families is usually enough to open a batch in your clubhouse — and
            we’re happy to speak to your residents’ association with you.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <ButtonLink variant="onAccent" href="/communities">
            Start a batch in your community
          </ButtonLink>
          <ButtonLink
            variant="ghost"
            href={shareHref()}
            className="!text-[color-mix(in_srgb,var(--color-on-accent)_88%,transparent)] justify-center"
          >
            <WhatsAppIcon />
            Share with your community group
          </ButtonLink>
        </div>
      </div>
    </Section>
  )
}
