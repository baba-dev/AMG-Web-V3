# Aiwa V3 — Section 4 Motion & Editorial Polish

## Why this refinement was necessary

The original implementation fired a one-time IntersectionObserver when the section was barely visible. That meant visitors often reached the About block after the large headline had already completed its 1.12-second transition, giving the impression of a static page. The desktop screenshot also showed the supporting paragraph only at the very bottom of the viewport.

## Updated interaction

A single passive scroll listener schedules one `requestAnimationFrame` update to measure the section's actual position. Progress starts at 0 when its top enters the viewport bottom, and reaches 1 when the section is aligned to viewport top (a 0.93 viewport scroll distance).

Four word-masked lines translate from 113% below their containers and deskew from 3.25°, each delayed in *scroll space* rather than elapsed milliseconds. The eyebrow and index lead, followed by the headline, divider, location mark, body and CTA. A 1px top rule progressively draws across the section. Reverse scrolling retraces those changes precisely; moving away and returning does not rely on another observer trigger.

The About navigation and Specialisms' `THIS IS WHY` link use smooth scrolling for motion-enabled browsers, with native instant scrolling for reduced-motion visitors. They preserve hash navigation and keyboard interaction.

## Visual polish

- Tightened eyebrow-to-heading and heading-to-body rhythm so the explanation and CTA can share the first desktop viewport.
- Re-ordered the desktop grid: paragraph + CTA align with the headline's left gutter, while the Muscat location balances the right.
- Mobile retains a narrow one-column sequence with a readable lead, location, paragraph and CTA.
- Added soft off-white / grayscale hierarchy, a restrained pulsing indicator, rotating location plus, progressive fine rules, and a circular hover arrow with a travelling underline.
- Original Aiwa text and external About URL are unchanged. No third-party imagery, paid animation library or Cloudflare service was added.

## Accessibility and performance

- Source HTML displays readable copy by default. JavaScript enhances the reveal but is not required for content access.
- `prefers-reduced-motion: reduce` disables all scrubbed transforms and decorative motion, with all content visible.
- Scroll handler is passive, reads one section rect, and writes only opacity, transform and a CSS custom property, avoiding per-frame layout changes.
- Native headings and links remain accessible to keyboard and search engines.

## QA gates

Chromium smoke tests verify 1440×900 desktop and 390×844 mobile layout (no page overflow or clipped lines, sections 1–3 unchanged) and, separately, normal-motion snapshots at entrance, mid reveal, fully settled, and reverse-scroll reset.

Reference note: public inspection could not reliably expose all animation curves for The Romans, so these motion values are deliberately original editorial motion, not claimed as a pixel-identical extraction of its proprietary timeline.
