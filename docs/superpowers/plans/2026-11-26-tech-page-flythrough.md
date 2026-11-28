# Development Page Fly-through Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/specialisms/tech` as a pinned 3D fly-through of the 18 client screens with six service stations, a Thuluth calligraphy write-on layer, project popups and choreographed sections.

**Architecture:** The route keeps server-rendered content and metadata; interactive pieces are small client islands under `src/components/development/`. A DOM/CSS-3D wall is driven by GSAP ScrollTrigger plus Lenis (this route only). Calligraphy is traced offline into SVG path data and animated with a pen-stroke mask; an optional lazy OGL (WebGL) layer adds ink. Narrow screens, reduced motion and no-JS get a static gallery with identical content.

**Tech Stack:** Next.js 16 static export, React 19, TypeScript, GSAP + ScrollTrigger, Lenis, OGL, Playwright QA scripts (no unit-test runner exists; pure logic is checked with `node` assertions).

**Spec:** `docs/superpowers/specs/2026-11-26-tech-page-design.md`. Calligraphy contract: `public/media/calligraphy/README.md`.

## Global Constraints

- Static export only (`output: "export"`): no server runtime, actions or API routes. `npm ci`, Node per `.node-version` (26.13.1).
- New dependencies allowed for this work (owner decision): `gsap`, `lenis`, `ogl`; dev-only for tracing: `potrace`, `pngjs`. Pin exact versions at least two weeks old. Nothing else without a stated need.
- Keep all owner-approved copy and data from `src/lib/development.ts` and `src/lib/work/technology.ts`; no new client claims, metrics, vendor partnerships or certification titles. Private POS captures stay excluded.
- Preserve the metadata, canonical URL and `Service` JSON-LD in `src/app/specialisms/[slug]/page.tsx` for slug `tech`.
- Preserve deep-link ids `#dev-web #dev-software #dev-cloud #dev-email #dev-ai #dev-iot` (service scenes) and `#dev-connected` (IoT section); `/work/technology` links to `/specialisms/tech#dev-connected`.
- Light and dark themes, 320px to wide desktop, no horizontal overflow. Keyboard access, visible focus, `prefers-reduced-motion`, offscreen pause, essential content visible without animation.
- Flight mode only when viewport >= 900px wide, `prefers-reduced-motion: no-preference` and JS is running; otherwise static mode.
- Calligraphy is Thuluth only, decorative, `aria-hidden`, `currentColor`, background opacity about 0.06 to 0.14.
- Page-scoped CSS under `.spec-detail--tech`; do not touch shared header, mega-menu, footer or other specialisms.
- Read `node_modules/next/dist/docs/` for any Next API used (AGENTS.md: this Next differs from training data).
- Shared QA suite: new suite `scripts/tech-flight-qa.cjs` is registered in `scripts/ci-browser.cjs`; existing suites are updated, never weakened.

## Review Focus

1. Direct entry or in-page link to `/specialisms/tech#dev-iot`, `#dev-email`, `#dev-connected` lands on the right section even though the flight is pinned and Lenis is active.
2. Keyboard-only user: Tab through the wall never traps scroll; focusing an off-screen tile scrolls it into view; Esc closes the popup and returns focus to the tile that opened it.
3. Leaving the route and coming back (client navigation, browser back/forward): no duplicate ScrollTriggers, Lenis instance destroyed, scroll position sane.
4. Optional assets missing (no tile videos, no calligraphy SVG yet): page renders complete with stills and without calligraphy.
5. Resizing across 900px, rotating a phone, or toggling reduced motion live switches modes cleanly without a reload.
6. Slow or failed image loads: tiles reserve their aspect ratio (no layout shift) and show the project name.

---

### Task 1: Wall layout and station data

**Files:**
- Create: `src/lib/development-wall.ts`, `scripts/tech-flight-data-check.mjs`

