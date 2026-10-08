import type { LearningGuide } from '@/content/seed/learning-guides'

/**
 * Minutes to read a guide at an unhurried 200 words a minute, counted from the
 * guide's own text and never shown as less than one. Derived, so it stays true
 * when the guide is edited.
 */
export function readingMinutes(guide: LearningGuide) {
  const text = [
    guide.intro,
    ...guide.sections.flatMap((s) => [s.title, ...s.paragraphs, ...(s.bullets ?? [])]),
  ].join(' ')
  return Math.max(1, Math.round(text.trim().split(/\s+/).length / 200))
}

/** "4 sections · 3 min read", the line a guide is filed under. */
export function guideMeta(guide: LearningGuide) {
  const n = guide.sections.length
  return `${n} ${n === 1 ? 'section' : 'sections'} · ${readingMinutes(guide)} min read`
}
