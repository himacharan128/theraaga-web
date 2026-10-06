# RAAGA — theraaga.in

Marketing site for **RAAGA — School of Indian Classical Music, Hyderabad**.
For children and adults, taught since 2016 at two centres — Jubilee Hills and
Phoenix Arena, Hitech City — live online worldwide, and hosted in communities.

Content follows the client's own **Website Content Master** (`docs/`). Note that
document spells the school "RAGA"; the client has confirmed that is a typo — the
brand is **Raaga**, which is what the wordmark and the domain say.
Where this repo diverges from that document the divergence is deliberate and
documented at the point of code. There are exactly two:

1. **The enquiry form does not collect a child's name or exact age.** Their
   field list asks for "Student Name" and "Age" beside "Parent/Guardian"; we
   take the adult's name and a coarse age band instead. See the DPDP note in
   `src/lib/enquiry-schema.ts`.
2. **The hero carries one added factual line** under the client's subtitle,
   naming the centres and who it is for. Their hero is evocative but says
   neither what is taught nor where, and the mobile fold budget is 360×640.

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

Current measured budget: **325 KB** first view · 163 KB JS · 13 KB CSS · 112 KB
fonts · **0 third-party requests**. CSS used to be counted inside the JS figure
by a bad filter in `check-a11y-perf.mjs`; it now has its own line so neither is
unmeasured.

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

**Lineage claims come from the client, verbatim.** Their content master states
the Gurus were "trained under eminent maestros including…", so that claim is
theirs and is reproduced as written. What remains forbidden: attaching a
specific maestro to a specific Guru, naming an award, institution or year the
client did not name, or putting a number on "renowned cultural institutions".

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
    layout.tsx                bare root: <html>, fonts, metadata — shared by every surface
    (site)/                   public site; layout.tsx adds header, footer, sticky bar, trackers
                              (route group, no URL segment); the public pages
                              listed below all live inside it
    global-not-found.tsx      404 for unmatched URLs; supplies its own header and footer
    page.tsx                  Nāda — 8 sections, ~720 words
    about/                    Parampara
    gurus/                    Guru Parampara
    learning/                 Sādhana — the full syllabus
    events/  journal/         Sabha · Manana
    gallery/                  Anubhava
    contact/  thank-you/      Prārambham
    music-classes/[centre]/   one locality page per physical centre, from data
    online-classes/           search landing page; the homepage owns "Carnatic vocal classes
                              Hyderabad" (the retired /carnatic-vocal-classes-hyderabad 301s to /)
    privacy/ terms/ refund-policy/ child-safeguarding/   legal
    admin/                    NOT in (site): private, noindex dashboard with no public chrome
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

Navigation is the client's eight items in plain English: Home, About, The Gurus,
Learning, Events, Journal, Gallery, Contact. The Sanskrit kickers were removed at
the client's request — the Sanskrit still carries the meaning as each page's own
hero eyebrow, and the vanity paths (`/nada`, `/parampara`, `/sadhana`, `/guru`,
`/sabha`, `/manana`, `/anubhava`, `/prarambham`) 301 to these slugs, as do the
earlier `/teachers` and `/courses`.

Events and Journal publish what is real — the kinds of gathering RAAGA holds and
the subjects its Gurus write about — and neither fakes a dated calendar or an
article list.

`src/data/` is the seam. Keeping every query behind it is what makes a later move
to the Go/Echo API a find-and-replace rather than a rewrite, and it is the
Next.js docs' own security recommendation.

This repo lives inside the `raaga` meta-workspace alongside `theraaga-api/`,
`docs/` and `Credentials/`. Those are not part of this repository.

## Deploying

See `.env.example` for required variables. `vercel.json` pins functions to
`bom1` (Mumbai) — pair that with an Atlas cluster in AWS `ap-south-1` for ~1 ms
compute-to-DB and in-country data residency.

**No email address is published anywhere.** `site.email` is `null` by decision:
the domain has no MX, SPF or DKIM, and a published address that bounces is worse
than none. WhatsApp and the phone number are the contact routes, including on
the legal pages where a reachable channel is a DPDP requirement. Every consumer
is guarded and `npm run test:a11y` asserts no dead `mailto:`/`tel:` link ships.
Set `site.email` and it reappears everywhere automatically.

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

### Managed Google Search Console connections

The Search Console tab is a private, multi-connection integration — it is not
Google Analytics and it adds no third-party script, cookie, or pixel to the
public site. An administrator can connect one or more authorised Google
accounts, select the Search Console property for each, choose the dashboard
source, refresh reports, or disconnect an account. OAuth refresh tokens are
AES-256-GCM encrypted before they reach MongoDB.