**Interfaces:**
- Produces (pure, no runtime imports so Node can load it directly):
  - `export type ServiceId = "web"|"software"|"cloud"|"email"|"ai"|"iot"`
  - `export type WallTile = { slug:string; x:number; y:number; z:number; rotY:number; rotX:number; scale:number }` (units: px in a 3D space, `z` negative = further away)
  - `export function buildWall(slugs:readonly string[], columns:number): WallTile[]` deterministic, same input gives same output, one tile per slug, no two tiles share the same x/y cell
  - `export type Station = { id:ServiceId; at:number; featured:readonly string[] }` and `export const stations: readonly Station[]` (six, ascending `at` in 0..1, same order as `developmentServices`: web, software, cloud, email, ai, iot)
  - `export function stationAt(progress:number): ServiceId` clamps progress to 0..1
- Featured tiles come only from existing mapping: web `gwi`, software `bababuilds-erp`, ai `aiwa-creators`; cloud, email and iot have `featured: []` (no client relationship is implied).

- [ ] **Step 1: Write `scripts/tech-flight-data-check.mjs`** importing `../src/lib/development-wall.ts` and asserting: `buildWall` of 18 slugs at 6 columns returns 18 tiles with unique slugs and unique (x,y) cells; it is deterministic (deep-equal across two calls); `stations.length===6`, `at` strictly ascending within 0..1; `stationAt(-1)==="web"`, `stationAt(2)==="iot"`, `stationAt(stations[2].at)==="cloud"`; featured slugs for web/software/ai equal `["gwi"]`, `["bababuilds-erp"]`, `["aiwa-creators"]`; the cloud, email and iot stations have empty `featured`. Print `TECH_WALL_DATA_PASS` on success.
- [ ] **Step 2: Run** `node scripts/tech-flight-data-check.mjs`. Expected: FAIL (module not found).
- [ ] **Step 3: Implement** `src/lib/development-wall.ts`. Tiles on a gently curved grid (columns across x, rows across y), depth `z` staggered by row so the camera passes between them; small deterministic rotY/rotX from a seeded index formula (no `Math.random`).
- [ ] **Step 4: Run** the check again. Expected: `TECH_WALL_DATA_PASS`.
- [ ] **Step 5: Commit** `feat(tech): add wall layout and station data`.

### Task 2: Dependencies and flight runtime

**Files:**
- Modify: `package.json`, `package-lock.json`
- Create: `src/components/development/use-flight-mode.ts`, `src/components/development/flight-runtime.tsx`

**Interfaces:**
- Produces:
  - `export function useFlightMode(): "fly"|"static"` (SSR and first client render return `"static"`; upgrades after mount via `matchMedia("(min-width:900px)")` and `("(prefers-reduced-motion: no-preference)")`; reacts live to both queries)
  - `export function FlightRuntime(props:{ mode:"fly"|"static"; children:ReactNode }): JSX.Element` client component that, only in `"fly"`, registers ScrollTrigger, creates one Lenis instance wired to `gsap.ticker`, and on unmount calls `lenis.destroy()` and `ScrollTrigger.getAll().forEach(t=>t.kill())`; it sets `data-flight-mode` on its wrapper.
  - `export function useFlightContext(): { mode:"fly"|"static"; lenis:Lenis|null }`

