# Section 5 — Selected Campaigns (Aiwa Media Group)

## Reference and intent

The visual reference is the homepage Work montage on https://www.wearetheromans.com/.
A prior public-browser capture at 1440×900 shows a small outlined WORK badge, a huge
condensed two-line stationary headline, overlapping campaign media moving in front
of and alongside the letters, and a rectangular white VIEW ALL WORK CTA. A 390×844
capture shows a vertical succession of media cards with captions and a compact CTA.
The reference's licensed fonts, media and private animation curves are **not**
copied. This section is independently implemented using Aiwa's own copy and art.

## Placement and content

- Section ID: `work`. It is **Section 5**, immediately after `#about`.
- Eyebrow: `WORK`.
- Two-line headline: `SELECTED` / `CAMPAIGNS`.
- CTA: `VIEW ALL WORK` links to the pre-rendered `/work/` directory.
- Six examples, verified as Aiwa work on https://aiwamediagroup.com/case-study/
  and https://aiwamediagroup.com/branding/:
  Mymo Express, Casabella Oman, BEST by Genetco, Aqua Petro Chemicals,
  RazMazaan, and Vitamin Phones.
- Descriptions are concise editorial summaries of publicly described services;
  no fabricated performance results, approvals, campaign photographs or awards.
- Cards link to relevant existing Aiwa case-study or branding pages until
  dedicated local `/work/[slug]` case studies are approved.

## Motion / visual targets

Desktop, >= 768px:
- A 310svh in-flow section with a 100svh sticky scene.
- Heading, outlined badge and CTA stay pinned while six cards traverse
  independently, alternating left/right and crossing the lettering.
- Cards use transform/opacity only and move in both scroll directions.
- Smooth entrance/exit: 0–15% establish typography, 15–85% layered montage,
  85–100% exits into the following section.
- Cards are keyboard focusable while in view, with readable contrast
  and a nonblocking link overlay.

Mobile, <= 767px:
- Natural vertical flow; no pinned desktop overlay on narrow screens.
- Offset large imagery and project captions; image entrance uses
  IntersectionObserver and reverses on re-entry.
- Card hit areas >= 44px, no horizontal overflow or trapped scrolling.

Reduced motion and no JS:
- No pinned stage, no animated transforms; show all campaign cards in a
  readable responsive grid/list with working links.
- All content is present in server output, so it remains crawlable.

## Media policy and performance

Original, repository-owned **conceptual editorial SVG compositions** are included
as an asset fallback, not asserted to be photographs of actual campaigns.
Replace with client-approved visual assets before claiming photographic fidelity.
Optional, manually approved and compressed MP4 clips can be configured
per project; they are not autoplayed offscreen or for reduced-motion users.
Static Next.js export on Cloudflare Pages Free (no backend, no Worker cost,
no paid Stream product). Prefer optimized local artwork, natural aspect ratio,
and lazy-loading below-fold media.

## QA

- Desktop: 1440×900 and 1280×800 screenshots at 0, 15, 35, 55, 75, 100%
  of the section's scroll progress.
- Mobile: 390×844 and 360×800, including stacked media and CTA.
- Forward/backward scroll, gallery links, /work index, theme switch,
  hover/focus, reduced-motion and no-JS accessibility.
- Existing Hero, Film, Specialisms and About geometry remain unchanged.
- No user-visible claims of pixel-identical proprietary motion.

## Eight logical commits

1. Reference specification and acceptance targets.
2. Typed, source-backed portfolio data and safe URL model.
3. Semantic Section 5 markup and original editorial artwork.
4. Desktop scroll-scrubbed pinned montage.
5. Mobile staggered editorial flow and reverse entrance.
6. Hover, focus, optional video and full /work directory.
7. Accessibility, performance, theme and no-JS fallbacks.
8. Playwright geometry/interaction regression, docs and CI release gate.
