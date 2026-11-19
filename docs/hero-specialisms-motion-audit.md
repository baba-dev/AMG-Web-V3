# Aiwa V3 — hero and Specialisms motion audit

Reference: https://www.wearetheromans.com/ (public homepage, inspected 19 Nov 2026).
Internal implementation is independent; no reference source code, image, font or video is bundled.

## What the real-browser capture established

The public site uses a custom Lenis scroller inside its own scroll container; `window.scrollTo` does not advance its animated content. A new Chromium audit therefore used real mouse-wheel events and captured 53 checkpoints across 1440×900 and 390×844 viewports. Transient CI reference screenshots are stored for only two days, not committed.

Desktop visual checkpoints from the running reference (native scroll container scroll position):
- **0px:** giant condensed two-line editorial hero, visible small embedded moving media.
- **389px:** media grows substantially over the text; underlying hero remains in place.
- **779px:** media nearly fills the visible width, headline visible behind it at the edges.
- **1169px:** media covers the visual frame and the hero begins to scroll out.
- **1559px:** a distinct near-white Specialisms surface scrolls upward from the bottom.
- **1949px:** Specialisms label appears near the top, followed by large black category headings with alternating photography tiles.

The reference's **actual measured visual video bounding boxes** (these bounds include cropped footage; not the clipped inline window) were approximately:

| reference scroll | video x | video y | video width | video height |
| --- | --- | --- | --- | --- |
| 0 | 382 | 342 | 339 | 301 |
| 389 | 142 | 2 | 964 | 855 |
| 779 | 16 | -166 | 1363 | 1209 |
| 1169 | 0 | -404 | 1440 | 1278 |

Do not treat those as identical to the clipped on-screen media rectangle; they are element geometry measured in the rendered DOM and are used to calibrate the perceptual expansion rate.

Specialisms reference geometry, desktop: central Global row ~770×208px, followed by Consumer ~1048px wide. The section uses white/light gray, oversized extremely condensed black typography and alternating full-height inline media tiles. Its captured mobile view is similarly editorial and dense; unlike our first implementation, it has no full-width black bordered accordion list or row numbers.

## Aiwa implementation

- Retain the explicit Aiwa headline `YOUR BRAND’S TOO QUIET. / DOMINATE [VIDEO] WITH AIWA.`.
- Open-source condensed display font for a tall, weighty silhouette; no copying the reference's proprietary RocGrotesk files.
- Media growth follows a calibrated power-out curve, with delayed title fade and a progressive trapezoidal mask that straightens as the film fills the real Section 2 viewport.
- Section 3 rebuilt as a near-white central montage with seven Aiwa category labels, alternating locally designed abstract thumbnail tiles, no row borders, and native `#` placeholder category links.
- Individual category folding is bound to actual scroll position rather than a one-time IntersectionObserver transition, and thus reverses gracefully when scrolling up. Hover causes a restrained tile scale/rotation and letter skew.
- The existing Section 4 remains unchanged.
- Reduced-motion visitors receive readable unanimated content; native MP4 can be swapped in by setting `NEXT_PUBLIC_AIWA_REEL_MP4_PATH`.
- No paid Cloudflare service and no copying of third-party reference assets.

### Image caveat

The initial public Aiwa WordPress image inventory returned no extractable high-resolution assets from the website in the automated browser. The thumbnail media is deliberately **Aiwa-themed abstract placeholder art**, not The Romans' protected photos or invented Aiwa client screenshots. Replace with approved Aiwa portfolio media for production fidelity.

## Review and validation

- Check Node 26 Next.js static `out/` build.
- Capture desktop hero at 0/25/50/75/100% scroll and verify media grows monotonically, headline remains behind the enlarging media and disappears at the completion.
- Verify reverse-scroll media shrinks back into the inline thumbnail.
- Check Section 3's seven alternating tiles, all category links temporarily `#`, media accessible after keyboard focus, responsive centering, category fold partial state/reversal.
- At 1440×900 and 390×844 ensure no overflow/clipping and ensure Sections 1–4 preserve exact adjacent boundaries.
- Performance: passive scroll listeners, requestAnimationFrame and transform/opacity-only updates; no added runtime dependencies or server backend.

No claim of exact reproduction of private easing formulas, licensed font metrics or footage is made. The audit provides observable frame-level evidence for an independent visual approximation.