- [ ] **Step 1: Add the failing QA harness** `scripts/tech-flight-qa.cjs` (Playwright, same structure as `scripts/specialisms-p2c-qa.cjs`: origin from `AIWA_TEST_URL` default `http://127.0.0.1:4173`, output `test-artifacts/tech-flight`, viewports `[1440,900],[1024,768],[390,844],[320,700]`, themes light and dark). First assertions: at 1440x900 with motion allowed the root `.spec-detail--tech [data-flight-mode]` is `"fly"`; at 390x844 and with `reducedMotion:"reduce"` it is `"static"`; no `pageerror`; `document.documentElement.scrollWidth - innerWidth <= 0`.
- [ ] **Step 2: Run** it against a built preview (`npm run build && node scripts/work-static-preview.cjs`, then `node scripts/tech-flight-qa.cjs`). Expected: FAIL (attribute missing).
- [ ] **Step 3: Install** `gsap`, `lenis`, `ogl` (exact pins) and dev `potrace`, `pngjs`; record the GSAP licence note in `docs/superpowers/specs/2026-11-26-tech-page-design.md` "Calls I made".
- [ ] **Step 4: Implement** the two files above. ScrollTrigger and Lenis load via dynamic `import()` inside the effect so no flight code ships in the static-mode path.
- [ ] **Step 5: Add a live-switch test**: resize 1440 to 600 and back; `data-flight-mode` flips `fly`, `static`, `fly`; then `page.emulateMedia({reducedMotion:"reduce"})` flips to `static`; afterwards `ScrollTrigger.getAll().length` (read from `window.__techFlightDebug`, set only when `location.search` has `?flightdebug`) is 0 in static mode.
- [ ] **Step 6: Build and run** the suite. Expected: PASS.
- [ ] **Step 7: Commit** `feat(tech): add flight runtime and mode detection`.

### Task 3: Page shell and hero

**Files:**
- Create: `src/components/development/development-experience.tsx` (server component composing sections), `src/components/development/development-experience.css`, `src/components/development/tech-hero.tsx`
- Modify: `src/app/specialisms/[slug]/page.tsx` (for `slug==="tech"` render `<DevelopmentExperience service={service}/>` inside the existing `spec-site` wrapper, keep header, JSON-LD, metadata, pager and contact outro for other slugs untouched)

**Interfaces:**
- Consumes: `FlightRuntime`, `useFlightMode` (Task 2).
- Produces: sections with `data-tech-section` values `hero`, `flight`, `services`, `iot`, `trust`, `finale` in that order; hero `h1` text is `Development`; the headline `GOOD IDEAS. GREAT ENGINEERING.` stays as visible text; a visible "Explore our services" link to `#dev-services`.
- The page owns its own palette via CSS custom properties on `.spec-detail--tech` for light and dark (owner licence); contrast must meet WCAG AA for text.

- [ ] **Step 1: Extend QA** with: sections present in order; `h1` is `Development`; hero headline text present; JSON-LD contains `serviceType` with 6 entries; canonical link is `https://next.aiwamediagroup.com/specialisms/tech`.
- [ ] **Step 2: Run**; expected FAIL.
- [ ] **Step 3: Implement** shell and hero (hero without calligraphy yet; reserve a `.tech-hero__ink` slot). Remove the tech-specific branches from `page.tsx` that the shell replaces.
- [ ] **Step 4: Run** QA in light and dark at all four viewports; add screenshots to `test-artifacts/tech-flight`. Expected PASS.
- [ ] **Step 5: Commit** `feat(tech): add development experience shell and hero`.

### Task 4: Flight wall and static gallery

**Files:**
- Create: `src/components/development/flight-wall.tsx`, `src/components/development/wall-tile.tsx`, `src/components/development/flight-wall.css`

**Interfaces:**
- Consumes: `buildWall`, `stations`, `stationAt` (Task 1); `TechImage` from `src/components/technology/tech-media.tsx`; `technologyProjects`; `useFlightContext`.
- Produces: `export function FlightWall(): JSX.Element` rendering `section#dev-flight[data-tech-section="flight"]` containing `.tech-wall` with 18 `a.tech-wall__tile[data-slug]` (desktop capture via `TechImage`, project name visible as caption, href `/work/technology/{slug}`), plus a station label region `[data-station]` updated as the flight progresses (`aria-live="polite"`, name of the current service). In static mode the same 18 tiles render as a CSS-grid gallery (no transforms) followed by no pinned behavior.
- Fly mode: ScrollTrigger pins the section for about 600vh; one timeline moves the camera (`translateZ`, small `rotateY` sway) along the wall; tiles in each station's `featured` list scale up and sharpen as that station passes; tile hover tilts toward the pointer (pointer-events only, rAF-throttled). Easing `power2.inOut`; animation only transform and opacity; `will-change` set only while pinned.

