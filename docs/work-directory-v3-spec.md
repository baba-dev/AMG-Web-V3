# Aiwa V3 / Work Directory — Editorial Launch Specification

## Scope and design intent
Route: `/work`. Deliver a cinematic but fast project-led editorial portfolio linking seamlessly from the already-approved homepage. Inspired by the restraint and large project treatments of The Romans' public Work index, but independently designed, written, and animated for Aiwa. No asset or proprietary font copying.

**Page order:** sticky site navigation → full-height dark opening → paper portfolio index and filters → first project featured → staggered gallery → short process strip → dark contact CTA → existing global Aiwa footer.

**Desktop hero:** 100svh opening with oversized "IDEAS / THAT MAKE / NOISE." lockup, a large framed MYMO conceptual editorial panel, small project index markers, downward scroll cue. Reduced-motion and no-JS states remain attractive.

**Gallery:** six already-documented Aiwa projects. First project featured. Remaining projects deliberately offset on a 12-column grid; no repetitive uniform thumbnails. Four accessible filters: ALL WORK, BRAND, DIGITAL, PRODUCTION. All projects remain in HTML before hydration; category state can be shared via `?category=brand`, `?category=digital`, `?category=production` and restored with popstate.

**Project destinations:** internal `/work/[slug]/` teaser/overview static-export routes for all six. These never claim to be complete case studies; each carries verified short description, carefully labeled conceptual editorial artwork, approved source link, previous/next project links, and request-for-brief CTA. A dedicated deep case-study pass follows separately.

**Media policy:** Only original conceptual SVGs from `/public/media/work` are used at this stage. Cards and teaser pages must disclose that these do not represent genuine photographs of completed client work. An asset manifest and source links are maintained. No invented metrics, awards, or client quotations.

**Navigation:** Work route must include a full accessible header with a responsive menu and existing theme switcher. Existing homepage hero video, scroll timeline, headings and other sections remain untouched. Footer page-anchor paths must link back to homepage anchors when on inner pages. Aiwa home logo routes to `/`.

**Fonts:** Anton for poster headlines, Barlow Condensed for supported italic accents, Space Grotesk variable for navigation and body; use privately installed Roc Regular when available. Uses existing neutral black `#0a0a0a`, warm paper `#f5f5f3`, ink `#0a0a0a` and shared gutter `clamp(18px,2.5vw,48px)`/17px mobile. Paper sections maintain consistent readable contrast regardless of light/dark theme. The header and dark CTA use high-contrast text. Avoid additional font or motion packages.

**Motion:** text mask entry with modest stagger; CSS transition of project cards and image crop; reduced-motion disables all. No scroll hijack or perpetual rAF. Avoid unnecessary CLS and large video. Mobile naturally scrolls, with no sticky gallery/horizontal forcing.

**QA acceptance:** static export of `/work` + all project detail routes. Playwright Chromium at 1440×900, 1280×800, 950×800, 768×850, 430×932, 390×844, 360×800, 320×700. No horizontal overflow. Correct font, working mobile nav, project filter counts, slug links, footer homepage anchors, 44px essential touch controls, keyboard traversal, reduced-motion, no-JS content, theme toggles, and both directions of browsing. Existing homepage tests stay green.

## Source-backed claims & reference boundaries
- The Romans Work directory: https://www.wearetheromans.com/work — source of general editorial-gallery inspiration only, not a direct clone.
- Aiwa existing work: https://aiwamediagroup.com/case-study/ ; https://aiwamediagroup.com/branding/ ; https://aiwamediagroup.com/
- Aiwa project copy and art: `src/lib/work/projects.ts`; existing art is conceptual, not documentary.
- No unverified performance metrics are displayed; neither backend nor CMS is introduced.

## Eight logical commits
1. Design/content/reference specification and QA acceptance criteria.
2. Shared page navigation/header and safe homepage return links.
3. Editorial theme tokens, typography and Work page framework.
4. Hero headline treatment and featured cinematic panel.
5. Asymmetric typed project gallery and creative assets.
6. Filters, motion, accessible mobile adaptation and history.
7. Local teaser project routes, SEO, footer conversion and homepage cohesion.
8. Automated Chromium responsive/interaction assertions, CI and release documentation.

**Production:** PR remains unmerged until browser screenshots, static build and regression gate are reviewed. No unrelated changes.
