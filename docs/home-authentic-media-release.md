# Homepage authentic-media and Futurecraft release

## Outcome

The homepage now combines real material published on Aiwa Media Group's former
website with the sharper editorial system already established in V3.

- The About image is now a four-frame Aiwa archive wall rather than a generic
  YouTube thumbnail.
- MYMO and Casabella project cards pair the V3 conceptual artwork with a small
  proof from the published Aiwa archive.
- The closing Muscat gallery now uses the approved Muscat Futurecraft landscape
  and production still in place of two generic vector scenes.
- All assets are hosted locally for Cloudflare Pages static export; the page no
  longer depends on the old site's anti-bot wall or on a YouTube thumbnail.

## Media provenance

The legacy site was protected by a Cloudflare human-verification challenge at
implementation time. Exact media paths were recovered from the public Internet
Archive snapshot dated 2024-06-13. The original WordPress paths are recorded in
`public/media/archive/README.md`.

Archive images are described as **published Aiwa archive material**. The UI does
not claim that every photograph depicts Aiwa's staff or office, and the Muscat
Futurecraft imagery remains clearly described as original conceptual artwork.

## Visual system

The archive wall uses four unequal frames, an Aiwa signal/coordinate device,
duotone grading and a controlled colour reveal. The real campaign material is
therefore recognisably Aiwa while still belonging to the new site's editorial
language. Project-card proofs use a physical contact-sheet treatment instead of
replacing the stronger V3 cover art.

## QA gates

- Next.js 16 static production build and TypeScript pass.
- Modified TypeScript files pass ESLint with no new errors.
- `npm run test:home-media` confirms every curated asset is substantial,
  referenced by source, and emitted into `out/index.html`.
- Reduced-motion CSS removes archive zoom transitions.
- Mobile uses a dedicated three-row archive composition; no horizontal overflow
  or hover-only information is introduced.