- [ ] **Step 1: Extend QA**: exactly 18 `.tech-wall__tile` with slugs equal to `technologyProjects` slugs; each image decodes (`img.complete && naturalWidth>0`); every tile has non-empty accessible name; static mode has no transform on `.tech-wall` and no pin spacer (`.pin-spacer` count 0); fly mode: scrolling to 30% of the pin changes the `[data-station]` text and `Tab` onto an off-screen tile brings it inside the viewport.
- [ ] **Step 2: Run**; expected FAIL.
- [ ] **Step 3: Implement** the wall (tile aspect ratio from `project.desktopHeight/1600`, reserved with `aspect-ratio` to avoid layout shift), station labels from `developmentServices`.
- [ ] **Step 4: Run** QA at 1440 and 390 in both themes; capture frames at 0%, 35%, 70% of the pin. Expected PASS; inspect screenshots.
- [ ] **Step 5: Commit** `feat(tech): add 3D flight wall with static fallback`.

### Task 5: Project popup

**Files:**
- Create: `src/components/development/project-modal.tsx`, `src/components/development/project-modal.css`
- Modify: `wall-tile.tsx` (opens modal on click or Enter instead of navigating; middle-click and the in-modal link still go to the route)

**Interfaces:**
- Produces: `export function ProjectModal(props:{ project:TechnologyProject|null; onClose:()=>void; returnFocusTo:HTMLElement|null }): JSX.Element|null` rendered as `[role="dialog"][aria-modal="true"][data-tech-modal]` with project name (`h2`), `headline`, `description`, desktop+mobile `TechPair`, and links "View project" to `/work/technology/{slug}` and "Visit site" only when `project.website` exists (`target=_blank rel="noopener noreferrer"`). Shared-element expand via the tile's rect (FLIP, transform only); in static mode a simple fade.
- Behavior: focus moves into the dialog, Tab is trapped inside, Esc and backdrop click close, focus returns to the opener, body scroll locked while open, Lenis stopped while open and restarted after.

- [ ] **Step 1: Extend QA**: click the `gwi` tile opens the dialog containing `Global Wealth Investments`; focus is inside; 10 Tabs never leave it; Esc closes and `document.activeElement` is the `gwi` tile; Visit site link exists for `gwi` and not for `bababuilds-erp`; with reduced motion no transform animation runs (computed `animationName` is `none`).
- [ ] **Step 2: Run**; expected FAIL.
- [ ] **Step 3: Implement** using the native `<dialog>` element if it satisfies focus trap and Esc, otherwise a small manual trap.
- [ ] **Step 4: Run** QA. Expected PASS.
- [ ] **Step 5: Commit** `feat(tech): add project popup with shared-element expand`.

### Task 6: Service scenes

**Files:**
- Create: `src/components/development/service-scenes.tsx`, `src/components/development/service-scenes.css`
- Modify: `development-experience.tsx`; delete `development-anchor-sync.tsx` after this task passes (no accordion remains)

**Interfaces:**
- Consumes: `developmentServices`, `getTechnologyProject`, `TechPair`, `DevelopmentDiagram` (kept from `development-art.tsx`).
- Produces: `section#dev-services[data-tech-section="services"]` containing six `section#dev-{id}.tech-scene` in order web, software, cloud, email, ai, iot (existing order from `development.ts`), each with index number, name `h3`, `lead`, `copy`, `deliverables` list, CTA link (`/contact#enquiries`; IoT links to `#dev-connected`), and either the related project's `TechPair` (when `service.project`) or its `DevelopmentDiagram`. Scenes reveal with ScrollTrigger (`opacity`+`translateY`, once); static mode shows them fully.

