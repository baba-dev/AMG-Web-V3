# Aiwa V3 editorial design system

The approved homepage is the visual authority. Inner routes may vary composition, not brand semantics. Existing homepage rendering is the baseline, not a redesign target.

## Canonical sources

- `src/styles/typography.css`: Anton 400 display, Barlow Condensed 900 italic emphasis, Space Grotesk reading and UI, Geist Mono true technical/index metadata. Use semantic sizes and shared tracking. No route-level font palettes or arbitrary heading clamps.
- `src/components/aiwa-polish.css`: shared editorial paper, raised surface, ink, muted text, rule and gutter. Dark paper #0f0f0f, raised #171716, ink #f5f5f3, muted #aaa9a2; light paper #f5f5f3, raised #e9e7df, ink #0a0a0a, muted #4f514a. Homepage film and art may have intentional image-specific colors.
- Shared global header, mega menu, global ending and footer remain authoritative. No duplicate page-ending sales poster.
- Use neutral inverse controls, hairline rules, visible focus, 44px touch targets and the editorial arrow/link vocabulary. Do not introduce a dashboard theme for a portfolio.

## Geometry and motion

Keep the established horizontal gutter. Choose compact, standard or cinematic section spacing; preserve meaningful asymmetric layouts and responsive media. A local grid, asset aspect ratio or optical adjustment is not a brand token. Use shared motion duration/easing for interface states; artistic timelines may vary and must respect reduced motion. No scroll hijacking.

## Exceptions and verification

Project media, client artwork, logos and bespoke illustrations can use their own colors; they do not define page chrome. Device bezels and screenshot mattes are media-specific exceptions. Any new UI role belongs in the canonical source, with documented rationale. Existing unrelated routes are not automatically normalized by this change.

For every changed route inspect light/dark at 320, 390, 768, 1024 and 1440px; verify computed typography and palette, overflow, focus, and representative motion. Compare homepage screenshots against the base revision in the same browser and review portfolio screenshots; never claim visual parity from source inspection alone. Preserve the current static export and browser regression gates.
