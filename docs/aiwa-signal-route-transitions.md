# Aiwa V3 / The Signal — route-transition release specification

## Design language

The Signal combines three distinct ideas into one coherent experience:
1. The Signal Cut: a three-band diagonal ember/ink wipe with monumental AIWA lettering.
2. The Project Portal: the clicked project thumbnail is cloned in its exact viewport box
   and expands into a screen-filling visual passage, with the Signal typography overlaid.
3. The Type Machine: the destination's real client/service title appears as kinetic
   condensed italic editorial type, supported by the existing licensed display stack.

The animation is Aiwa's own branded system; it does not copy the reference agency's
source, assets or proprietary motion implementation.

## Implementation contract

- Persistent client controller in `src/app/layout.tsx`, outside routed children.
- Capture-phase handling for eligible, unmodified, left-button, same-origin **route**
  links. Existing Next `Link` and ordinary `<a>` links use the same policy.
- Native behavior is preserved for external, new-tab, download, `tel:`, `mailto:`,
  current-path hash/query, and reduced-motion activations.
- Timeline: ~490 ms signal cover / ~510 ms portal expansion, then Next client-side
  route navigation. The exit layer stays mounted until the new pathname commits.
  After that, a ~650 ms vertical uncover exposes destination content.
- Repeated clicks are ignored while one route is transitioning. The fallback
  navigates normally if client routing does not resolve within 4.3 seconds.
- Artwork clone is enabled only if the clicked card's image has decoded/loaded
  and the card is visible. Hidden desktop list thumbnails and missing images
  gracefully fall back to Signal Cut; no broken-image fullscreen takeover.
- Browser back/forward navigation cannot be blocked; it receives a short entry
  choreography and no loading overlay. The Work `?view` and `?category`
  history entries retain the gallery's existing behavior.
- No additional animation runtime or network dependency; transform/opacity
  primarily drive the transition. Cloudflare's static export remains intact.
- The persistent homepage film scroll projection is not altered.

## Accessibility & performance

- `prefers-reduced-motion: reduce` suppresses all transition staging and
  entrance motion; links retain ordinary App Router behavior.
- Live region names the destination. Overlay artwork and ornamentation are
  hidden from assistive technology. Focus and scroll management remain with Next.
- No scroll hijacking: wheel and touch input are suppressed only over the
  temporary fixed overlay. Normal page scroll and in-page anchors stay native.
- 320px+ mobile width, portrait and landscape; long client names wrap rather
  than overflow. Overlay colors remain legible regardless of stored theme.
- Buttons/links still meet the existing focus and touch-target rules.
- No runtime layout measurements in a scroll loop; one source rectangle is
  captured at navigation and animated once.

## Verification

`.github/workflows/aiwa-route-transitions.yml` builds the actual Cloudflare
static output and runs Playwright Chromium checks for desktop/mobile list mode,
portal link, reveal cleanup, plain signal navigation, in-page hashes, browser
Back, no-JS navigation, modified click, and reduced-motion accessibility.

Manual QA still required in Safari/iOS, Firefox, slow-3G and with the real
homepage film expanded. In particular review scrollbar/viewport behavior on
mobile when the browser chrome collapses and screenshot the gallery-to-project
transition in both grid and list modes.

## Deployment ordering

This is a **stacked PR** on `feat/work-index-list-theme-editorial` (PR #19).
Merge PR #19 into main first, then retarget this branch to main. The transition
PR should contain only its own commits after that retarget, so gallery and
motion improvements do not conflict or ship partially.