- [ ] **Step 1: Extend QA**: six scenes with those ids in order; navigating to `/specialisms/tech#dev-email` places that scene's heading within the viewport after load (top within 0..200px of viewport top) in both modes; copy of every `developmentServices[].name` is present; no `<details>` remains in this section.
- [ ] **Step 2: Run**; expected FAIL.
- [ ] **Step 3: Implement**; on hash entry call `lenis.scrollTo(el,{immediate:true})` in fly mode after `ScrollTrigger.refresh()`, native scroll otherwise.
- [ ] **Step 4: Run** QA. Expected PASS. Delete the anchor-sync file and its import.
- [ ] **Step 5: Commit** `feat(tech): service scenes with deep-link handling`.

### Task 7: Industrial IoT, trust and finale

**Files:**
- Create: `src/components/development/iot-section.tsx`, `src/components/development/signal-lines.tsx`, `src/components/development/trust-section.tsx`, `src/components/development/marquee.tsx`, `src/components/development/finale.tsx`, plus CSS per component
- Modify: `development-experience.tsx`

**Interfaces:**
- Produces:
  - `section#dev-connected.dev-iot[data-tech-section="iot"]`: four `.dev-iot-card` from `iotSolutions` with `DevelopmentDiagram`; `SignalLines` is an SVG whose paths draw on scroll (`stroke-dashoffset`) and which rests fully drawn; no numeric counters or invented figures.
  - `section[data-tech-section="trust"]`: managed-services rows (3), `technologyEcosystem` (4 `.dev-vendors article`), `technologyExpertise` marks (3), `Marquee` of the 18 project names (CSS animation, paused offscreen and under reduced motion), and `developmentFaqs` (6 `<details>` in `.dev-faq`).
  - `section[data-tech-section="finale"]`: "START A CONVERSATION" link to `/contact#enquiries`, magnetic hover (pointer only) and a calligraphy slot `.tech-finale__ink`.
  - The existing copy strings are reused verbatim, including the "centralised, AI-enabled video monitoring" IoT description and the "dedicated email hosting" service text.

- [ ] **Step 1: Extend QA**: counts 4, 4, 3, 6; copy assertions carried over from `scripts/specialisms-p2c-qa.cjs` lines 99 to 105; FAQ `details` toggle opens; marquee `animationPlayState` is `paused` when offscreen and `animationName` is `none` with reduced motion; finale link `href` ends `/contact#enquiries`.
- [ ] **Step 2: Run**; expected FAIL.
- [ ] **Step 3: Implement** the sections.
- [ ] **Step 4: Run** QA in both themes at 320 and 1440 (no overflow, no clipped headings). Expected PASS.
- [ ] **Step 5: Commit** `feat(tech): IoT, trust and finale sections`.

### Task 8: Calligraphy build pipeline (needs uploaded images)

