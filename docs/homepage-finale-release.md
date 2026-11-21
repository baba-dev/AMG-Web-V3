# Aiwa homepage completion — release checklist

**Scope:** Sections 6 and 7 with footer; one eight-commit PR.
**Deployment:** current Github-connected Cloudflare Pages Free, Node 26
static Next.js output, directory /out; no paid services or additional server.

### Visual direction
Section 6: pinned editorial title **LET'S MAKE / SOME NOISE.**, clipped
scroll reveals, echo layer, working **START A PROJECT** CTA.
Section 7: **MADE IN MUSCAT.**, three original conceptual illustrations
(city, creative process, motion) and a manual accessible carousel.
Footer: one verified Muscat office, telephone, actual career/case-study
links, Instagram/LinkedIn and working site-specific Privacy Notes /
Site Terms routes. A legal review of the notes is recommended before
production; they intentionally avoid unsupported company-wide claims.

### Media
The media under /public/media/finale are original SVG illustrations,
not photographs of an actual Aiwa office, staff or projects. To use
approved media: replace the three images with correctly cropped
optimized WebP/AVIF images or adjust their typed src entries. Keep
their factual alt text and audit license/consent for photographs.
No automatic third-party image downloads, no paid Cloudflare Stream.

### Validation
- Chromium checkpoints Section 6: 0%, 25%, 50%, 75%, 100% and reverse.
- 1440x900, 1280x800, 390x844, 360x800, original sections preserved.
- Gallery scene select, prev/next, keyboard, live description, link targets.
- Working back-to-top, official address/phone, all footer links and no "#"
  placeholder for Latest.
- Reduced-motion and no JavaScript show reachable, legible content.
- Cloudflare Pages and existing Hero/Work motion suites green.
- No page horizontal overflow, no JS errors.
- Review actual PNG artifacts before merging this draft PR.

**Source:** https://aiwamediagroup.com/contact-us/ and the official
company YouTube/social information. This is an independent editorial
interpretation of the public Romans layout, not its exact private animation.
