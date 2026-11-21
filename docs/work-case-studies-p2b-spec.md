# Aiwa V3 — P2-B Case Study Editorial System

## Scope
Stacked on **PR #15** (`feat/work-editorial-directory-v3`), not merged to `main`. Turn six static placeholder overviews into purpose-built editorial project stories. The directory, hero/showreel and homepage functionality must remain intact.

## Editorial references
- Aiwa primary: https://aiwamediagroup.com/case-study/ , https://aiwamediagroup.com/branding/ , https://aiwamediagroup.com/
- The Romans' project pages (layout inspiration, *not* media/text/animation copy): https://www.wearetheromans.com/work/filling-pieces and https://www.wearetheromans.com/work/the-open-gym

## Evidence and source integrity
The live old portfolio mixes some case-study records and may repeat metrics between clients. Specifically:
- `/case-study/` identifies MYMO as a mobile banking/communication service, **not a parcel or express delivery company**. Its documented scope includes digital marketing, brand management, advertising management, signage/print; `/branding/` confirms brand guidelines.
- `/case-study/` BEST by Genetco appears to contain duplicated Casabella content. Do not transplant that content, any Genetco-specific results or the copied 105k result. `/` identifies BEST as a home-appliance brand and references Aiwa's work.
- `/case-study/` supports Aqua Petro website/content/SEO, photography and event coverage. Its text also contains apparent Genetco-influencer paragraphs; exclude those from Aqua's story.
- `/case-study/` covers Vitamin Phones POS, inventory, checkout and e-commerce technology, but numerical outcome figures are not independently verified. Exclude exact metrics.
- `/branding/` directly supports Casabella logo, identity/theme, and business-card work; RazMazaan brand guidelines, logo/color/type system.
- Some original Aiwa project artwork intentionally conceptually references sectors and is **not authentic campaign photography**. Keep visible per-asset labels and source section. Do not imply these images were delivered to clients.

**Do not repeat old-site numerical outcomes, awards, attributable client quotes, external company claims or unverified dates in the new case studies.** Context and approach are tightly paraphrased from Aiwa's described work; a conclusion labeled "Focus" is not a measurable business outcome.

## Story format (all six)
1. Dark/duotone hero: navigation, project number, headline, discipline, original art, editorial index.
2. Quick context: concise sourced description and client/service notes. Use project-specific headline instead of repeated generic "The idea in focus".
3. **The brief**: the documented client requirement or scope in clear editorial language; avoid invented quotes or business problems.
4. **The response**: source-based Aiwa approach; any creative prose is framed as editorial interpretation, not a verbatim client brief.
5. **The work**: 2–4 documented deliverable cards, no unsupported service additions.
6. Art-directed visual plate(s) presenting existing conceptual art at distinct crops with an explicit concept-art label, not falsely called campaign photography.
7. **The takeaway**: grounded focus summary rather than claims of measured impact.
8. Page-to-page project navigation and contact CTA; source links.

## Technical acceptance
- Remain in Next.js 16 static-export/Cloudflare Pages architecture, no backend, dynamic routes via existing `generateStaticParams`, no new runtime packages.
- Data-driven, typed content stored separately from general directory records. Validate sources and 6/6 coverage.
- Hero uses existing fonts: Anton display, Barlow Condensed italic, Space Grotesk body, optional privately supplied Roc Regular.
- Readable at 320, 360, 390, 430, 768, 950, 1280, 1440 CSS px; no horizontal overflow, 44px tap targets, semantic landmarks and focus state, reduced-motion/no-JS safe.
- Source-attributed links have `noopener noreferrer`, no external image loads, no unapproved art.
- Each page provides sensible title/description/OG tags, canonicals and safely structured metadata, no invented dates.
- Interactive adjustments never hide substantive content from reduced-motion or no-JS visitors.
- Stacked PR should target `feat/work-editorial-directory-v3`; CI on push to P2-B branch verifies new routes and homepage/Work regressions. Do not merge either PR without explicit instruction.

## Eight logical commits
1. Source audit, storyboards and acceptance specification.
2. Typed source-backed six-story content model and consistency checks.
3. Reusable server-rendered case study sections; scoped metadata.
4. Cinematic page-specific hero/media compositions and font rhythm.
5. Brief/idea/deliverables editorial storytelling and original conceptual art plates.
6. Navigation, canonical links, accessible image captions and full theme/mobile styling.
7. Performance, accessibility, responsive and evidence QA test coverage.
8. GitHub Actions workflow, cross-page regression and release sign-off.
