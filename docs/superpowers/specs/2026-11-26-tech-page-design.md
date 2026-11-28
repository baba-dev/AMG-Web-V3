# Development page rebuild — "Fly-through" design

Route: `/specialisms/tech` (Development). Status: **approved and implemented in PR #60**, except plan Task 10 (live tile loops), which waits for owner screen recordings. Later owner decisions (hero declutter and PCB graphic, IoT strip, Arabic placements, vendor logos, removed disclaimer texts) are recorded in `docs/current-direction.md`. Date: 26 Nov 2026.

## Intent and why

The current page reuses the generic specialism template (hero, numbered list, accordion, cards, FAQ). The owner finds it bland and ugly. Aiwa is a top-tier Omani advertising and development agency, and a client who lands here should be wowed and think "these people can build anything".

The signature idea, chosen by the owner: **a wall of tiles showing real client screens that the visitor flies through**, with Arabic calligraphy as a subtle backdrop and in headers. The page should feel unique and choreographed, not assembled from a template or copied from another site.

## Goals

- A pinned, scroll-driven 3D fly-through of a wall of the 18 owner-supplied project screens, with the six Development services surfacing as stations along the flight.
- Motion that feels authored: moving illustration, parallax, magnetic/tilt hover, popups (project modal with shared-element expand), counters, drawn signal lines, marquee.
- Arabic calligraphy in **Thuluth** (owner decision, 26 Nov 2026; Diwani and Kufi dropped) as low-opacity background texture and header accents, animated as a pen write-on (right to left, dots last). Upload folder and animation contract: `public/media/calligraphy/README.md`.
- Keep all existing owner-approved content (six services, IoT solutions, ecosystem, certifications, FAQ, SEO, JSON-LD) and the links into `/work/technology/*` and `/contact#enquiries`.
- Fully usable without motion: reduced-motion, touch, 320px, keyboard and screen readers get a calm, complete layout.
- Both light and dark themes.

## Non-goals

- No redesign of the shared header, mega-menu, footer, route transitions or other specialism pages.
- No changes to `/work/technology` or its detail routes beyond what the popup links to.
- No new client claims, metrics, testimonials or partnership statements.
- No server runtime. No WebGL for the main experience.

## Anti-goals (would make this a failure even if it technically works)

- A page that looks impressive but hides content, traps scroll, janks on a mid-range phone, or is unusable by keyboard.
- Generic "SaaS template" tricks (pointless confetti, endless offscreen animation, competing layers).
- Calligraphy that is misspelled, mirrored, or loud enough to hurt legibility.
- Showing private POS captures, or implying a vendor partnership or named certification beyond the approved wording.

## Constraints

- Static Cloudflare Pages export (`output: "export"`), Node 26.x per repo, `npm ci`. Route `generateStaticParams` already covers `tech`.
- Dependencies are explicitly allowed by the owner for this work. Keep them few, pinned, and client-only (see Approaches).
- Existing contracts to respect: AGENTS.md rules, `docs/ci-policy.md`, shared header/footer, hero/menu stacking, `prefers-reduced-motion`, offscreen pause.
- Owner licence to ignore page-specific design tokens. This page may have its own palette and type treatment, but must still follow light/dark theming, contrast and accessibility.
- Existing QA scripts reference this page and must be updated, not weakened: `scripts/technology-portfolio-qa.cjs`, `scripts/specialisms-p2c-qa.cjs`, `scripts/all-pages-theme-qa.cjs`, `scripts/homepage-finale-smoke.cjs`, `scripts/hero-visual-smoke.cjs`, and `technology-design-contract.mjs`. Add new assertions for genuine new risks.
- Media: private POS images are excluded. Calligraphy must be original or openly licensed and recorded with its source.

## Approaches considered

| | What | Trade-off |
|---|---|---|
| A | WebGL (three.js / react-three-fiber) for the whole wall | Highest ceiling, but heavy bundle, mobile risk, DOM/SEO/a11y duplicated. Rejected as the main engine. |
| B | DOM + CSS 3D driven by GSAP ScrollTrigger and Lenis | Real `<img>`/`<video>`, crisp, accessible, indexable, ~50 KB. |
| **C (chosen)** | **B plus one small WebGL layer for calligraphy ink** | B's reliability plus a signature ink effect, loaded lazily and optional. |

Owner picked **C**. The WebGL layer is purely additive: if it fails, is unsupported, or reduced motion is on, the calligraphy renders as static SVG.

## Design

