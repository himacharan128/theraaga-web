interface EditorialBrief {
  title: string
  question: string
  inputs: string[]
  prompts: string[]
  links: { label: string; href: string }[]
}

const briefs: EditorialBrief[] = [
  {
    title: 'What happens in a first Carnatic lesson?',
    question: 'I have never learnt music. What will a teacher ask me to do?',
    inputs: [
      'A RAAGA teacher\'s approved notes describing an actual first lesson, with no learner names or identifying details.',
      'If useful, a teacher-only demonstration recorded for publication, with permission to publish both the recording and its transcript.',
    ],
    prompts: [
      'What do you listen for when a new learner sings?',
      'How do you explain the first exercise and check that it is understood?',
      'What should a beginner ask or bring to the next lesson?',
    ],
    links: [
      { label: 'Current joining guide', href: '/getting-started' },
      { label: 'Published curriculum', href: '/learning' },
    ],
  },
  {
    title: 'Practising pitch and rhythm at home',
    question: 'How do I work on the correction my guru gave me between lessons?',
    inputs: [
      'A teacher\'s approved explanation of one practice task, including its intended learning level and what should be checked with the guru.',
      'An original teacher demonstration and transcript if sound is needed to explain the point. Record publication permission before using it.',
    ],
    prompts: [
      'How should a learner use the pitch reference you set?',
      'What would you ask a beginner to notice when practising tala?',
      'What should a learner do when they are unsure about a correction?',
    ],
    links: [
      { label: 'Current home-practice guide', href: '/guides/practising-carnatic-music-at-home' },
      { label: 'Beginner learning path', href: '/carnatic-music-classes/beginners' },
    ],
  },
  {
    title: 'Choosing group or individual lessons',
    question: 'Which teaching format fits my experience and the feedback I need?',
    inputs: [
      'Teacher-approved notes about how feedback works in each format at RAAGA, plus current availability confirmed by the school team.',
      'An anonymised example of how a teacher discusses learning needs, without identifying any student or promising a fixed outcome.',
    ],
    prompts: [
      'What questions help you suggest an appropriate format?',
      'How does each learner get a chance to sing and receive corrections?',
      'When would you discuss a change of group, pace or format?',
    ],
    links: [
      { label: 'Current class-choice guide', href: '/guides/choosing-singing-classes-hyderabad' },
      { label: 'Online and in-person comparison', href: '/guides/online-or-in-person-carnatic-classes' },
    ],
  },
]

const publicationChecks = [
  'Obtain the original notes or recording. Check the facts and any references against that material before drafting.',
  'Have the actual teacher or reviewer approve the final version. Publish a name, biography or review date only with their permission and a record of that approval.',
  'Confirm rights and publication consent for every recording, image and quotation. Do not collect or publish a child\'s identity. Prefer teacher-only media; any media depicting a minor needs recorded guardian consent and the site\'s consent checks.',
  'Keep prices out of the article and its structured data. Do not invent outcomes, testimonials or promises of search rankings.',
  'Publish one useful original on RAAGA and link it from the relevant learning pages. Do not clone it across promotional blogs or present school-owned posts as independent endorsements.',
]

export function EditorialPlan() {
  return (
    <section id="editorial-plan" aria-labelledby="editorial-plan-title" className="mt-6 rounded-2xl border border-stone-200 bg-white p-5 [font-family:var(--font-ui)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="editorial-plan-title" className="text-xl font-semibold tracking-tight [font-family:var(--font-ui)]">Teacher contribution plan</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
            Three briefs for original teaching material. These contributions are not published.
            The links below point to existing guides, not completed teacher articles.
          </p>
        </div>
        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
          Preparation only
        </span>
      </div>
      <p className="mt-3 text-xs leading-5 text-stone-500">
        This is a reference checklist, not a saved progress tracker. Opening a brief does not
        record approval or publish anything.
      </p>

      <div className="mt-5 space-y-3">
        {briefs.map((brief) => (
          <details key={brief.title} className="rounded-xl border border-stone-200">
            <summary className="cursor-pointer rounded-xl p-4 text-sm font-semibold text-stone-800 transition hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6b1f2a] sm:p-5">
              {brief.title}
            </summary>
            <div className="border-t border-stone-100 p-4 sm:p-5">
              <p className="text-sm leading-6 text-stone-700">
                <span className="font-semibold">Learner question: </span>{brief.question}
              </p>
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold [font-family:var(--font-ui)]">Material needed before drafting</h3>
                  <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-stone-600">
                    {brief.inputs.map((input) => <li key={input}>{input}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold [font-family:var(--font-ui)]">Questions for the teacher</h3>
                  <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-stone-600">
                    {brief.prompts.map((prompt) => <li key={prompt}>{prompt}</li>)}
                  </ul>
                </div>
              </div>
              <nav aria-label={`Existing reading for ${brief.title}`} className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-stone-100 pt-3">
                {brief.links.map((link) => (
                  <a key={link.href} href={new URL(link.href, 'https://theraaga.in').href} className="inline-flex min-h-11 items-center text-sm font-semibold text-[#6b1f2a] underline decoration-stone-300 underline-offset-4 hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6b1f2a]">
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </details>
        ))}
      </div>

      <aside aria-labelledby="publication-checks-title" className="mt-5 rounded-xl bg-stone-50 p-4 sm:p-5">
        <h3 id="publication-checks-title" className="text-base font-semibold [font-family:var(--font-ui)]">Before anything goes live</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-stone-600">
          {publicationChecks.map((check) => <li key={check}>{check}</li>)}
        </ol>
      </aside>
    </section>
  )
}
