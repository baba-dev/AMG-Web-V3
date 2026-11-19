# Aiwa V3 hero — first visual implementation

## Reference and scope

The hero recreates the **visual composition**, not The Romans' protected creative assets:
a black full-viewport section, slim navigation header, two-line oversized uppercase
headline with strategic italics, a *rectangular* inline film tile in line two,
a bottom-left office line, a bottom-right scroll square and animated word entrances.

The current copy is original to Aiwa:
- "BYE BYE ORDINARY..."
- "HELLO [film tile] AIWA MEDIA"

The following section is deliberately a minimal placeholder; the requested
implementation scope for this PR is the homepage hero and shell.

## Media

The inline media tile presently uses a YouTube preview thumbnail from an Aiwa
Media Group creative-work compilation. Clicking it opens the same public video
in an accessible native dialog. No The Romans photography/video is included.

To select the finished Aiwa showreel, add the eleven-character YouTube ID as a
Cloudflare Pages **build-time** variable:

`NEXT_PUBLIC_AIWA_SHOWREEL_YOUTUBE_ID=<youtube-video-id>`

Then redeploy Pages to update both the thumbnail and modal playback. The
fallback Aiwa video ID is `d4wBqEmgFKA`.

Before final approval replace the default poster with your approved edit and
compare the desktop and mobile screenshots against the reference at matching
viewports. The original font license and exact animation measurements have not
been independently established, so this is a visual-first implementation, not
a verified pixel-perfect match.

## Hosting

No server routes, Workers bindings, paid media processing or external NPM
packages are added. Remains compatible with Next.js static export to
Cloudflare Pages (out/). Native navigation links point to existing Aiwa pages
until the corresponding V3 routes are built.

## Accessibility & QA

- Native dialog supports Escape, close button, outside click and focus return.
- Mobile menu is keyboard-aware via `inert` when closed.
- Respects `prefers-reduced-motion`.
- Includes text alternatives for the embedded video action.
- Verify on 1440x900, 1024x768, 390x844 and reduced-motion mode after preview deploy.
