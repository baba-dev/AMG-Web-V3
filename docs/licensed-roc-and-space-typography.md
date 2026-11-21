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

The site’s public source must **not** include raw proprietary font bytes. It only includes the font loader and reference URL. A production build may supply the user's legally licensed file through an encrypted Cloudflare Pages **build environment secret**:

- Secret name: `AIWA_ROC_GROTESK_WOFF2_BASE64`
- Value: base64-encoded binary of the licensed `.woff2` file (no `data:` prefix)
- Scope: production build environment for the licensed web domain; avoid publishing from unrelated preview/custom domains without checking the license.
- Build command: `npm run build` (the `prebuild` hook automatically prepares the font).

On Windows PowerShell, generate the local value **without putting it in Git or chat**:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\\path\\to\\RocGrotesk-Regular.woff2")) | Set-Clipboard
```

Paste from your clipboard into the Cloudflare Pages environment secret field. Do not paste it in GitHub issues, logs or source files. With the secret present, `prebuild` verifies the WOFF2 header, length and base64 encoding, then writes the binary to `public/fonts/roc-grotesk-regular.woff2` during the build only. This file is gitignored. The static export carries the font and an HTML activation marker; CSS then uses it for regular body copy. No secret value appears in the HTML or JavaScript.

Without the secret, the build removes any stale local copy at the managed path, prints `AIWA_FONT_SPACE_GROTESK_FALLBACK`, and uses Space Grotesk. No missing font URL is requested by visitors in fallback mode.

**Webfont reality:** While the binary is excluded from the public Git history and never returned in a chat answer, end-user browsers must still download it when the licensed webfont is enabled. This must be permitted by the webfont license. Using a protected build secret is not DRM and cannot conceal a font that is displayed in a web browser.

## QA and regression acceptance

Chromium runs desktop/tablet/mobile checks at 1440, 1280, 950, 768, 430, 390, 360 and 320 CSS px. Verify:
- Default body family is Space Grotesk, or the licensed Roc if the private font flag is active
- When Roc is active, `document.fonts.check('16px "Aiwa Roc Grotesk Web"')` succeeds
- Poster headings remain the narrower Anton family and don't overflow
- Mobile navigation stays hidden until explicitly opened; no header overflow
- At least 44 px tall key touch targets, no horizontal scroll
- Existing film FLIP, reduced motion, dark/light theme and section geometry regressions

This does not claim pixel-perfect equivalence with The Romans' proprietary asset files or its licensed font-family widths.
