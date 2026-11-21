# Aiwa Contact V3 — motion choreography

## Intent
Preserve the Romans-inspired typographic and monochrome rhythm while making Aiwa's contact experience feel deliberately directed rather than continuously scrolling. Keep Muscat as the sole verified location, original conceptual artwork, and working email, phone, map and careers links.

## Motion score
1. **Opening 0–1.4 s:** Five linked type rows rise in 130-ms beats. Each original monochrome picture wipes in separately after its word.
2. **Ambient wall from 1.4 s:** The four-set seamless contact wall travels slowly, 51 s per set on desktop / 61 s on mobile. Pointer hover or keyboard focus pauses it, and IntersectionObserver pauses the loop when offscreen or the browser tab is hidden.
3. **Enquiry chapter:** The rule and metadata enter first; the oversized headline follows, then the supporting story and primary CTA. The enquiry selector introduces its tabs and panel, with a separate four-beat transition on tab changes.
4. **Muscat chapter:** Eyebrow, headline, clipped media curtain, then contact details. Original Muscat art responds to scroll with bounded, reversible depth drift (42 px desktop / 18 px mobile across the complete traverse).
5. **Finale:** Closing statement and CTA enter in sequence; the shared footer remains ordinary content without scroll hijacking.

## Motion and accessibility guardrails
- CSS owns easing and transitions; one client-only director uses IntersectionObserver and passive scroll requestAnimationFrame.
- All content remains visible in non-JavaScript or reduced-motion modes. No forced smooth scrolling or pinning.
- Content remains accessible if users arrive via anchors or history navigation. One-time section entrances avoid repeated flashes when scrolling backwards.
- Static Cloudflare export and existing inner-page routes remain unchanged.
- The browser test checks responsive layouts at 320–1440px, reduced motion, no-JS fallback, timing names, offscreen pause, image depth updates, keyboard tabs, working contact links and browser errors.

## Visual honesty
No media from The Romans is copied. Images are Aiwa's own labeled conceptual assets, not photographs of its studio, personnel or additional locations.