Create a Google Cloud OAuth **Web application** client, configure the redirect
URI `https://admin.theraaga.in/api/admin/search-console/callback`, and set
`GSC_GOOGLE_CLIENT_ID`, `GSC_GOOGLE_CLIENT_SECRET`,
`GSC_TOKEN_ENCRYPTION_KEY` (a base64-encoded random 32-byte value), and
`CRON_SECRET` in Vercel. The admin Atlas user also needs `find`, `insert`,
`update`, and `createIndex` permissions for the `raaga` database collections
`search_console_connections`, `search_console_oauth_states`, and
`search_console_reports`. The scheduled Vercel job refreshes the selected
connection daily; Search Console itself typically finalises data two to three
days after a search.

### September 2026 reporting and local discovery update

The overview supports 7/30/90-day windows, the preceding equal-length period,
zero-filled daily activity, a status pipeline and New enquiries older than 48
hours. Traffic cards are aggregate events, never unique visitors. Ratios are
event ratios, not linked visitor conversion rates. Historical source counts
cannot be repaired: the updated collector sends only the external document
referrer hostname, with paths and query strings removed.

`/admin/growth` derives address/profile readiness from supplied content and
query opportunities from available Search Console reports. It is an action
list, not a live Google Business Profile verification service. The confirmed
Jubilee Hills address and coordinate pin were provided by the owner on
2026-09-15. Phoenix Arena address and exact hours remain unconfirmed. The owner
plans to create Business Profiles later; a map pin is not a verified listing.

`/getting-started` is an admissions guide linked from the footer and learning
hub and included in the sitemap. No invented teacher byline, review or award is
attached to it.

Run `node --import tsx scripts/test-reporting.ts` for OAuth-host routing and
reporting regressions. With a local server running, run
`node scripts/check-local-release.mjs` for desktop/mobile page, canonical,
address and authentication checks. Screenshots go to `/tmp/raaga-release-qa`.
Private production consent and database reports must be checked after release;
the local environment has no admin database or admin session credentials.

### October 2026 search content

`/guides` lists practical, sourced learning guides, read through `src/data/content.ts`
from `src/content/seed/learning-guides.ts`. These are admissions and learning
guides, not articles attributed to a Guru. Do not invent review dates, authors,
teacher credentials or class availability when extending them.

The homepage owns Hyderabad-wide Carnatic class intent. Centre pages own the
two actual locations. The five `/carnatic-music-classes/*` pages address learner
goals and are linked from `/learning`; beginner, adult and children paths also
appear on the centres, admissions guide and online page. New guides answer
distinct decisions rather than duplicating a landing page for every locality.
Add a guide through the seed data; its route, metadata and sitemap entry follow
automatically. Add contextual links from relevant existing pages as well.

`npm run test:seo-intents` checks guide metadata, anchors and content alongside
the intent pages. After a production build, start on a free port and run
`npm run test:seo-crawl -- http://localhost:3002` to check HTTP responses,
canonical URLs, sitemap reachability through rendered links, and private-page
exclusions. `/thank-you` is crawlable so its `noindex` can be read; it is never
in the sitemap. Do not block it in robots.txt.

Search improvements should be judged using non-brand queries, relevant page
impressions and enquiries, not total average position alone. Report date ranges
and avoid treating clicks as unique people or enquiries. Business Profile
verification and Phoenix Arena address/hours still need owner-supplied facts.

### AI referral reporting and teacher contributions

The private overview separates recognised AI referrer page views from AI-tagged
page views. Host checks cover ChatGPT, Claude, Perplexity, Gemini and Copilot.
Campaign tags alone are not proof of a referral. A recognised referrer takes
priority over a tag, and each page view is counted only once within this report.
Classification uses all source pairs in the selected period, before the ordinary
traffic-source list is limited to its top eight rows.

This reads the existing `analytics_daily` aggregates. There is no additional
tracking script, cookie, identifier, collection or permission requirement. Google
and Bing referrers are not labelled as AI because ordinary search and AI traffic
cannot be separated from those hostnames. Missing referrers, repeat views and
blocked telemetry limit interpretation. These are not citation counts, unique
visitors or person-level conversion reports.

The Growth plan contains teacher contribution briefs. They are preparation
checklists, not published articles or saved workflow statuses. Before publishing,
obtain actual teacher material, factual review and permission for any attribution
or media. Keep admissions guides distinct from teacher-authored articles. Do not
create duplicate promotional blogs or pretend that RAAGA controls AI rankings.

Run `npm run test:reporting` for source classification, admin routing, reporting
period and rendered report checks. Production data rendering still requires an
authenticated check after deployment.
