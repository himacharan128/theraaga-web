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
- **Deployment / production status:** Not deployed. Awaiting owner review and merge.
  On first admin load after deploy, the retention step creates the
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
