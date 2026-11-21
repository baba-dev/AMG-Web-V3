# P2-C — Specialisms inner pages / Release review

## The eight-commit delivery
1. Source/reference and design specification.
2. Typed seven-service taxonomy, safe case-study mappings and documented sources.
3. Seven original and conceptually labeled SVG illustrations.
4. New editorial `/specialisms` directory.
5. Seven static, individually differentiated service routes.
6. Homepage service-row links, shared inner-page navigation and mobile polish.
7. Playwright directory plus 7-service / 8-width regression and evidence checks.
8. GitHub CI workflow, QA artifacts and release notes.

## Design
The approved homepage labels Global, Consumer, Corporate, Sports, Social, Studio and Tech remain unchanged. The specialisms directory uses a near-black hero, warm-paper asymmetric gallery and service-specific editorial art. Each service includes a major typographic hero, conceptual visual, point of view, three-step creative approach, capabilities, relevant documented work (if any), source citations, next/previous service links and a contact CTA. Designed with the existing Space Grotesk/Anton/Barlow Condensed typography and optional private Roc webfont; no new backend or motion dependency.

## Source accuracy
Public Aiwa pages: https://aiwamediagroup.com/about-us/ ; https://aiwamediagroup.com/branding/ ; https://aiwamediagroup.com/case-study/ ; https://aiwamediagroup.com/video-production/ ; https://aiwamediagroup.com/event-planning/ .

Sports is a published **events/esports service capability**, not a claim of delivered sports client work. Global does not imply overseas offices or proof of international campaign delivery. Project cards connect only to related on-site, scope-documented case studies, with clear notes. All seven service illustrations are **original conceptual art**, not delivered client campaign assets.

## QA gates
- All eight `/specialisms` routes statically exported for Cloudflare Pages.
- 64 service + viewport combinations (directory plus seven services × eight widths, 320–1440 px); seven homepage links, no horizontal overflow, readable media, 44 px tap controls, accessible focus, precise project mappings, schema/SEO, reduced-motion, no-JS and light/dark theme.
- Existing homepage design, Work gallery, six case studies and homepage Section 5 motion regressions pass.
- Screenshot artifacts reviewed and visual issues fixed before ready-for-review.
- PR is **not automatically merged or deployed**. A future explicit merge request is needed.
