# Aiwa V3 Work Index — Grid/List & Theme Redesign

## Design intent

A stronger Work index that belongs to Aiwa. The Romans /work inspired the
presence of a list alternative, not its proprietary design, animations, fonts
or media. This change is deliberately limited to /work: all six projects,
source-backed descriptions, conceptual artwork disclosures, filter categories
and case-study destinations remain intact.

## New interaction contract

- Default mode: existing asymmetric editorial grid. The new List button
  reveals a numbered typographic directory with client, descriptor, discipline
  and directional arrow. Desktop hover/keyboard focus reveals a contextual art
  thumbnail; touch layouts show stable miniature images beside project titles.
- Grid/List controls have accessible aria-pressed states, descriptive group
  labels, clear keyboard focus and 44px minimum tap surfaces.
- Shareable URL ?view=list coexists with ?category=brand|digital|production.
  Grid is canonical (view omitted). Browser Back/Forward restores both states.
- When no URL mode is specified, a last-used preference is restored from
  localStorage when available. Storage denial is handled safely. Without JS,
  all six projects still appear as normal HTML links in the grid.
- Category filters and display modes use one typed catalogue, no duplication.

## Visual system

- Typography: Space Grotesk for main headings, UI and client typography;
  real Barlow Condensed italic reserved for deliberate editorial emphasis.
  Licensed private Roc Regular remains supported for body content.
- Dark: charcoal cover, graphite project directory, dark-slate process,
  ink CTA and graphite footer. Entire Work page honors saved dark setting.
- Light: warm-silver cover, warm-paper index, stone process, contrasting ink
  CTA and paper footer. Restrained orange is a secondary editorial accent.
- Motion: CSS transitions for rows/art and existing viewport reveal, disabled
  for reduced-motion. No scroll hijacking, cursor tracking or new packages.

## Responsive and regression acceptance

Playwright coverage: 320, 360, 390, 430, 768, 950, 1280, 1440 widths.
No horizontal overflow; correct filter counts; saved list preference; list
deep link; combined list+filter URL; 44px essential controls; valid project
routes; desktop and mobile list screenshots; mobile navigation; both themes
for gallery, process and footer; reduced-motion and no-JS. Existing homepage,
static export and case-study tests remain in CI.

The six SVGs remain clearly attributed as conceptual editorial images, not
photographs of campaigns. No fictional results or client quotes were added.
Reference: https://www.wearetheromans.com/work
