# Aiwa V3 — Editorial Typography, Color, Spacing & Mobile Audit

**Date:** 21 November 2026  
**Source:** publicly presented homepage at https://www.wearetheromans.com/ and the design archive at https://www.lapa.ninja/post/the-romans/  
**Implementation:** Aiwa original source, `src/components/aiwa-polish.css` and `scripts/homepage-design-audit.cjs`  
**Scope:** homepage only; no changes to reference assets, copy, private scripts, license-controlled fonts, scroll animation logic or content models.

## Fidelity rules and limits

The public reference is black/white, oversized condensed editorial typography and large-image-led sections. Lapa Ninja identifies its typeface as **Roc Grotesk**. We do not have a redistributable license for that face, so **we do not copy or bundle it**. Current Aiwa uses self-hosted Next Google-font output with three intentional roles: Anton, Barlow Condensed and Geist (plus Geist Mono for data). This is a visual interpretation, not a claim of pixel identity.

A browser-service wallet blocker prevented a fresh computed-style capture of the external reference in this pass. The values below for Aiwa are source-derived and now measurable via Chromium CI, not invented reference measurements. A final human review against licensed reference screenshots is still necessary.

## Findings and applied corrections

| Dimension | Source problem | Correction | Verification |
|---|---|---|---|
| Poster face | Repeated overrides alternated Arial Narrow, Barlow and Anton in headings | Anton is the stable 400-weight poster font across hero, Specialisms, Work and Contact | Computed family assertions at 8 widths |
| Emphasis | Browser-sheared italic on Anton is not a real italic style | Barlow Condensed's installed 900 italic for italic display phrases | Font-family and screenshot review |
| Readability | Paragraphs and supporting text mixed Arial/Geist | Geist body family in all major supporting-copy sections; line heights 1.46–1.5 | Computed body family and visual review |
| Light canvas | Different close ivory/grays between Specialisms, About, Office, Footer | Shared `#f5f5f3`, ink `#0a0a0a`, muted `#4f514a`, 20% ink rule | RGB background assertions |
| Dark canvas | Hero/Work/Contact use cinematic black for contrast | Retained, as requested; light theme remains functional | Existing theme and motion tests |
| Desktop edge alignment | Hero (~1.75vw), About (~3.3vw), Work (~3vw), Footer (~3.65vw) didn't align | `--aiwa-gutter: clamp(18px, 2.5vw, 48px)` | Computed gutter telemetry |
| Mobile edge alignment | Most sections used 14–17px; Specialisms intentionally narrower | Standard 17px site gutter, 12px Specialisms montage | 320–430px captures |
| Mobile typography | Multiple independent viewport-font rules made narrow devices fragile | Targeted <=390 and <=350px poster scaling, tablet downshift before 720px mobile layout | Headline mask clipping tests |
| Small taps | Some footer links were only font-line-height tall | Essential nav, contact links and hero film tile are >=44px tall | Touch-target bounding-box assertions |
| Long mobile content | Addresses/links could paint outside narrow columns | Safe wrapping and two-column `minmax(0,1fr)` narrow footer layout | No horizontal scroll / visual review |
| Accessibility | Focus could be harder to find on small links | Visible `:focus-visible` outlines and 44px hit regions | Browser checks and manual keyboard review |

## Responsive QA acceptance

Test widths and heights: **1440×900, 1280×800, 950×800, 768×850, 430×932, 390×844, 360×800, 320×700**.

The added browser audit:
- waits for font loading; records computed family, pixel size, weight, line height, letter spacing and colors
- asserts the light sections use the shared paper background
- asserts that display headings share a common poster font and body text uses Geist
- checks hero word mask bounds and document overflow (max tolerated 2px)
- checks essential mobile/touch targets are at least 44 CSS px tall
- samples section-by-section scroll positions and checks for layout overflow
- records hero/About/footer screenshots for all eight widths and writes inspectable measurements JSON

**Preserved regressions:** full-film FLIP in/out, reduced-motion and keyboard close, second-section projection, 7 Specialisms, selected campaigns, Contact/Office/Footer, static Next.js export and Cloudflare Pages.

## Unverified and intentionally excluded

- Exact proprietary font metric equivalence to Roc Grotesk, without a licensed font file
- Pixel-perfect colors or exact spacing of the reference's live CSS, since independent browser computed-style access was blocked
- Reusing The Romans' proprietary media, imagery or private transition code
- Visual similarity of Aiwa's own editorial artwork to The Romans' media choices

Do not merge until the new design audit and pre-existing suites pass; review the eight viewport screenshot sets for optical alignment before signing off.
