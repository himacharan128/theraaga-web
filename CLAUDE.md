# theraaga-web — agent instructions

**RAAGA — School of Indian Classical Music, Hyderabad.** Carnatic vocal, taught
since 2016 at Jubilee Hills and Phoenix Arena (Hitech City), live online, and in
gated-community clubhouses. Next.js 16 App Router · MongoDB · Tailwind 4.

This file is **versioned deliberately**. The constraints below are legal
exposure, not preferences, and they must survive the loss of any one laptop.
`README.md` carries the full reasoning; this is the short form that governs work.

---

## The four constraints that are not negotiable

Each is enforced mechanically, because each is either a standing client
instruction or a statutory exposure. Do not relax one to make a task easier — if
a change appears to require it, stop and surface it.

1. **No prices anywhere**, including `priceRange` and `offers` in JSON-LD.
   `npm run test:no-prices` fails the build. The `programs` model has no fee
   fields at all, on purpose: an unused price field is an invitation to render
   one. Fees are a WhatsApp conversation.
2. **No child identity collected.** The enquiry form takes the *adult's* name and
   number plus a coarse age band — never a child's name or date of birth. A minor
   enquiry additionally requires explicit guardian confirmation. Under the DPDP
   Act 2023 a child is anyone under 18 and children's-data failures reach
   ₹200 crore.
3. **Consent gating happens in the query, not the UI.** `consentGate()` in
   `src/data/content.ts` filters anything depicting a minor without recorded
   guardian consent, where no component can bypass it.
4. **No advertising or tracking pixels, permanently.** DPDP s.9(3) bans
   behavioural advertising directed at children even with parental consent, and
   the educational-institution carve-out covers enrolled students, not a public
   marketing page.

**Never fabricate content.** No placeholder testimonials, invented student
numbers, fake faculty, or AI-generated imagery. A fabricated testimonial is a
misleading advertisement under the CCPA Guidelines 2022. Where content is
missing, the site renders a *designed* empty state via `<Section renderIf
fallback>` — that is the architecture, not a gap. Never render a zero, an empty
carousel, a silhouette, or a placeholder frame. Stats are strings, never integers.

**Lineage claims come from the client, verbatim.** Never attach a specific
maestro to a specific Guru, name an award, institution or year the client did
not name, or put a number on "renowned cultural institutions".

---

## Working with Bhasuri

Bhasuri Polaki owns this work and is not a core software engineer. Do the
engineering to a professional standard without making her adjudicate
implementation minutiae: explain a recommendation by the outcome it produces —
a parent's enquiry, a WhatsApp preview card, a page's load time — name the
trade-off, and give one recommendation rather than a survey.

**Every change follows this loop. Keep a visible todo list throughout.**

1. Propose the best design, with the trade-off named.
2. **Confirm with her before building.**
3. Build it.
4. Test end to end (see Verification).
5. Run locally and put Safari on the `localhost` URL for her to review.
6. **Wait for her review.** Never ship unreviewed work.
7. Commit, push, merge, deploy.
8. Verify on production.
9. Suggest the next piece of work.
10. Log the entry in `ACTIVITY.md`.

Steps 2 and 6 are her decision points and must not be collapsed.

**Never add a `Co-Authored-By` trailer or any AI attribution** to a commit or PR.

**Browser.** Safari is hers. It is drivable from the shell via AppleScript
(`osascript -e 'tell application "Safari" …'`) for navigation, and `do
JavaScript` works for reading the DOM and clicking. Never copy or import her
Safari cookies — session cookies are credentials. Prefer `gh` and `vercel` CLIs
over clicking inside her live authenticated dashboards, where a misread button
can drop a database user.

---

## Verification

```bash
npm run verify     # typecheck · contrast · no-prices · enquiry · seo-intents
npm run lint
npm run build
npm run test:a11y  # accessibility + perf budget — needs a running server
npm run test:e2e   # real form submission — READ THE WARNING BELOW
```

**`test:e2e` writes a real enquiry to whatever storage is configured, and
`.env.local` points at the client's production Atlas cluster.** It cleans up
after itself, but a crash mid-run leaves a fake lead in the list the school
actually calls back. Run it against a dev server with `MONGODB_URI` set to an
**empty string** (`MONGODB_URI= npx next dev`) so `src/data/leads.ts` falls back to the
gitignored `.leads/leads.jsonl`. **Not** `env -u MONGODB_URI`: Next
reloads `.env.local` at startup and refills an unset variable, so that command
still writes to production. An empty value is kept, and `leads.ts` treats it as
unset. The fallback refuses in production mode by
design, so it needs `next dev`, not `next start`.

Budgets are the measured cost of the shipped design, not aspirations. Tighten
them if the numbers improve; **never raise one to make a check pass.**

Playwright's browsers must be installed for the harness to run:
`npx playwright install chromium`.

---

## Architecture rules

**`src/data/` is the seam.** Nothing in `app/` or `components/` may import
`mongodb`. Keeping every query behind the DAL is the Next.js docs' own security
recommendation and is what makes the eventual move to the Go/Echo API a
find-and-replace rather than a rewrite.

**Colour tokens are verified, not eyeballed.** `npm run test:contrast` asserts
every text/background pair. Gold on ivory fails WCAG at 2.22:1, so
`--gold-hairline` is decorative only and the test asserts that it *keeps*
failing. For gold that carries meaning use `--accent-muted` (#8C6A15, 4.53:1).

**Do not touch `htmlLimitedBots`.** WhatsApp is already in Next's default list,
and any custom value *replaces* the default — breaking link previews for Google,
Bing, Twitter, LinkedIn, Slack, Discord and Facebook on a site whose entire
go-to-market is link sharing.

**Freeze the OG image before distributing any link.** WhatsApp caches previews
per-URL for weeks with no purge tool, and the forwarded card is seen far more
often than the page itself. If it must change, version the distributed URL.

**No email address is published anywhere.** `site.email` is `null` by decision —
the domain has no MX, SPF or DKIM, and an address that bounces is worse than
none. WhatsApp and the phone number are the contact routes. Every consumer is
guarded and `test:a11y` asserts no dead `mailto:`/`tel:` link ships.

Keep files under 500 lines. Validate input at system boundaries. Read a file
before editing it. Never commit secrets or `.env` files.
