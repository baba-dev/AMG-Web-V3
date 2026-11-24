# Client logo library — V1 + V2 upload

**Status (24 November 2026):** the asset scaffold and upload are merged in [PR #48](https://github.com/baba-dev/AMG-Web-V3/pull/48). Main contains 58 WebP files. File presence is verified; decoding, rights and UI acceptance remain separate gates. No client directory route is present in the baseline main tree. The upload instructions below are retained for future replacement/recovery, not a request to repeat the upload.

## Original upload / future recovery procedure

Extract `aiwa-client-logos-v1-v2-web.zip` locally. Upload the **contents** of the two resolution directories (not the ZIP, not another nested web folder):

| Archive path | Repository path |
| --- | --- |
| `web/300/*.webp` | `public/media/client-logos/web/300/` |
| `web/600/*.webp` | `public/media/client-logos/web/600/` |
| `manifest.json` | `docs/client-logos/manifest.json` |

In GitHub, open the PR head branch, navigate to the appropriate directory, choose Add file → Upload files, select the 29 WebP files for that resolution and commit directly to the PR head branch. Repeat for the other resolution. Upload the original manifest alongside this guide; its `web/...` paths are relative to `public/media/client-logos/`. The manifest is documentation, not a runtime import. The empty `.gitkeep` files can remain. Do not commit originals, PNG masters, ZIP archives or QA sheets to public/.

## Delivery contract

- 29 matching filenames per directory, 58 images total.
- Square 300 × 300 and 600 × 600 lossless WebP, sRGB, lowercase kebab-case filenames.
- Preserve the supplied artwork, proportions, alpha channel and contrast panels; do not recompress or reframe.
- Use a white (#fff) logo presentation surface in both themes.
- Future UI should serve responsive images, reserve square dimensions, lazy-load offscreen cards, and supply accessible client names as appropriate. Do not publish broken placeholders before upload is complete.
- Verify publication permission and client identity before exposing the logos; FlyDestini and other source-limited artwork should be replaced with higher-quality official artwork when available.

Example future public URL: `/media/client-logos/web/300/fundoo-toys.webp`.

## Expected basenames (both resolutions)

- `aquapetro-chemicals.webp`
- `bababuilds.webp`
- `best-appliances.webp`
- `caesars-confectionery.webp`
- `coy.webp`
- `dk-furnishing.webp`
- `ezvesto.webp`
- `falcon-services-logistics.webp`
- `flydestini.webp`
- `fundoo-toys.webp`
- `genetco.webp`
- `global-wealth-investments.webp`
- `grace-global-engineering.webp`
- `gulfpac.webp`
- `health-zone-padel.webp`
- `la-bella-house.webp`
- `najibebay.webp`
- `namaste-marhaba.webp`
- `oman-reps.webp`
- `ooh-lala.webp`
- `razmazaan.webp`
- `rcs-oman.webp`
- `sohar-ods.webp`
- `spine-line.webp`
- `strategic-catering.webp`
- `the-gulf-post.webp`
- `tribeom.webp`
- `vitamin-phones.webp`
- `xspiceo.webp`

## Acceptance before integration

- [ ] Both folders contain exactly the 29 expected WebP images with matching filenames.
- [ ] Every image decodes and matches its directory dimensions.
- [ ] Uploaded manifest matches the two sets; original package bytes are retained.
- [ ] White-surface visual QA and mobile readability reviewed.
- [ ] Client identities and publication rights confirmed.
- [ ] Separate UI integration and browser QA completed before publication.
