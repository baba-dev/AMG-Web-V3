# Calligraphy assets (Development page, `/specialisms/tech`)

Decorative **Thuluth** (ثلث) calligraphy for page backgrounds and header accents. Decorative only: always `aria-hidden`, real headings stay real text.

## Where to upload

| Folder | What goes here |
| --- | --- |
| `source/` | Raw images from ChatGPT (PNG/WebP) or any original art. Input for tracing. |
| `svg/` | Final SVG files if you already have clean vector art. Optional: otherwise the build converts `source/` for you. |

## File names and word keys

Source images keep the names they were supplied with; the build script maps each to a lowercase word key (the SVG file name and the key used by `InkCalligraphy word=...`).

| Word | Meaning | Key | Source file |
| --- | --- | --- | --- |
| تقنية | technology | `tech` | `technology-arabic.png` |
| ابتكار | innovation | `innovation` | `innovation-arabic.png` |
| عُمان | Oman | `oman` | `Oman-arabic.png` |
| هندسة | engineering | `engineering` | `engineering-arabic.png` |
| برمجة | programming | `programming` | `programming-arabic.png` |
| تصميم | design | `design` | `design-arabic.png` |

To add or replace a word: put the PNG in `source/`, add it to the `WORDS` map in `scripts/calligraphy-build.mjs`, run `node scripts/calligraphy-build.mjs`, then `node scripts/calligraphy-check.mjs`.

## Original naming guidance (superseded by the table above)

| Word | Meaning | Name |
| --- | --- | --- |
| تقنية | technology | `tech` |
| ابتكار | innovation | `innovation` |
| عُمان | Oman | `oman` |
| هندسة | engineering | `engineering` |
| برمجة | programming | `programming` |
| تصميم | design | `design` |

Examples: `source/tech.png`, `svg/tech.svg`. If you generate variations, add `-2`, `-3` (for example `tech-2.png`). Priority words: tech, innovation, oman.

## Source image requirements

- Pure black (#000) shape on pure white (#FFF) background, no texture, gradient, shadow, frame or colour.
- Wide landscape, about 3:1, as large as possible (2000px wide or more is ideal).
- The whole word inside the canvas, centred, with empty margin.
- Correct spelling and joins. Check each one before upload. Mirrored or invented letters are rejected.

## Rights record

Add one line per file to `SOURCES.md` in this folder: file, how it was made (for example "ChatGPT image generation, prompt v1, owner-reviewed"), date, and who approved it for publication.

## How the "being written" animation works (for implementers)

The goal is that each word looks like a pen writing it, right to left, in the order a calligrapher would write the letters.

1. **Trace**: `source/*.png` is traced to a filled outline path (the final visible artwork).
2. **Pen path**: a centre-line (skeleton) of each letter is derived and stored as ordered stroke paths inside `<g id="pen">`, one path per stroke, in writing order (right to left; connected body strokes first, dots and marks last).
3. **Reveal mask**: the filled outline sits in a group that is masked by the pen paths drawn with a thick round stroke, wider than the thickest part of the letter (about 1.3x). Animating each pen path with `stroke-dasharray = stroke-dashoffset = pathLength`, then dashoffset to 0, reveals the real outline as if inked by a reed pen, keeping the Thuluth contrast intact.
4. **Timing**: total draw time 1.6 to 2.4 s per word, easing `power2.inOut`, strokes chained with small overlaps, dots pop in last with a short scale. The stroke length for each path is read at runtime (`getTotalLength`), never hard-coded.
5. **Resting state**: after drawing, the artwork is fully visible. With `prefers-reduced-motion`, or if JavaScript fails, the full word renders immediately, no animation.
6. **Triggering**: starts when the word enters the viewport (ScrollTrigger), plays once, and may repeat only on explicit interaction. Nothing animates offscreen.
7. **Theming**: fill uses `currentColor`, with page-controlled opacity (about 0.06 to 0.14 as background, higher in headers) so it works in light and dark themes. No hard-coded colours in the SVG.
8. **SVG hygiene**: fixed `viewBox="0 0 1200 400"`, `preserveAspectRatio="xMidYMid meet"`, no embedded raster images, no fonts, no scripts, under about 40 KB each after optimisation. Include `<title>` only if the art is ever not decorative (normally it is not).
