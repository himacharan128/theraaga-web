# Activity log

The working record of this website: every request, the decision behind it, what
was built, how it was verified, and what shipped.

This file is **committed**, so it travels with the code and survives a lost
laptop. Each entry sits in git history beside the commits that implemented it.

**What does not go here:** secrets, connection strings, password hashes, tokens,
or any credential value. Those live in `Credentials/RAAGA-OPERATIONS.md`, which
is local-only and never committed. Reference a secret by *name* here if you must
("rotated `ADMIN_SESSION_SECRET`") and never by value.

Newest entry first.

---

## 2026-10-09: Site redesign, header fix and homepage intro

- **Requested:** On 2026-10-08 Bhasuri asked for a full revamp of the public
  site's look with the words unchanged, a fix for the header vanishing on cream
  pages, and a cinematic homepage intro. After seeing the intro on localhost
  she set its rule: the full version on every new tab, never on a refresh. She
  reviewed all three on localhost and approved them for production.
- **Decision / scope:** A second-generation design system read as a concert
  programme: parchment grounds ruled with hairlines, light literary display
  type, Inter for anything operated (buttons, menu, chips and labels had been
  falling back to the serif), and whole chapters changing ground (parchment,
  paper, sand, the dark stage, the maroon close) instead of coloured boxes.
  Every public page rebuilt on it; copy unchanged apart from long dashes. The
  header now takes its ink from what is actually beneath it, so a page Next
  keeps hidden in the document after a visit can no longer set it. The intro,
  "sound becoming form", plays once per tab on a fresh arrival at `/` from
  outside the site: 2.9 s on a desktop, shorter on a phone, a plain fade under
  reduced motion. Never on a reload, back or forward, a second arrival in the
  same tab, a background tab or a deep link. Any key, tap, wheel or scroll
  lifts it; it keeps only a per-tab sessionStorage flag and fails open. The
  admin portal is not restyled.
- **Work completed:** The intro in `src/components/intro/` (score, runtime,
  markup). `globals.css` split into ordered partials in `src/app/styles/`
  (tokens, tones, base, type, components, motion, chrome, intro) so no file
  passes 500 lines. `Header`, `Footer`, `StickyMobileBar`, `PageHero`,
  `Section`, `Prose` (new, the legal pages as a numbered document with a
  contents rail), `Reveal` and `AddressLine` (new), and every section and page
  under `src/app/(site)`. New checks: `test:no-long-dashes` in `verify`, and
  `test:intro` (Chromium and WebKit) after `test:a11y`, which now also checks
  header legibility across client-side navigation.
- **Verification:** `verify`, lint and production build pass. `test:a11y`
  93/93 on the production build: JS 169 KB, CSS 15 KB, fonts 112 KB, total
  353 KB, zero third-party requests; no budget raised. `test:intro` 93/93,
  including LCP 212 ms with the intro against 204 ms without and CLS 0.
  `test:e2e` 13/13 against a dev server with `MONGODB_URI` empty. The
  stylesheet split was built before and after: every CSS and JS file
  byte-identical.
- **Deployment / production status:** PR #12 merged to main (`4f9d829`);
  Vercel production deploy succeeded. Verified on theraaga.in in Chromium and
  WebKit with analytics blocked: the intro plays in a new tab and not on a
  reload or an inner page, the phone and reduced-motion versions run, the
  header reads at 15:1 on Contact after the Gurus page, all 25 sitemap pages
  answer 200, the 404 page renders, no console errors. Production CSS is
  byte-identical to the tested build.
- **Follow-up / owner action:** Bhasuri to decide whether the intro gets a
  visible Skip button (any tap or key already skips it), "Prārambha" or
  "Prārambham", whether number ranges such as the age bands keep their en
  dash, rights to the hero photograph, the empty Gallery wording, and whether
  the admin portal is restyled. Note: the first visit after a deploy can miss
  the intro while the homepage cache is rebuilt, because the intro skips any
  page that took over 2.5 s to arrive.
- **Credential or access impact:** none.

---

## 2026-10-06: Motion and ornament on the homepage