**Blocked until** the owner uploads PNGs to `public/media/calligraphy/source/` (names per that folder's README). The rest of the plan does not depend on it.

**Files:**
- Create: `scripts/calligraphy-build.mjs`, `scripts/calligraphy-check.mjs`, `src/lib/calligraphy-data.ts` (generated, committed), `public/media/calligraphy/svg/{word}.svg` (generated)

**Interfaces:**
- Produces: `export type CalligraphyWord = { id:string; viewBox:"0 0 1200 400"; outline:string; pen:readonly { d:string; width:number }[]; dots:readonly string[] }` and `export const calligraphy: Readonly<Record<string, CalligraphyWord>>` in `src/lib/calligraphy-data.ts`. `outline` is the traced filled path; `pen` is ordered right to left (connected body strokes first), `width` is a mask stroke width about 1.3x the thickest local stroke; `dots` are separate paths animated last.

- [ ] **Step 1: Write `scripts/calligraphy-check.mjs`** asserting for every `svg/*.svg`: `viewBox="0 0 1200 400"`; no `<image>`, `<script>`, `<text>` or `font`; no literal colours (fill/stroke only `currentColor`, `none` or mask references); contains `<g id="pen">` with at least 1 path; file under 40 KB; and every generated word in `calligraphy-data.ts` has a matching SVG and a `SOURCES.md` row. Print `CALLIGRAPHY_CONTRACT_PASS`.
- [ ] **Step 2: Run**; expected FAIL (no SVG yet).
- [ ] **Step 3: Implement `calligraphy-build.mjs`**: for each source PNG: decode (`pngjs`), threshold, trace outline (`potrace`), fit to the 1200x400 viewBox with margin; derive pen paths by Zhang-Suen thinning of the bitmap, walking the skeleton from the rightmost endpoint, splitting at junctions, ordering strokes right to left, assigning stroke width from the distance transform; split dots (small isolated components) into `dots`. Emit the SVG files and `calligraphy-data.ts`. Log per-word stroke counts.
- [ ] **Step 4: Run** build then check. Expected `CALLIGRAPHY_CONTRACT_PASS`. Render each SVG to PNG and visually compare to its source; reject and report any word whose joins or spelling are wrong.
- [ ] **Step 5: Commit** `feat(tech): trace Thuluth calligraphy to animatable SVG`.

### Task 9: Calligraphy component and ink layer

**Files:**
- Create: `src/components/development/ink-calligraphy.tsx`, `src/components/development/ink-field.tsx`, `src/components/development/ink.css`
- Modify: `tech-hero.tsx`, `finale.tsx`, section headers

**Interfaces:**
- Consumes: `calligraphy` (Task 8), `useFlightContext`.
- Produces:
  - `export function InkCalligraphy(props:{ word:keyof typeof calligraphy; variant:"background"|"header"; className?:string }): JSX.Element` server-renderable SVG, `aria-hidden="true"`, fully visible by default (CSS custom property `--ink-opacity`: 0.1 background, 0.9 header). A client enhancer, when mode is `"fly"` or motion is allowed, hides then draws: `pen` paths as a thick round-capped masked reveal via `stroke-dasharray/dashoffset` (read `getTotalLength()`), 1.6 to 2.4 s per word, `power2.inOut`, strokes overlapping slightly, `dots` scale in last; triggered once on entering the viewport; with reduced motion or on error the finished word shows immediately.
  - `export function InkField(): JSX.Element|null` loaded with `next/dynamic` (`ssr:false`) only in fly mode on devices with `matchMedia("(pointer:fine)")`; an OGL fragment shader draws faint drifting ink bleed behind the hero at low opacity, pauses when offscreen (IntersectionObserver) and when `document.hidden`, and unmounts cleanly (dispose program, geometry, WebGL context); if WebGL context creation fails it renders null.
- Placement: hero background `tech`; section headers use `innovation`, `engineering`, `programming`; finale uses `oman`. Words not yet generated are skipped (no placeholder art).

- [ ] **Step 1: Extend QA**: each placed `InkCalligraphy` has `aria-hidden="true"` and no focusable children; with reduced motion all pen paths have `stroke-dashoffset` of 0 or no dash applied after load; with motion allowed, after scrolling the hero into view the computed `stroke-dashoffset` of the first pen path decreases over 500 ms then ends at 0; in static mode `canvas` count is 0; hero text contrast (heading vs. calligraphy underlay at max opacity) stays at least 4.5:1 in both themes (compute from computed colours and opacity).
- [ ] **Step 2: Run**; expected FAIL.
- [ ] **Step 3: Implement** both components.
- [ ] **Step 4: Run** QA, plus a WebGL-disabled context (`args:["--disable-gpu","--disable-webgl"]`) asserting the page still renders and no `pageerror`. Expected PASS.
- [ ] **Step 5: Commit** `feat(tech): animated Thuluth calligraphy and ink layer`.

### Task 10: Optional live tile videos (needs recordings)

**Blocked until** the owner uploads recordings to `public/media/technology/{slug}/` source (any format, named by slug).

**Files:**
- Create: `scripts/tile-video-build.sh`, `src/components/development/tile-video.tsx`
- Modify: `wall-tile.tsx`, `src/lib/development-wall.ts` (list of slugs that have video)

**Interfaces:**
- Produces: `export function TileVideo(props:{ slug:string; poster:string }): JSX.Element` rendering `<video muted loop playsinline preload="none">` with WebM and MP4 sources at `/media/technology/{slug}/loop.webm|mp4`; it sets `src` and calls `play()` only when intersecting the viewport and mode is `"fly"`, pauses on leave, never renders in static mode or with reduced motion. `tile-video-build.sh` converts each recording with `ffmpeg` to about 1000px wide, no audio, WebM (VP9) and MP4 (H.264), target under 400 KB each.

- [ ] **Step 1: Extend QA**: for slugs with video, `video` has `muted`, `loop`, `playsinline`, no network request for the video file until the tile is near the viewport, `paused` is true when offscreen, and in static mode no `<video>` exists. Slugs without video render the still image only.
- [ ] **Step 2: Run**; expected FAIL.
- [ ] **Step 3: Implement** and run the build script; record sizes in the PR description.
- [ ] **Step 4: Run** QA. Expected PASS.
- [ ] **Step 5: Commit** `feat(tech): live screen loops on wall tiles`.

### Task 11: Retire old page code and update shared QA

**Files:**
- Modify: `scripts/specialisms-p2c-qa.cjs` (tech branches at the lines around 89 to 110, 156 to 160, 221 to 270), `scripts/all-pages-theme-qa.cjs` (the `/specialisms/tech.html` surface list near line 38), `scripts/ci-browser.cjs` (add `["tech-flight-qa.cjs",false,[/^src\/components\/development\//,/^src\/lib\/development/,/^src\/lib\/calligraphy-data\.ts$/,/^public\/media\/calligraphy\//,/^src\/app\/specialisms\//]]`), `scripts/homepage-finale-smoke.cjs` and `scripts/hero-visual-smoke.cjs` if they reference removed selectors
- Delete: `development.css`, `development-division.tsx`, unused parts of `development-art.tsx` (keep `DevelopmentDiagram`), old hero art if unreferenced

- [ ] **Step 1: Grep** the repo for every removed selector (`dev-hero-art`, `dev-hero-svg`, `dev-service`, `.dev-services`, `dev-managed`, `dev-ecosystem`, `dev-faq`) and list each reference.
- [ ] **Step 2: Update** each existing assertion to the new contract (same intent: counts, copy, deep links, themes, no-JS content, reduced motion), not removal; the no-JS check keeps asserting the six services, IoT and FAQ copy are in the server HTML.
- [ ] **Step 3: Run** `node scripts/specialisms-p2c-qa.cjs`, `npm run test:themes`, `node scripts/technology-portfolio-qa.cjs`, `node scripts/hero-visual-smoke.cjs`, `node scripts/tech-flight-data-check.mjs`, `node scripts/calligraphy-check.mjs`. Expected all PASS.
- [ ] **Step 4: Commit** `test(tech): update browser suites for the new page`.

### Task 12: Verification and PR

- [ ] **Step 1:** `npm run lint` (clean), `npm run build` (static export succeeds, `out/specialisms/tech.html` exists).
- [ ] **Step 2:** `CI_EVENT=workflow_dispatch node scripts/ci-browser.cjs` against the preview. Expected: every suite passes.
- [ ] **Step 3:** Measure route weight: first-load JS for `/specialisms/tech` and the lazy chunks (ink layer, ScrollTrigger); record in the PR. Investigate any regression above what is justified.
- [ ] **Step 4:** Capture screenshots at 1440, 1024, 390, 320 in light and dark for hero, mid-flight, a station, popup, IoT and finale; review them for clipped text, overlap and contrast; attach or describe in the PR. If a browser is unavailable say so.
- [ ] **Step 5:** Update `docs/current-direction.md` (Development row and new assets contract) and mark the plan complete in the PR; push and mark the PR ready for review.
