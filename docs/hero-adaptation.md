# Aiwa V3 — Three-section cinematic landing

## Approved sequence

1. **Section 1 — Hero:** `YOUR BRAND’S TOO QUIET.` / `DOMINATE [VIDEO] WITH AIWA.`
2. **Section 2 — Film:** a real standalone, full viewport section directly **beneath** the hero in document flow. The moving poster begins at the heading's inline video tile and reaches the exact section-2 bounds as the visitor scrolls one viewport. Reverse scrolling retracts it into the tile. At full expansion the hero is above the viewport; the film does not cover the hero in-place.
3. **Section 3 — Specialisms:** the fold-out category list enters after the film section, using **Global / Consumer / Corporate / Sports / Social / Studio / TECH**, with `href="#"` for every temporary category link. Rows rotate from a folded `rotateX(-80deg)`, skew, translate and blur state when they intersect the viewport, and reverse when leaving.

## Design system

- Compact black-and-white editorial header and Aiwa-only wordmark (`AIWA`, no dot or subtitle).
- Header nav in Roman-like uppercase sequence: WORK / ABOUT / SPECIALISMS / JOIN US / CONTACT US / LATEST; OFFICES + globe/Muscat time at right. Only the Muscat office is represented; no invented branches.
- Custom text mask animations, inline tile pop, fullscreen rectangle interpolation, large folding category titles with skew hover.
- Existing Next.js, shadcn setup, static export and free Cloudflare Pages preserved.

## Performance and media

A single projection element is absolutely positioned in a 200svh container spanning the two real sections. A requestAnimationFrame scroll handler interpolates between tile and section-2 document-relative rectangles. This is not a sticky or fixed fullscreen overlay.

The existing Aiwa YouTube thumbnail is used as the placeholder. Add an approved compressed video to `public/media/aiwa-showreel.mp4` (under Cloudflare Pages' 25 MiB file limit), then set:

`NEXT_PUBLIC_AIWA_REEL_MP4_PATH=/media/aiwa-showreel.mp4`

When present, native `video` begins muted playback near completion of the scroll transition; without it, the film section shows the poster rather than a potentially blocked YouTube embed. Clicking the inline tile or 'PLAY FULL FILM' opens the separate video dialog, falling back to YouTube in the absence of a local MP4. Native video is strongly recommended.

## Visual verification

The GitHub Chromium smoke job verifies desktop 1440x900 and mobile 390x844 geometry:
- hero: exactly one viewport
- film begins at the hero's bottom, and fills the second viewport
- specialisms begins exactly after film
- projection originates inside title tile, expands to section-2 box, reverses precisely to title tile
- mobile navigation works
- category order/placeholder links correct
- no horizontal overflow

The reference website's exact proprietary font and real keyframe values are not publicly available via the available inspection tools. The fold effect is therefore a close independently implemented approximation rather than a verified pixel-perfect copy of its private animation timing.