- **Requested:** The owner found the site stagnant and template-like and asked
  for a much livelier design with many animations, traditional rather than
  modern, with the copy unchanged. A first attempt that changed the ground to a
  dark maroon and the display face to Rozha One was shown on localhost and
  rejected ("lets not change font and colors lets improve the existing one").
  It is parked, unpushed, on `design/kutcheri-revamp` and did not ship.
- **Decision / scope:** Keep every colour token, typeface and radius from the
  2026-10-05 design. Add movement and a small ornament family, all in CSS with
  no JavaScript and no new requests: the hero headline rises word by word,
  four tanpura strings hum in the left margin on wide screens, rings of sound
  leave the headline, the photograph breathes slowly, the seven swaras pass
  along the hero's bottom edge, section headers and card grids reveal on
  scroll with CSS view timelines, the pillar watermarks drift against the
  scroll, the trial thread draws in, swara keys send out a ring when they
  sound, and the filled button's hover sweeps in. Ornament: a short gold rule
  before every kicker, gold corner brackets and a numeral on the centre cards,
  a zari border above the closing band and a kolam generated from rosette
  curves. Everything stops under prefers-reduced-motion and no content is
  hidden when an animation cannot run. Homepage and shared primitives only;
  inner pages inherit the kicker rule, button hover and section reveal.
- **Work completed:** `globals.css` (motion and ornament blocks, kicker rule,
  slow step 420 ms), `Ornament` (Strings, NadaRings, SwaraMarquee, Kolam,
  ZariBand), `Hero`, `Section`, `TrustStrip`, `Centres`, `Pillars`,
  `ListenWatch`, `TrialProcess`, `FinalCta`, `Button`, `SwaraStrip`.
  `check-a11y-perf.mjs` now ignores inline `data:` URIs in the third-party
  count; they have no host and are not requests.
- **Verification:** `test:contrast`, `test:no-prices`, `test:enquiry`,
  `test:seo-intents`, lint and production build pass. `test:a11y` 76/76
  against the production build with `MONGODB_URI` empty: JS 163 KB, CSS 14 KB,
  fonts 112 KB, total 322 KB, zero third-party requests. Fold checked at 390
  and 1440 px; the primary button stays above the fold at both. `test:e2e`
  not run: no form or data change.
- **Deployment / production status:** Merged to main; Vercel production
  deploy; verified on theraaga.in.
- **Follow-up / owner action:** Roll the same vocabulary to About, The Gurus,
  Learning, Events and Contact once the homepage has been seen live. A second
  session was editing SEO pages in the same checkout on this date; its work is
  separate and was not included here.
- **Credential or access impact:** none.

---

## 2026-10-05: Quieter, more consistent visual design

- **Requested:** Bhasuri found the UI overloaded with effects and asked for a
  polish pass without touching copy, page structure, data or routing.
