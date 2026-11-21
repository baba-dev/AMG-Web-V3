# P2-C — Aiwa V3 Specialisms / Editorial Service Experiences

## Release intent
Build seven *real* service routes from the existing homepage's labels, without importing The Romans' proprietary campaigns or claims. Internal pages are editorial service experiences, not generic keyword-filled SEO templates. Connect each service only to Aiwa case studies whose documented scope is materially related.

## Canonical taxonomy and routes
- /specialisms — all seven, bold editorial directory and quick service browsing.
- /specialisms/global — cross-market thinking and regionally rooted delivery (Aiwa is based in Muscat; don't claim extra offices).
- /specialisms/consumer — retail/restaurant identity, brand systems and campaigns.
- /specialisms/corporate — industrial/B2B websites, technical content and business event communications.
- /specialisms/sports — event and esports creative/event-orchestration capability, with **no represented completed sports-specific client case study**.
- /specialisms/social — social marketing, digital media, content, influencer collaborations, online campaigns.
- /specialisms/studio — photo, film, animation and editorial creative production.
- /specialisms/tech — websites, apps, commerce, inventory and POS integration.

**No fictional results:** supporting client stories must come from `src/lib/work/projects.ts` and `src/lib/work/case-studies.ts`. Studio and Sports must not claim verified creative-media results or sports clients from unrelated source projects. Where actual work is not documented, show a candid capability explanation and a link to all Work rather than fake proof.

## Layout
**Directory:** compact sticky Aiwa header → strong near-black full-bleed typographic intro → warm editorial grid of seven services (each with original art, number, name, positioning) → related process note → contact CTA → existing footer.

**Service page:** shared header; 100svh-ish kinetic headline/overline/subtitle; unique original conceptual service SVG as full-width editorial stage; compact source-aware overview; three service phases / offer tiles; selective evidence cards linking to genuine /work/[slug]; optional evidence gap explaining why no client link exists; next/previous service navigation and conversion footer. Use only static Next.js export and existing fonts, no backend or new packages.

## Evidence references (2026-11-21)
- https://aiwamediagroup.com/about-us/ — marketing, website/app development, production, event management, influencer services.
- https://aiwamediagroup.com/branding/ — logo, brand guidelines; MYMO, Casabella, RazMazaan.
- https://aiwamediagroup.com/case-study/ — Aqua Petro website/content/photography/event, Vitamin Phones POS/inventory, MYMO and Casabella.
- https://aiwamediagroup.com/video-production/ — videography, event coverage, web film, social formats.
- https://aiwamediagroup.com/event-planning/ — corporate, experiential, event services and **esports** events; does not establish a finished sports portfolio project.
- https://aiwamediagroup.com/contact-us/ — primary services and contact.
- https://www.wearetheromans.com/services/consumer — **editorial reference only**, no copy, fonts, branded art or animations reused.

## Brand and motion rules
- Space Grotesk body/UI, Anton display, Barlow Condensed italics, optional user-licensed Roc body through previous private font gate.
- Ink `#0A0A0A`; paper `#F5F5F3`; distinctive per-service accent colors; restrained contrast/spacing. Theme support on directory and all detail pages.
- Original source-controlled SVG illustration per service: visually distinct, intentionally **conceptual**, never mislabeled as client photography or campaign deliverables.
- CSS entry/reveal only, no scroll hijack or per-frame scroll JS; reduced-motion and no-JS remain complete.
- Semantic sections, direct client links, keyboard focus, meaningful image alt, responsive 320–1440 px, stable 44px tap controls.

## Integration
- Update the seven existing `#specialisms` homepage rows from inert `href="#"` anchors to local `/specialisms/[slug]` real links; preserve their exact seven visible labels, motion, rows and visual positions.
- The homepage work showcase and hero cinematics remain untouched. A new "EXPLORE ALL SPECIALISMS" footer CTA connects to the directory.
- Inner-page shared navbar "SPECIALISMS" should lead to /specialisms (not the homepage hash), without altering homepage top nav's existing `#specialisms` behavior. Footer retains working homepage section deep-links.
- Case study pages remain identical and reachable.

## Definition of done
- 8 /specialisms routes built/exported; 7 homepage links correct; no dead navigation.
- 7/7 client routes render originals; no invented Sports case study; each work link corresponds to documented scope.
- Desktop/tablet/mobile screenshots and checks: 320, 360, 390, 430, 768, 950, 1280, 1440.
- Light/dark, reduced-motion, URL direct load/back, no-JS, keyboard/touch/semantic landmarks.
- All existing homepage/Work/Cases regressions pass and Cloudflare Pages static export succeeds.
- PR opened as **draft** and unmerged until QA passes; after green sign-off mark ready for review. Do **not** merge new P2-C without user instruction.

## Eight commits
1. Reference/audit/specification
2. Source-grounded typed service model + project associations
3. Seven original conceptual media illustrations
4. Service directory and layout
5. Seven static individual service experiences
6. Homepage/navigation/footer wiring and theme/mobile polish
7. Browser coverage and evidence integrity checks
8. CI/release docs/final corrections
