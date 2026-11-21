# P2-B — Editorial Case Studies / Release Review

## Delivery
Stacked on [PR #15](https://github.com/baba-dev/AMG-Web-V3/pull/15). No production or base-branch files may be changed until the two PRs are reviewed and merged in order.

### Features
- Six static `/work/[slug]` pages rebuilt as source-attributed, original Aiwa editorial narratives.
- Existing chapter links, footer, mobile inner-page navigation and theme toggle preserved.
- Distinctive above-fold typographic hero, full bleed original conceptual editorial illustration, the brief, response, deliverable facts, art-study panels, takeaway, source notes, previous/next links and final CTA.
- Shared Space Grotesk + Anton + Barlow Condensed with optional licensed Roc body. Scoped CSS with 320px+ mobile, theme and reduced-motion behavior.
- A corrected MYMO mobile-banking-network conceptual illustration replaces an unrelated shipping-parcel depiction; prior artwork is not deleted.
- Content validation: five sufficiently documented stories; BEST remains a transparent, limited-data client profile with **noindex**, no fabricated campaign details.
- Measured page impact claims, client quotes, image licensing statements, campaign awards and outcome numbers are **not** invented or silently inherited from the old portfolio.
- Existing Work directory, homepage and six static routes retain their URLs.

### Source review
- https://aiwamediagroup.com/branding/ : MYMO, Casabella and RazMazaan branding facts.
- https://aiwamediagroup.com/case-study/ : MYMO, Casabella, AquaPetro and Vitamin Phones documented work.
- https://aiwamediagroup.com/ : BEST featured-brand context and Vitamin Phones POS mention.
- https://aquapetrochemicals.com/ : independent company context only, no Aiwa deliverables inferred.
- Some passages on the old case-study page are duplicated between clients or appear out of place, including BEST/Casabella and an AquaPetro paragraph referring to Genetco influencers. The editorial model deliberately excludes such material.

### Release gate
- Cloudflare Pages static build produces `/work` and six slug routes.
- Browser tests inspect 48 viewport/route combinations (8 sizes × 6 stories), with no horizontal overflow, readable headings, 44px controls, original conceptual image labels, internal project navigation, correct external sources and SEO.
- Light and dark themes and reduced-motion/no-JS are usable.
- Directory filtering and existing homepage cinematic/typography regression tests pass.
- The overall imagery is **editorial concept art**, not actual client deliverables; use authentic approved media as a later content upgrade.
- Before production, obtain project-owner approval of case-study facts, public performance metrics (if any) and actual campaign photographs/video.

### Commit breakdown
1. Source review and evidence limits
2. Typed six-story editorial content
3. Reusable server-rendered case-study sections and static page routing
4. MYMO representation fix and source/visual asset corrections
5. Cinematic visual system and editorial section compositions
6. Responsive + light-theme work, safe SEO metadata and CSS-only progress treatment
7. Cross-device case-study QA and evidence checks
8. CI integration and release documentation

**Important dependency:** Merge PR #15 first; then retarget this stacked PR to `main`, rerun Actions and review screenshots before merger.
