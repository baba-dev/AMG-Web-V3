# Aiwa V3 hero: scroll-linked cinematic reveal (v2)

## Copy (approved for implementation)

- Line 1: `YOUR BRAND’S TOO QUIET.`
- Line 2: `DOMINATE [inline media] WITH AIWA.`

The first line is split into two masked word groups, with *TOO QUIET.* italic.
The second line uses *DOMINATE* italic and an inline rectangular film tile.

## Interaction

1. On initial load, each text phrase rises through an overflow-hidden mask with a staggered transition; the film thumbnail "pops" into its inline position.
2. The whole hero is sticky within a 260svh scroll stage (205svh mobile).
3. The film's visual is a viewport-size layer clipped to the inline tile's measured geometry. An rAF-driven scroll progress calculation interpolates the clip rectangle outward until the media fills the entire viewport.
4. Headline and location fade away as the film expands; small showreel controls emerge once the viewport is filled.
5. On further scroll, the full-frame film leaves the sticky stage and the existing Aiwa introduction follows as the third content section.
6. Clicking the thumbnail or "PLAY FULL FILM" opens a separate accessible native dialog.
7. Reduced-motion visitors do not receive animated text entrances or a continuous clip interpolation.

The reference agency's hero has sticky/clip-path styling and a separate click-to-play dialog. The exact internal transition curves are not available; this is an independently built approximation of the user-requested expansion, not a copy of reference source code.

## Video assets / hosting

No reference agency assets are bundled or hotlinked. The default video is a [public video by Aiwa Media Group](https://www.youtube.com/watch?v=d4wBqEmgFKA), and its thumbnail URL is used before YouTube playback begins.

Set `NEXT_PUBLIC_AIWA_SHOWREEL_YOUTUBE_ID` in Cloudflare Pages build variables to an 11-character ID for the final Aiwa reel. Once a locally hosted, approved optimized MP4 is provided, switch the full-bleed video to native `<video muted playsInline autoPlay loop>` for better quality, fewer third-party UI effects and predictable cover framing.

YouTube autoplay is muted and best-effort; user and browser settings may prevent playback. The poster remains visible in that case. No paid Cloudflare media products, server endpoints, Workers or dependencies are required.

## Verification targets

- Desktop 1440×900, 1280×800
- Tablet 820×1180
- Mobile 390×844, 360×800
- 0%, 25%, 50%, 75%, 100% of the sticky scroll interval
- Scroll up: expansion reverses without jumps
- Anchor thumbnail click/modal close/Escape
- Reduced motion, keyboard navigation, mobile menu
- Accessibility: action names, focus states, accessible modal
- Static Next.js export, Cloudflare Pages preview

No claim of pixel-perfect typography without screenshot comparison and approved production video.
