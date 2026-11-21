# Visual fidelity QA — source frame baseline

Reference: previously captured, publicly rendered The Romans homepage at
1440×900 and 390×844 (19 November 2026). No source page, proprietary
typeface or reference imagery is bundled with the Aiwa repo.

Visual acceptance:
- Hero: condensed white poster type, 2 desktop lines and 4–5 mobile rows,
  inline video tile, header close to reference scale, no text clipping.
- Film: no per-frame width/height layout thrash; popup opens with a FLIP
  trajectory from thumbnail, remains on poster until player loads, closes
  back to the source, has Escape/backdrop and accessible fallback.
- Specialisms: white canvas, dense image-interleaved categories and stable
  scroll-linked folding (no repeated transformed-geometry jitter).
- About: large media still plus editorial text on warm white background.
- Work: smaller cards, retained Aiwa original assets and scroll montage.
- Contact / Office / Footer: slim typography, white SAY HELLO marquee,
  physically accurate single Muscat location and white footer.
- Mobile: no horizontal overflow or awkward large blank hero space;
  typography fits within viewport, touch targets remain >=44 CSS px.
- Reduced motion: no unneeded animated transitions, modal immediately
  accessible, no iframe loaded until the poster is ready.

Do not call any implementation pixel-identical to The Romans until paired
reference screenshots and matching approved Aiwa media/font are available.
