# RAAGA — theraaga.in

Marketing site for **RAAGA — School of Indian Classical Music, Hyderabad**.
Carnatic vocal for children and adults, taught since 2016 at two centres —
Jubilee Hills and Phoenix Arena, Hitech City — and live online worldwide.

Next.js 16 (App Router, Cache Components) · MongoDB · Tailwind 4 · no third-party runtime scripts.

---

## Run it

```bash
npm install
npm run dev          # http://localhost:3000 — works with zero external services
```

With no `MONGODB_URI`, enquiries append to `.leads/leads.jsonl` (gitignored) so the
form is exercisable locally. **A production deploy without `MONGODB_URI` refuses
enquiries rather than losing them** — serverless filesystems are ephemeral.

## Verify

```bash
npm run lint         # eslint (next/core-web-vitals + typescript)
npm run verify       # typecheck · contrast · no-prices · enquiry validation
npm run test:e2e     # real form submission through a browser (needs the server running)
npm run test:a11y    # accessibility + performance budget (run against `npm run start`)
npm run build:fonts  # re-subset the fonts after adding Devanagari copy
```

Current measured budget: **293 KB** first view · 164 KB JS · 112 KB fonts · **0 third-party requests**.

`test:e2e` generates a unique phone number per run and deletes its own lead
afterwards — it writes to whatever storage is configured, including the real
Atlas cluster, so it must never leave rows in the client's enquiry list.

---

## Rules this codebase enforces

These are not preferences. Each is checked, and several are load-bearing legally.

**No prices. Anywhere. Ever.** No rate card, no "from ₹—", no fee chips, and no
`priceRange`/`offers` in structured data. Fees are a WhatsApp conversation.
`npm run test:no-prices` fails the build on any numeric price or price-bearing
schema key. The `programs` model has no fee fields at all, deliberately — an
unused price field is an invitation to render one.

**Never collect a child's identity.** The enquiry form takes the *adult's* name
and number plus a coarse age band. No child name, no date of birth. A child
enquiry additionally requires explicit guardian confirmation. Under the DPDP Act
2023 a child is anyone under 18 and children's-data failures reach ₹200 crore.

**Consent is a query-level gate, not a UI condition.** Gallery items and
testimonials that depict a minor without recorded guardian consent are filtered
out in `data/content.ts`, where no component can bypass them.

**No advertising pixels, permanently.** No Meta Pixel, no Google Ads
remarketing. DPDP s.9(3) bans behavioural advertising directed at children even
with parental consent, and the educational-institution carve-out covers enrolled
students, not a public marketing page.

**Measurement is first-party and aggregate only.** The public site sets no
analytics cookie and sends no identifier, IP address, raw user agent, full
referrer or query string to analytics storage. It records daily counts for
routes, broad device buckets, attribution labels and Vercel-provided coarse
location headers. The password-protected dashboard is the only place those
aggregates and adult enquiries may be read.

**Never render a zero, an empty carousel, a silhouette, or a placeholder frame.**
Every section declares its own empty state via `<Section renderIf fallback>`.
Merit School of Music and Furtados both currently ship live homepages reading
"0 +" because a count-up never fired. Stats are strings, never integers.
There is deliberately no `PlaceholderFrame` component: an image slot captioned
"photograph to follow" tells every visitor the site is unfinished. Where an
asset is missing, the design is text-led instead.

**Lineage claims are institutional, never personal.** The Teachers page says
"the school's teaching lineage draws on…". It must never imply that a named
maestro personally taught a specific current teacher — that is a claim only the
client can make, and only if true.

**No fabricated content.** No placeholder testimonials, faculty or student
photos. A fabricated testimonial is a misleading advertisement under the CCPA
Guidelines 2022 (₹10 lakh, ₹50 lakh repeat).

**Do not touch `htmlLimitedBots`.** WhatsApp is already in Next's default list,
and any custom value *replaces* the default — which would break link previews
for Google, Bing, Twitter, LinkedIn, Slack, Discord and Facebook on a site whose
entire go-to-market is link sharing.

---

## Structure

```
src/
  app/
    page.tsx                  Nāda — 8 sections, ~680 words
    about/  courses/          Parampara · Sādhana
    teachers/  gallery/       Guru Parampara · Anubhava
    contact/  thank-you/      Prārambham
    music-classes/[centre]/   one locality page per physical centre, from data
    carnatic-vocal-classes-hyderabad/  online-classes/   search landing pages
    privacy/ terms/ refund-policy/ child-safeguarding/   legal
  components/
    layout/        Header, Footer, Section (the degradation wrapper), PageHero
    sections/      composable sections, each with a full and an empty state
    ui/            Button, Accordion, SwaraStrip (Web Audio), Ornament
  content/         types + seeded content — the v1 source of truth
  data/            server-only DAL. NOTHING in app/ or components/ imports mongodb
  lib/             Zod schema, WhatsApp links, analytics
scripts/           font subsetting + the verification suites
public/fonts/      subsetted woff2, generated by `npm run build:fonts`
```

Navigation is English-primary with Sanskrit as the kicker — Home/Nāda,
About/Parampara, Courses/Sādhana, Teachers/Guru Parampara, Gallery/Anubhava,
Contact/Prārambham. The Sanskrit vanity paths 301 to the English slugs.
Events and Journal are deliberately absent until there is real dated content.

`src/data/` is the seam. Keeping every query behind it is what makes a later move
to the Go/Echo API a find-and-replace rather than a rewrite, and it is the
Next.js docs' own security recommendation.

This repo lives inside the `raaga` meta-workspace alongside `theraaga-api/`,
`docs/` and `Credentials/`. Those are not part of this repository.

## Deploying

See `.env.example` for required variables. `vercel.json` pins functions to
`bom1` (Mumbai) — pair that with an Atlas cluster in AWS `ap-south-1` for ~1 ms
compute-to-DB and in-country data residency.

**Freeze the OG image before distributing any link.** WhatsApp caches previews
per-URL for weeks with no purge tool, and the forwarded card is seen far more
often than the page itself.

### Private operations dashboard

The same Vercel deployment serves `admin.theraaga.in`; it resolves to the
private `/admin` route and is explicitly `noindex`. Add the subdomain to the
Vercel project, then configure a DNS CNAME as Vercel specifies for that domain.

Set `ADMIN_USERNAME`, a newly generated `ADMIN_PASSWORD_HASH`, and a high-entropy
`ADMIN_SESSION_SECRET` in Vercel. Never reuse or type a password into a chat.
Run `npm run admin:password-hash` locally to create the scrypt hash without
printing the password. Also create a separate Atlas user for `MONGODB_ADMIN_URI`:
it needs only read/update access to `raaga.leads` and read/write access to
`raaga.analytics_daily`; do not reuse the public insert-only enquiry user.

The dashboard shows 30-day cookieless aggregate traffic, source host/UTM,
coarse Vercel location, device bucket, engagement events and adult enquiries.
Google Search Console query metrics require a dedicated server-side OAuth setup
and are intentionally not collected through a browser analytics pixel.