### Page structure

0. **Hero.** Large calligraphic word (تقنية) inking in behind the headline "GOOD IDEAS. GREAT ENGINEERING." Existing copy retained. A cue to scroll.
1. **Fly-through (pinned).** A 3D wall of the 18 project screens. The camera dives through it as the visitor scrolls. Six service "stations" surface in order (web, SaaS, AI, cloud, email, IoT), each pulling its related tiles forward. Tile hover tilts toward the cursor. Click or Enter opens the project popup.
2. **Service scenes.** Each station resolves to a full-width scene with the service copy, deliverables, link and a moving SVG diagram (existing `DevelopmentDiagram` art as the base).
3. **Industrial IoT.** Signal lines draw across the page, four solutions as live-looking diagrams with ticking counters limited to non-factual decoration (no invented numbers).
4. **Trust.** Managed services rows, vendor marquee, certification marks, FAQ.
5. **Finale.** The wall reassembles behind "START A CONVERSATION", with a calligraphic underlay.

### Components and boundaries

- Server-rendered content stays in the route; interactive islands are client components under `src/components/development/`:
  - `FlightWall` (scroll scene), `ProjectModal`, `InkCalligraphy` (SVG + lazy WebGL), `SignalLines`, `MagneticLink`, `Marquee`.
- Content data stays in `src/lib/development.ts` and `src/lib/work/technology.ts` (single source). Add a small typed config mapping services to wall tiles.
- Calligraphy assets in `public/media/calligraphy/*.svg`, with a source/rights record in `docs/`.
- Page CSS scoped under `.spec-detail--tech`. Old `development.css` rules are removed where replaced.

### Motion rules

- GSAP + ScrollTrigger drive the pinned scene; Lenis smooth scroll applies to this route only and is disabled under reduced motion and for keyboard/anchor navigation correctness.
- Offscreen scenes pause (IntersectionObserver). No endless animation offscreen.
- Resting states are complete without animation. Content is never only reachable via animation.

### Accessibility and fallbacks

- Reduced motion, touch-narrow viewports (<~900px) and no-JS: the wall becomes a simple horizontally snapping or stacked gallery of the same images; services follow as plain sections.
- Tiles are links/buttons with names; the modal traps focus, closes on Esc, returns focus; the pinned scene never traps keyboard scroll.
- Decorative calligraphy is `aria-hidden`; real headings stay real text.
- Contrast checked in both themes; calligraphy opacity tuned so it never reduces text legibility.

### Media

- Existing: 18 desktop/mobile WebP pairs (flagship Creators). Used as the wall tiles.
- Requested from owner (see below). Everything degrades to still screens and static SVG calligraphy if not supplied.

## What the owner provides

1. Thuluth calligraphy images from the supplied ChatGPT prompt, uploaded to `public/media/calligraphy/source/`: priority تقنية, ابتكار, عُمان. I trace them to SVG and build the write-on pen paths.
2. Optional: 6–10 s silent looping screen recordings (MP4/WebM) of the best 5–8 projects, to make tiles genuinely live.

## Verification plan

- `npm ci`, `npm run lint`, `npm run build` (static export), exported-preview checks.
- Updated page-specific QA plus theme QA in light and dark at 320, 390, 768, 1440 px; keyboard, reduced-motion, modal focus, no horizontal overflow.
- Performance sanity: initial JS cost of the route, lazy WebGL chunk, no layout shift from tile images (fixed aspect ratios).
- Browser screenshots in both themes, or an explicit statement if the browser is unavailable.

## Left to the builder

- Exact camera path, easing, tile arrangement and station order.
- Specific libraries and versions (GSAP/ScrollTrigger, Lenis, a minimal WebGL helper such as OGL rather than full three.js unless justified), subject to licence and bundle checks.
- Palette and typography for this page within light/dark and contrast rules.
- Calligraphy-to-SVG tracing method and word-to-section mapping.
- Mobile fallback layout details and tile counts per breakpoint.

## Calls I made (please check)

1. Ink effect uses a lightweight WebGL helper (OGL) rather than three.js, to keep the bundle small.
2. Lenis applies only on this route and is off under reduced motion.
3. Below ~900px width the 3D fly-through is replaced by a snapping gallery, not a scaled-down 3D scene.
4. Counters and "live" details are decorative and carry no invented figures.
5. Project popup shows the existing approved copy and a link to `/work/technology/{slug}`; no new claims.
6. Existing QA scripts are updated in place rather than dropped.
