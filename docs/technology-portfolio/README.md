# Technology portfolio media intake

This is an upload scaffold only. No new public page or navigation destination is enabled until a visual direction, attribution, and publication rights are approved.

## Upload

1. Check out `feat/technology-portfolio-media-scaffold`.
2. Extract aiwa-tech-optimized-upload-v2.zip at repository root (merge directories), or, if the first 68 files are already uploaded, extract aiwa-creators-pr55-upload.zip instead. The complete collection is 72 WebP files across 18 projects and docs/technology-portfolio/media-inventory.json; the add-on contains four new Creators images and the complete replacement inventory.
3. Run `node scripts/technology-media-check.mjs --require-media`.
4. Review the contact sheet and attribution before staging. Do not upload original PNGs, private POS media, credentials, customer/transaction data, or unpublished product assets. Record approval separately before publishing.
5. Commit the reviewed files to this branch; keep this PR draft until reviewed.

Paths: `public/media/technology/<slug>/{desktop-1600,desktop-800,mobile-560,mobile-320}.webp`. The inventory records dimensions, bytes, SHA-256 and original file names. Device viewport is not verified. Do not stretch or crop content to force a ratio.

Candidate slugs (owner-supplied captures): aiwa-creators, aqua-petro-chemicals, bababuilds, bababuilds-erp, best-appliances, ezvesto, falcon-logistics, flydestini, fxrco, gwi, healthzone-oman, menu-minute, rcs-oman, sohar-ods, strategic-catering, the-gulf-post, tribe-oman, xspiceo.

Vitamin Phones is held outside this public directory pending sanitization. Fundoo Toys is not supplied. All other assets remain pending publication/attribution approval; the supplied SaaS captures show public marketing pages rather than internal workflows. Do not infer technology stacks or outcomes from images.

## Proposed next slice

Use /work/technology as the proposed static route. Preserve the existing shared header/footer, work directory, and Development mega-menu. Add navigation only when the static export contains the finished page. Use existing theme/typography roles, responsive WebP srcsets (Next static export has no runtime optimizer), semantic gallery, accessible media viewer, reduced motion, and source-backed project facts. Support future approved app, commerce, POS, dashboard, video, redesign and sanitized infrastructure evidence without publishing empty categories. See AGENTS.md and current direction.

Creators by Aiwa (https://creator.aiwamediagroup.com/) is an owner-identified flagship project; the supplied desktop/mobile images depict its public marketing experience. Additional approved studio and workflow captures are desirable.

The scaffold does not implement the route. CI and rendered review are required for the implementation PR.
