# GOOD COMPANY — Client directory release

Route: /work/clients. The merged V1+V2 library supplies 29 paired WebP assets. The public preview shows 27 user-supplied historical identities; RCS Oman / Renaissance and Vitamin Phones remain pending confirmation of the supplied logo identity. All 29 are mapped. Confirm legal publication permissions and industry tags before merging. No active-client status is implied. Only existing source-backed portfolio records provide detailed project copy. No new client services or metrics are invented.

## Experience
- Editorial hero with actual responsive artwork and animated typography, a sticky index with shareable query state, gallery/index modes, bounded card playground, native modal dossiers, portfolio discipline connections, relationship CTA.
- Mobile: two columns, simplified non-draggable playground. Keyboard controls, focus styling, dialog close/return focus, reduced-motion CSS. White logo backgrounds in both themes.
- Static export uses pre-generated 300/600 WebP variants, explicit dimensions, native srcset, lazy loading below hero; no new dependencies.
- No changes to global footer design or motion mechanics. Navigation moves legacy directory link to internal route.

## QA checklist (before merge)
- Run npm run build, npm run lint, and node scripts/client-directory-assets.mjs.
- Confirm /work/clients exists in out and nav points there. Verify all approved clients render without 404s.
- Check 320, 390, 768, 1024, 1440 viewport widths in both themes; no horizontal overflow or sticky-header overlap.
- Search by name, clear, filter, sort, switch views, reload and browser back/forward.
- Open dossier, tab/shift-tab, Esc, previous/next, close, verify focus and scroll restoration.
- Drag handle with pointer and keyboard, reset, check reduced-motion and mobile alternative.
- Test portfolio links and CTA; confirm global menu/footer and route transition.
- Measure LCP, CLS, INP, mobile network payload, contrast and animation smoothness in deployed preview; these are targets, not pre-verified results.

## Premium refinement
Print registration field, intentional four-card cover composition, archive numbering, quieter spaced gallery, single directional action, verified portfolio markers, filter counts and clear controls, refined dossier artwork plate and explicit focus return, mobile-specific play instructions, and restrained CTA line animation. Existing route and theme system retained. The dedicated browser QA suite checks real interactions and captures desktop/mobile screenshots using the existing shared preview; no additional browser or dependency installation is needed.

## Homepage coherence correction (2026-11-24)
Removed the standalone archive heading and edition bar. Replaced the orbital relationship widget and its unavailable discipline controls with three direct links to existing selected-work records. Existing conceptual artwork is explicitly disclosed. The closing heading now uses upright Anton with shared display tracking and leading, avoiding the prior Barlow Condensed italic collision. The hero, chapter labels, body copy, cards, controls and CTA inherit the homepage typography roles; mono is reserved for actual archive indices and art annotations. The focused browser suite now compares live computed homepage and directory font families/weights, checks headline fit and captures the new editorial section and closing headline. No new dependencies or new client claims.
