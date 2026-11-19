# Section 5 — Release and media operations

Deployment target: existing GitHub-connected Cloudflare Pages Free project.
No Worker, database, image transformer or paid media service is necessary.

## Featured content and navigation
- The homepage now includes a fifth major section immediately after About.
- The top navigation WORK link scrolls to `#work`.
- The CTA opens the real statically exported `/work` directory.
- Cards link to source-backed work already published on Aiwa's own website.
- Original editorial SVGs live at `public/media/work/*.svg`; none is a
  photograph of a client campaign. The site says so explicitly.

## Supplying approved client media
Replace each SVG with a reviewed optimized image while keeping its filename
or update the typed `artwork` field in `src/lib/work/projects.ts`.
For larger image content, use a new reviewed WebP or AVIF with correct alt.
For an optional silent video preview add a typed `video` value to that
specific project:
`{src:"/media/work/approved-clip.mp4",poster:"/media/work/project.svg"}`.
Only use Aiwa-owned or explicitly licensed footage. Prefer a short, muted,
loop-safe clip, defer loading until interaction, and keep any individual
Cloudflare Pages asset below the free-tier per-file size limit.
Never import third-party Romans photography or fonts.

## QA
The `Section 5 cinematic work showcase` workflow:
- builds Node 26 + Next 16 static export,
- captures six desktop scroll checkpoints at 1440×900 and 1280×800,
- verifies mobile alternating cards at 390×844 and 360×800,
- asserts reverse scroll, keyboard safety and zero overflow,
- opens /work and checks six source-backed project links,
- checks reduced-motion and no-JS static fallbacks.

The existing hero, Specialisms, About and duotone checks continue
unchanged. Merge after the green checks and an actual review of PNG
artifacts and Cloudflare preview. The implementation is an independent
interpretation based on publicly visible frames, not a copy of private
reference code or its animation curves.
