# Work V3 / Eight-commit PR release checklist

## Shipped code
1. Work page brief, live source review, approval/quality gates.
2. Canonical cross-page navigation, inner-site header with keyboard-safe mobile drawer, homepage footer anchor fixes.
3. Work route with consistent Aiwa tokens, paper/ink editorial framework and shared typography.
4. The MYMO-featured original conceptual art hero, typographic entry motion, reduced-motion support.
5. Source-backed six-project asymmetric editorial gallery, typed visual descriptors and local media.
6. Four accessible responsive filters with query-string persistence and popstate restoration; visible results announcement.
7. Six statically generated project overview routes; published source links, process narrative and internal links from both Work and homepage; correct metadata and global footer.
8. Chromium 8-viewport QA, Cloudflare Pages static route checks, test artifacts and release notes.

## Source integrity
- Project set and metadata come from `src/lib/work/projects.ts`, with published Aiwa category/case-study links.
- Aiwa published sources: https://aiwamediagroup.com/case-study/ ; https://aiwamediagroup.com/branding/ ; https://aiwamediagroup.com/
- The Romans Work page served as a reference for editorial scale and project-led interaction, not a code/media/font source: https://www.wearetheromans.com/work
- Six local project pages are **editorial overviews**, not fully developed case studies. Do not invent campaign photography, numerical results, quotes, awards, or completed services absent from source.
- All on-page visuals are repository-owned, pre-existing **conceptual** SVG art. The visible disclosures make this distinction explicit.

## QA gates
- Cloudflare static `out/index.html`, `out/work.html`, and six slug exports present; if configured for trailing slash, equivalent `index.html` paths accepted.
- Headline readable with no horizontal clipping; mobile 320/360/390/430/768/950 and desktop 1280/1440 dimensions.
- Desktop nav / mobile menu, Escape dismissal, keyboard focus and 44px minimum touch areas.
- Category totals ALL 6, BRAND 3, DIGITAL 2, PRODUCTION 1 according to original typed project disciplines.
- Category URL query changes with a visible project count and can be restored by browser navigation.
- Every card routes internally; six overviews link to original source and neighboring projects.
- Reduced-motion and no-JS fallbacks; theme toggle and paper palette remain stable.
- Homepage's prior hero, showreel, montage and finale regression suites remain green.

## After review
- PR should remain unmerged until attached screenshots are inspected and all required Actions succeed.
- Independently verify authentic project imagery rights; replace conceptual art only with approved work assets.
- P2-B is dedicated long-form project storytelling with approved before/after media, methodology and demonstrable outcomes.
- No new backend, databases, paid motion packages, or deployment providers are required.
