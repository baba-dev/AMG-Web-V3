# Current direction — Aiwa V3

**Baseline: 24 November 2026**, main commit `e9ac47468305cd86710d7337a588a4fda091f6e2`. This records current product decisions and verified repository state, not a claim that every change has been deployed or visually approved. Refresh route and PR status from main when starting a new task.

## Creative direction

Aiwa should feel like a bold, finished, Muscat-rooted creative agency: confident editorial typography, vivid accents, tactile artwork, cinematic but intentional motion, real client evidence and equally polished light/dark presentations. Beyond the Noise is the identity. Benchmark The Romans for editorial pacing, grid, proportion and motion quality; exceed it through Aiwa's own stories, illustration, Arabic identity and accessible interactions. Avoid generic SaaS cards, oversized competing text, stock filler and unnecessary animation.

### Design decisions

| Area | Current contract |
| --- | --- |
| Type | Anton display; Barlow Condensed 900 true italic emphasis; Space Grotesk reading/UI; Geist Mono metadata. Optional licensed Roc only where deliberately scoped, with reliable fallback. |
| Theme | Shared semantic tokens, both modes across every route, theme-aware controls and artwork. Do not hardcode a light-only section. |
| Hero | Three-stage first-view reveal (headline, expanding inline film slot, navigation), approximately 3.2 seconds, separate scroll-driven film projection. Preserve its geometry and interaction escape; reduced motion settles immediately. |
| Navigation | Six mega-menu groups (Work, About, Creatives, Campaigns, Development, Start Here), two desktop columns: links and original line-art illustration. No left filler. Submenu hierarchy smaller than primary navigation, mobile accordion, real hit targets above film. |
| Work | Editorial project directory, List default, Grid optional and explicit preferences retained. Case-study templates and relevant work connections. |
| Specialisms | Creatives, Marketing, Development, IT Support, Branding, Events in this order. Creatives is the redesigned detail and motion lab; five other detail experiences need migration. Consumer retired. |
| About | Beyond the Noise narrative, real Aiwa content, editorial story/values/capabilities. |
| Contact | Muscat Signal hero (approved Find Us / Start Here direction), local illustrative cartography, coherent enquiry and office sections. |
| Footer | One shared ending; no redundant homepage CTA or shared office gallery. Unified legal-link typography for footer text/contact, four-column desktop rhythm, accessible responsive accordion, compact social icon strip and inline Arabic Optical Echo artwork. |
| Motion | Consistent Signal Cut / route transition language, deliberate easing, reduced motion and offscreen pause. Preserve interaction over spectacle. |
| Assets | Real Aiwa archive and original illustration. Responsive WebP and SVG preferred. Source records and rights required; no invented client work or results. |

Decision evidence: [typography #37](https://github.com/baba-dev/AMG-Web-V3/pull/37), [footer #40](https://github.com/baba-dev/AMG-Web-V3/pull/40), [six disciplines #42](https://github.com/baba-dev/AMG-Web-V3/pull/42), [Creatives #43](https://github.com/baba-dev/AMG-Web-V3/pull/43), [hero #44](https://github.com/baba-dev/AMG-Web-V3/pull/44), [Contact #45](https://github.com/baba-dev/AMG-Web-V3/pull/45), [mega menu #46](https://github.com/baba-dev/AMG-Web-V3/pull/46) and [#47](https://github.com/baba-dev/AMG-Web-V3/pull/47).

## What is on main

The verified App Router tree has `/`, `/about`, `/contact`, `/work`, `/work/[slug]`, `/specialisms`, `/specialisms/[slug]`, `/privacy`, `/terms`, and not-found handling. Check static params/content registries for actual slugs. Old service routes may remain for compatibility; their presence does not mean their redesign is complete.

The current mega-menu uses `src/lib/site-navigation.ts`; some destinations deliberately point to the legacy site, legacy service routes, contact anchors or mailto. Footer placeholders are in `src/lib/footer-navigation.ts`. Do not silently imply unfinished destinations are complete.

The client logo library is merged ([#48](https://github.com/baba-dev/AMG-Web-V3/pull/48)): main contains 58 WebP files (29 client marks at each of 300 and 600 px). This verifies file presence, not decoding, rights, final image quality or a shipped directory UI.

## Execution priorities

This is a directional backlog, not permission to invent scope or mark work done. Inspect open PRs before claiming or starting a slice.

| Priority | Outcome | Completion gate |
| --- | --- | --- |
| P0 | Client Directory | Original, visually distinctive directory using approved paired assets, searchable/browsable where useful, theme-safe white logo panels and verified client metadata; link from Work mega-menu only after the static route exists. |
| P1 | Case Studies hub | Curate verified legacy case-study data and real work, connect to existing project pages, replace legacy menu link when destination is ready. No fabricated metrics or client relationships. |
| P1 | Team & Culture / Join Us | Confirm prior PR status; team routes absent from baseline main. Use owner-approved staff names, roles and role icons rather than portraits; verify copy, careers CTA and navigation. |
| P1 | Remaining five Specialisms | Migrate to the six-discipline taxonomy with original service content/artwork, relevant work and controlled legacy compatibility. Update routes, nav and export assertions together. |
| P2 | Offices and supporting pages | Dedicated office experience, useful resources, brochure/downloads and remaining planned destinations once content is verified. |
| P2 | Media and launch readiness | Audit missing authentic media, responsive images, accessibility, metadata, internal links, performance, legal content and end-to-end theme/motion. |

Client Directory and team/case-study requirements must be grounded in confirmed content; unknown work categories, employment details, dates, endorsements and outcomes should be omitted or held for review, not inferred from a logo. No empty placeholder route solely to tick a roadmap box.

## Updating this file

Change this document when the owner approves a new durable direction or a merge changes the verified route/asset/workflow state. Include the PR link or source, distinguish approved plans from merged implementation, and leave historical release notes intact.
