# Aiwa V3 — Licensed Roc Grotesk and Space Grotesk integration

## Source verification (user supplied, 21 November 2026)

Inspected `RocGrotesk-Regular.woff2` as WOFF2 TrueType; name metadata reports `Roc Grotesk W05 Regular`, Kostic Type Foundry, OS/2 weight **400**, width **5 (normal)**, 405 Unicode mappings, no `DEMO` in the font-family/style metadata, and no restricted embedding flag (`fsType=0`). SHA-256 is `8841cc34f83aee86b8f30bffbc399e8577a077f6fe1ed41e6ae03e9e5a4df349`.

**Important:** These metadata checks do not prove whether a particular website/domain/use is covered by the owner's commercial license. The owner supplied the file and confirmed they have a license. Keep a copy of the specific webfont terms and make sure the production hostname and domain traffic allowance are covered.

A **single normal-width Regular 400** is not an equivalent replacement for the oversized **Compressed Black** or Condensed Black styles requested for the hero, campaign montage and footer display. For accurate narrow headlines we retain the already-approved open-source Anton display font and Barlow Condensed italic emphasis rather than pretending the normal-width Regular face can fit those layouts.

## Type hierarchy

| Purpose | Font | Availability |
|---|---|---|
| Long-form text, descriptions and address | Roc Grotesk Regular 400 (when private webfont provisioned) | Protected build asset, not committed to Git |
| Long-form fallback and normal website default | Space Grotesk variable (300–700) | Bundled by `next/font/google` at build time |
| Navigation, small labels, UI | Space Grotesk variable | Included in the regular build |
| Oversized cinematic poster headings | Anton 400 | Included in the regular build |
| True italic headline accents | Barlow Condensed italic 900 | Included in the regular build |
| Technical timestamps and indices | Geist Mono | Included in the regular build |

Google Fonts **Space Grotesk** is open licensed (OFL) and ships in the normal build without the commercial Roc asset. This fallback is reliable in previews and CI.

## Production-only licensed font delivery

The site's public source must **not** include raw proprietary font bytes. It includes only a loader and the font's on-site URL. The owner supplies the licensed binary to the production build through **encrypted build environment variables**.

**Preferred Cloudflare Pages setup: chunked variables, max 4,096 characters each.** Cloudflare's Workers Builds environment-variable documentation specifies a 5 KB per-variable ceiling. A 24,040-byte WOFF2 expands to 32,056 base64 characters, so it requires eight small protected variables. Chunking works even when large single-variable values are rejected.

On a Windows computer, in PowerShell from the repository folder:

```powershell
./scripts/copy-roc-secret-chunks.ps1 -FontPath "C:\\path\\to\\RocGrotesk-Regular.woff2"
```

For each prompt, create an **encrypted production build variable** in the Aiwa Cloudflare Pages project. Paste the clipboard into the named entry: `AIWA_ROC_GROTESK_B64_01`, `_02`, ... `_08`. The helper does not print or write the secret data and clears the clipboard at the end.

**Alternative for build systems accepting larger secrets:** a single `AIWA_ROC_GROTESK_WOFF2_BASE64` containing the complete file. Never configure both the single variable and the chunk variables.

Use the normal `npm run build` command. The `prebuild` hook combines contiguous chunks and validates base64, WOFF2 signature and declared binary length. It copies the binary to `public/fonts/roc-grotesk-regular.woff2` only in the ephemeral build tree. The path is gitignored and the exported HTML contains only a boolean activation marker, never the encoded secret.

Without a licensed input, the build deletes any stale copy at the managed path and uses Space Grotesk. No browser request is made for the unavailable Roc font in fallback mode. Invalid or incomplete input fails the build rather than deploying an incorrectly activated font.

**License:** Only enable this asset on a hostname for which you have webfont embedding rights. Avoid deploying to unlicensed public previews, and check the license's pageview/domain allowances before enabling.

**Webfont reality:** Keeping font binaries out of Git does not make a used webfont confidential: visitors' browsers must download the licensed font, as is normal with self-hosted webfonts. Make sure your license permits this.

## QA and regression acceptance

Chromium runs desktop/tablet/mobile checks at 1440, 1280, 950, 768, 430, 390, 360 and 320 CSS px. Verify:
- Default body family is Space Grotesk, or the licensed Roc if the private font flag is active
- When Roc is active, `document.fonts.check('16px "Aiwa Roc Grotesk Web"')` succeeds
- Poster headings remain the narrower Anton family and don't overflow
- Mobile navigation stays hidden until explicitly opened; no header overflow
- At least 44 px tall key touch targets, no horizontal scroll
- Existing film FLIP, reduced motion, dark/light theme and section geometry regressions

This does not claim pixel-perfect equivalence with The Romans' proprietary asset files or its licensed font-family widths.