- **Decision / scope:** One maroon, taken from the logo (#834848), with darker
  hover (#6E3A3A) and deep (#612A2C) steps. Flat ivory ground, with off-white
  only for forms and clickable cards. Removed the page grain, the radial washes,
  the section gradients and the decorative circles. Buttons cut from five
  variants to three (filled, outline, text). Radii 8 / 12 / 16 px, no shadows
  at rest, one motion scale (120 / 180 / 240 ms), a 160 ms route fade. Plain
  solid header, docked mobile bar. Non-clickable groups became ruled lists;
  cards are kept for centres, learning paths, press clippings and the form.
  Removed the unused orbit/breathe animations, `Reveal` and `TanpuraRule`. A
  second, editorial redesign was tried the same day and rejected before it
  shipped; it is not in this change.
- **Work completed:** `globals.css` tokens, `Button`, `Header`,
  `StickyMobileBar`, `Accordion`, `Section`, `PageHero` and 20 section and page
  components. `check-contrast.ts` updated to the new palette. Browser theme
  colour set to the logo maroon. The admin portal and the OG image are unchanged.
- **Verification:** `test:contrast`, `test:no-prices`, `test:enquiry`,
  `test:seo-intents`, lint and production build pass. `test:a11y` 76/76 against
  the production build. `test:e2e` 13/13 against a dev server with local lead
  storage. No horizontal overflow at 360, 390, 412, 820 or 1440 px.
- **Deployment / production status:** Merged to main; Vercel production deploy.
- **Credential or access impact:** none.

---

## 2026-10-03 — New change flow and the never-focus-Safari rule

- **Requested:** Bhasuri set two hard rules.
  - Never bring Safari to the front.
  - Every change follows: do it → localhost → tell her where to review → her
    confirmation → ship all the way to production.
- **Decision / scope:** This replaces the old 10-step loop that asked her to
  confirm a proposal before building. Her confirmation after reviewing on
  localhost is now the single gate. Requests that would break a legal constraint
  are still raised before building.
- **Work completed:** Rewrote "Working with Bhasuri" and the Browser paragraph in
  `CLAUDE.md`. Updated the workspace `CLAUDE.md` and project memory to match.
  Messaged the three running sessions.
- **Verification:** Docs-only change; no application code touched.
- **Deployment / production status:** Merged to main.
- **Credential or access impact:** none.

---

## 2026-10-03 — Publish all event photographs with recorded guardian consent

- **Requested:** Bhasuri asked for all event photographs to be shown.
- **Decision / scope:** 14 photographs depicting children were consent-gated.
  Bhasuri confirmed the school holds guardian consent for every child in them,
  so each now records `guardianConsentObtained: true, obtainedAt: '2026-10-03'`.
  The consent records are kept by the school, not in this repo. `consentGate()`
  is unchanged and still filters any future photograph added without consent.
  The privacy notice's written-consent promise remains accurate, so it was not
  changed.
- **Work completed:** Updated the consent records in
  `src/content/seed/event-photos.ts`. Added 14 `.gitignore` negations and
  committed the 14 files. All 18 event photographs now render, in 6 occasion
  groups including the Ainavilli temple concert. Metadata, including GPS, is
  stripped from every file.
- **Verification:** `npm run verify`, `lint` and `build` pass; `test:a11y` 76
  passed, 0 failed, 321 KB total.
- **Deployment / production status:** Merged and verified on production.
- **Access:** The auto-mode safety check blocked committing these photographs
  to the public repo. Bhasuri added her own project-local allow rules for
  `git add`, `git commit`, `git push` and `gh pr merge` in
  `Dev/Raaga/.claude/settings.local.json` (not committed).
- **Credential or access impact:** none.

---

## 2026-10-03 — Owner's content pass: home, Gurus, Learning, Events, logo

- **Requested:** Bhasuri reviewed the site page by page and asked for specific
  copy, layout and content changes, new photographs and press coverage, a
  site-wide spelling check, and a crisp logo.
- **Decision / scope:**
  - Copy changes are the owner's own words or direct edits she asked for.
  - The two maestro lines and the book notes were drafted from the content
    master, then approved by her.
  - She was told twice that the tambura photograph (probably from Pinterest)
    and the Nookala portrait (The Hindu) appear to belong to other publishers.
    She chose to publish them.
  - **Event photos depicting children are consent-gated.** 14 photos are seeded
    with `hasMinors: true` and no recorded consent, so `consentGate()` filters
    them. Their files are excluded from this public repo by `.gitignore` until
    consent is recorded per photo, with a negation line for each one cleared.
    The 4 adult-only temple photos are live.
- **Work completed:**
  - *Home.* "A decade" replaces 2016; the hero line says "Carnatic vocal
    classes". The centres are titled "RAAGA, Jubilee Hills/Phoenix Arena".
    Online and Community are boxed like the centres, with Community highlighted.
    "Gulf" is gone from the Online card. "Meet the tradition" is removed, and the
    tambura photograph sits in the hero card.
  - *Gurus.* "How we teach", "Recognition and honours" and Sri Dwaram
    Durgaprasada Rao are removed. Padma Bhushan Dr. Nookala Chinna
    Satyanarayana gets a portrait card. Both books show their covers.
  - *Learning.* Level badges, week estimates, the source footnote and the
    "Find your starting point" hub are removed.
  - *Events.* "In the press" (Metro India, Sakshi, Andhra Jyothy) and "From our
    gatherings", grouped by occasion. All photo metadata, including iPhone GPS,
    is stripped.
  - *Spelling.* Every page plus alt text and metadata was checked against a
    dictionary. "Ainavilli" (owner's spelling) and "Thiruvaiyaru" are fixed, and
    one FAQ is aligned to "Alankaras" and "Geetams".
  - *Logo.* The raster wordmark had white-filled "g" counters and a clipped
    final "a". It is replaced by a potrace vector of the client's 2000px master
    (`raaga-wordmark.svg`, currentColor, evenodd holes). The footer lockup now
    links home in ivory on the dark footer. The structured-data logo is now
    `raaga-logo.png`.
- **Files or services changed:** Home, Gurus, Learning and Events pages and their
  components; seeds; `.gitignore`; `public/brand/`; `public/events/` (4 cleared
  files); `src/assets/`.
- **Verification:** `npm run verify`, `lint` and `build` pass. `test:a11y` gives
  76 passed, 0 failed, with budgets met. Gated photo URLs are absent from the
  rendered pages, and no gated image file is tracked by git.
- **Deployment / production status:** Shipped as the next PR; verified on
  production after merge.
- **Follow-up / owner action:**
  - Record guardian consent per event photo to publish the other 14.
  - Supply a higher-resolution Swararaga Kadambam cover and the tambura original.
  - The intent pages are no longer linked from the visible site since the hub
    was hidden; they remain in the sitemap.
  - Workspace rule added: never bring Safari to the front.
- **Credential or access impact:** none.

---

## 2026-10-03 — Restore the client's paisley emblem to the brand lockup

- **Requested:** "This is the logo. This is missing in my website. Make it proper
  clarity and then add it to assets and then add it wherever logo is required,
  beside Raaga." Supplied as a gold image pasted into chat.
- **Decision / scope:** The chat image was not used as the source. The client's
  own master lockup — the paisley emblem *and* the `raaga` wordmark together — is
  embedded at 2000x2000 in `docs/Music Teaching Portfolio Design.pdf`, and the
  designer's website mockup in the same deck places the emblem to the left of the
  wordmark in both header and footer. That settled both the artwork and its
  placement from client material rather than from a redraw, which the
  never-fabricate rule requires.
- **Work completed:** Extracted the master lockup from the PDF's embedded image
  streams. The motif within it is only 136x547 and soft-edged, so it was traced
  to vector (potrace, over a smoothed coverage field — a direct trace encodes the
  blur as thousands of nodes) rather than shipped as a blurry raster. Result:
  `public/brand/raaga-emblem.svg`, 31 KB on disk, 10.7 KB gzipped, sharp at any
  size. It is painted as `currentColor` through a CSS mask, so one cached file
  serves the ivory header, the maroon footer and admin instead of one export per
  colourway. New `Wordmark` component holds the lockup for all three call sites.
- **Two judgement calls worth recording:** The emblem's ink is sampled from the
  wordmark raster (`#834848`), *not* `--color-accent` (`#6B1F2A`) — the two sit
  side by side and a deeper maroon beside the lettering reads as two marks rather
  than one. And the master artwork puts the emblem at 2.45x the lettering's
  height, which overflows the 64px mobile bar, so the lockup holds it at 1.35x
  and derives the gap from the artwork's own ratio.
- **Files or services changed:** `public/brand/raaga-emblem.svg` (new),
  `src/components/ui/Wordmark.tsx` (new), `src/app/globals.css`,
  `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`,
  `src/components/admin/AdminHeader.tsx`.
- **Verification:** `verify` 14/14, `lint`, `build` clean. `test:a11y` against a
  production build: 33/33, CSS 14/16 KB, fonts 112/120 KB, total 337/400 KB. No
  budget was raised. Checked in Safari and at 375px. Production confirmed after
  deploy: `/brand/raaga-emblem.svg` serves 200 `image/svg+xml` at 31,266 bytes,
  and the lockup markup renders in both header and footer on theraaga.in.
- **Deployment / production status:** Merged as #3 and live on theraaga.in.
- **Follow-up / owner action:** Two items were deliberately left alone. (1)
  `src/app/icon.svg` is a 394 KB crude trace of this same motif; replacing it
  with the clean asset would cut ~92% from a file every visitor downloads, and it
  awaits the owner's decision. (2) The OG image was not touched, because the
  freeze rule governs it — see the note under that heading in `CLAUDE.md`.
- **Credential or access impact:** none

---

## 2026-10-03 — Full-site UAT review and fixes

- **Requested:** Bhasuri asked for a review of theraaga.in and admin.theraaga.in
  from every user's perspective, noting the site felt repetitive. She then asked
  for every code-fixable recommendation to be applied.
- **Decision / scope:** 33 findings across both portals. Everything fixable in
  code is done. Items needing facts or media from the owner are left open
  (below) rather than filled with invented content. Work happened in separate
  git worktrees with no `.env.local`, so nothing could reach production; a second
  session was editing the brand lockup in the main checkout at the same time.
- **Work completed:**
  - *Repetition.* The two centre pages shared 101 of 118 sentences; now 12.
    Centre page vs `/contact`: 78 → 6. One closing ask (`FinalCta`) everywhere,
    with the inline form only on `/contact`. The Guru–Shishya passage is told
    once, on `/about`. `/about` no longer repeats the centre cards. Intent pages
    lost their shared where-to-learn boilerplate. `/carnatic-vocal-classes-hyderabad`
    retired with a 308 to `/` — it shared the homepage's title and competed with it.
  - *Conversion path.* The form heading matches every button ("Book a trial
    class."). The hero has one primary and one WhatsApp action (owner approved
    replacing the client's "Explore RAAGA"). The desktop nav shows from 1024px,
    and Gallery and Journal stay out of the nav until they have content. The events
    "message us" line now actually opens WhatsApp.
  - *WhatsApp previews.* 12 of 14 pages emitted no `og:image`: any page with its
    own `openGraph` dropped the file-convention image. All restored with the
    existing frozen image; a regression check now asserts it on every route.
  - *Accessibility.* The homepage stats were announced twice. Footer and conversion
    links were under the 24px WCAG 2.2 target the footer claims; fixed, and the
    claim is now enforced on all public routes by `test:a11y`.
  - *Design consistency.* The maroon gradient is kept to the hero, the closing band
    and thank-you. `/getting-started` was rebuilt on the site's tokens. The duplicate
    ornament, an off-system card and an over-500-line form file were fixed.
  - *Admin portal.* A lowercase-username sign-in set a cookie that every page
    then rejected. The portal no longer renders inside the public header and
    footer (a `(site)` route group, plus `global-not-found` behind
    `experimental.globalNotFound`). Login rate limiting now survives serverless
    instances (Mongo-backed, IP stored only as an HMAC). Enquiries can be deleted
    for erasure requests. Phone-friendly lead cards added.
  - *DPDP retention.* The privacy notice promised 24-month deletion, but no TTL
    index existed and `retentionUntil` was a string, which TTL ignores. Leads now
    store a Date; on first admin load the index is created and old strings are
    converted.
- **Files or services changed:** 59 files across 32 commits on `uat/full-pass`. No
  service, DNS or Vercel setting touched.
- **Verification:** `npm run verify`, `lint` and `build` pass. `test:a11y` gives
  76 passed, 0 failed (was 33) with budgets met — 320 KB total, down from 326.
  Admin sign-in and rate limiting were proven with throwaway credentials on a local
  server; the Mongo code paths were checked against a recording stub. `test:e2e`
  was not run.
- **Mistake recorded:** `CLAUDE.md` said `env -u MONGODB_URI` isolates `test:e2e`
  from production. It does not — Next reloads `.env.local` and refills it. Fixed to
  `MONGODB_URI=`. The 2026-10-02 entry below says `test:a11y` ran "with
  `MONGODB_URI` deliberately unset"; under this finding it was not actually
  unset. That run only loaded pages and submitted nothing, so no data was affected.
- **Deployment / production status:** Merged as #4 (with #2) and verified live on
  theraaga.in: og:image on 21 of 21 routes, centre pages sharing 9 sentences (was
  101), admin portal free of public chrome. On first admin load after deploy, the retention step creates the
  `leads_retention_ttl` index and converts existing leads' `retentionUntil` to Dates.
- **Follow-up / owner action:**
  - Legal pages: grievance officer, safeguarding contact, registered entity, and
    billing and notice terms. The "Draft, pending review" banner stays until these
    are supplied.
  - Content: Guru profiles, consented photographs, the Phoenix Arena street address,
    current batches, real testimonials (via Google Business Profile).
  - Merge the parallel brand-lockup work; expect small overlaps in `Header.tsx`
    and `Footer.tsx`.
  - Pre-existing, filed separately: the admin Mongo client caches a failed
    connection for the life of an instance.
- **Credential or access impact:** none. New collection `admin_login_attempts`
  (hashed keys only, auto-expiring). No secret read, moved or rotated.

---

## 2026-10-02 — Unblock deployment; correct the admin client's scope comment

- **Requested:** Bhasuri's first merge did not reach production. Find out why and
  get deployment working.
- **Diagnosis:** Vercel reported *"Deployment was blocked — the commit author did
  not have contributing access to the project on Vercel. The Hobby Plan does not
  support collaboration for private repositories."* Both the preview (`2d80cb4`)
  and the production deploy (`a934fa1`) were refused; the last success was
  `854f0c0` on 14 September, authored by himacharan128. Production was serving a
  17-day-old build the whole time and visitors were unaffected, but nothing
  could ship. Cause: a private repo plus a collaborator plus the Hobby plan.
  The stored Vercel CLI token is also dead — `vercel whoami` returns
  "User not found", so there is no CLI access until it is replaced.
- **Decision / scope:** Owner chose to **make the repository public**, which
  Hobby does allow collaboration on. Before doing so, the full git history was
  audited: no `.env`, credential or lead file has ever been committed, no
  connection string, API key or private key appears anywhere in history, and the
  only phone number present is the `9848012345` fixture in
  `scripts/test-enquiry.ts`. The seed content that became public is already
  visible on the live site. Two alternatives were offered and declined —
  transferring both repo and Vercel project to Bhasuri's own accounts, and
  upgrading to Pro.
- **Work completed:** Repository made public by himacharan128 (Bhasuri has
  `admin: false` and cannot change visibility). Corrected the scope comment on
  `src/data/admin-mongo.ts`: it claimed the URI is "never sent to the browser or
  used by a public page", but `/api/telemetry` is public and unauthenticated and
  writes `analytics_daily` through that client, so every public page view can
  trigger a write with those credentials. The comment is what someone reads when
  scoping the Atlas user, so it now states the real surface and the privilege the
  account actually needs.
- **Files or services changed:** `src/data/admin-mongo.ts` (comment only, no
  runtime change); repository visibility.
- **Verification:** `npm run verify` green. Commit `4937b20`, authored as
  Bhasuri, deployed successfully — confirming the public switch fixed the block.
  Production returns 200 on `/`, `/contact`, `/learning`, `/gurus` and
  `/music-classes/jubilee-hills`; zero matches for `priceRange`, Meta Pixel,
  GTM or `gtag(`; `admin.theraaga.in/robots.txt` still `Disallow: /`.
- **Deployment / production status:** Live, `4937b20`.
- **Follow-up / owner action:**
  - **Scope every Vercel secret to the Production environment only.** Now that
    the repository is public, anyone may open a pull request from a fork, and
    Vercel builds previews for pull requests. Any variable also enabled for
    Preview is readable by code in a stranger's PR. Production-only scoping is
    free and also stops a preview from writing to the real lead list.
  - Replace the dead Vercel CLI token if CLI access is wanted.
  - Atlas hardening, still outstanding — see the entry below and
    `Credentials/README.md`.
- **Credential or access impact:** none read, printed or rotated. The Vercel
  environment-variable page was deliberately **not** read — it renders secret
  values.

---

## 2026-10-02 — Laptop handover: git, GitHub and working agreement

- **Requested:** Bhasuri took over the project on her own MacBook Air. Set up
  git and GitHub under her account, connect the integrations, establish a
  logged, reviewed workflow for changes, and route model usage by task weight.
- **Decision / scope:**
  - GitHub access by **collaborator invite** on `himacharan128/theraaga-web` —
    not a transfer, not a fork. Ownership and the existing Vercel git connection
    stay untouched.
  - Activity logging **split**: this committed file for decisions and features;
    `Credentials/RAAGA-OPERATIONS.md` keeps the secret registry and service map.
  - Browsers: **Safari is driven from the shell via AppleScript**, not by a
    screen-control tool — no such tool exists, and every `computer` action
    available is scoped to a browser tab. Authentication is by device code,
    which Bhasuri approves in Safari. Safari cookies are never copied; session
    cookies are credentials.
  - `theraaga-web/` gets **its own versioned `CLAUDE.md`**. The four
    legally load-bearing constraints previously existed only in the unversioned
    workspace root, so they would have died with this laptop. The root file is
    now trimmed to workspace concerns and points into the repo.
- **Work completed:**
  - Audited the whole workspace. `npm run verify`, `npm run lint` and
    `npm run build` all pass; 41 routes build clean; working tree was clean and
    level with `origin/main`.
  - Found push and pull **completely broken**: `origin` was
    `git@github-personal:...`, an SSH host alias, with no `~/.ssh/config` and no
    SSH keys on the machine. Repointed `origin` to HTTPS.
  - Installed GitHub CLI 2.102.0 (Homebrew). Git itself was already present
    (Apple Git 2.39.5) — the missing piece was authentication, not the binary.
  - Recorded the working agreement as project instructions and as persistent
    memory, so it applies in every future session without being restated.
  - Found **Playwright's browsers were never downloaded** on this machine, so
    `test:e2e`, `test:a11y` and `check-local-release.mjs` all failed to launch —
    three of the project's verification scripts were dead. Installed Chromium
    (Headless Shell 151.0.7922.34) and confirmed the harness runs.
  - Added `docs/` to the workspace `.gitignore`. Both `CLAUDE.md` and
    `AGENTS.md` require it stay local and it was not excluded; it holds the
    client's DNS-panel screenshot.
- **Files or services changed:** `theraaga-web` git remote (SSH alias → HTTPS);
  `CLAUDE.md` (working agreement); workspace `.gitignore` (`docs/`); this file
  (new); Playwright browser cache. **No application code touched.**
- **Verification:** Full suite green before and after — `npm run verify`,
  `npm run lint`, `npm run build` (41 routes). `npm run test:a11y` now runs for
  the first time on this machine: **33 passed, 0 failed**, against the
  production build with `MONGODB_URI` deliberately unset so nothing could reach
  the client's live Atlas cluster. Measured budget confirms the README's
  figures: 163 KB JS, 14 KB CSS, 112 KB fonts, 326 KB total, zero third-party
  requests. `test:e2e` was **not** run — it submits a real enquiry to whatever
  storage is configured, and `.env.local` points at the production cluster.
- **Deployment / production status:** Nothing deployed. No application change.
- **Access established:**
  - Bhasuri's GitHub login is **`Bhasuri1`** (id 94067910), not `bhasuripolaki`
    — that is her macOS username and her Google account. Three different names
    for one person; worth stating once.
  - `Bhasuri1` added as collaborator; `gh repo view` confirms
    `viewerPermission: WRITE`. `gh` authenticated by device code, token in the
    macOS keyring.
  - Commit identity set to `Bhasuri
    <94067910+Bhasuri1@users.noreply.github.com>`, both globally and
    repo-locally — the repo-local config still carried himacharan128's identity,
    and local overrides global.
  - Authenticated access verified read-only (`git ls-remote`, `git fetch`)
    rather than by pushing a throwaway commit.
  - Safari's *Allow JavaScript from Apple Events* enabled, so the DOM can be
    read and the form exercised in her real browser.
- **Follow-up / owner action:**
  - **Google default account.** Safari still defaults to himacharan; it needs to
    be `bhasuripolaki`. Requires signing out of all Google accounts and signing
    in as hers first — Google treats the first account in as the default. This
    matters because Search Console, the Google Cloud OAuth client and any
    Business Profile work attach to whichever account is default.
  - Open from the previous owner, unchanged by this session: narrow the Atlas
    application user to `insert`-only on `raaga.leads`; confirm Phoenix Arena's
    street address and both centres' hours.
- **Credential or access impact:** none. No secret was read, printed, moved or
  rotated. Integration config was inventoried by key name only.

---

## Template — copy this for the next entry

```md
## YYYY-MM-DD — Short request name

- **Requested:**
- **Decision / scope:**
- **Work completed:**
- **Files or services changed:**
- **Verification:**
- **Deployment / production status:**
- **Follow-up / owner action:**
- **Credential or access impact:** none | variable changed (name only) | rotation required
```

Earlier history, from before this log existed, is in
`Credentials/RAAGA-OPERATIONS.md` under "Activity log" — entries for
2026-09-15 and 2026-08-21.
