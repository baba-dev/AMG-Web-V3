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

Set `NEXT_PUBLIC_AIWA_SHOWREEL_YOUTUBE_ID` in Cloudflare Pages build variables to an 11-character ID for the final Aiwa reel. Prefer an approved local MP4: place it under `public/media/` and set the build variable `NEXT_PUBLIC_AIWA_REEL_MP4_PATH=/media/aiwa-showreel.mp4`. The expanded surface then automatically uses native `<video muted playsInline autoPlay loop>` and the full-film dialog uses native playback controls. The locally hosted file must be smaller than Cloudflare Pages' 25 MiB single-asset ceiling. No paid service is required.

Without a native MP4, YouTube autoplay is muted and best-effort. Some browsers and automated tests display YouTube's bot-verification overlay instead of playback; the Aiwa poster stays available underneath. For a dependable production cinematic reel, publish the approved optimized MP4 locally. The preview tests cover layout/motion and do not certify external YouTube playback. No paid Cloudflare media products, server endpoints, Workers or dependencies are required.

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
