# Global SAY HELLO + Aiwa footer

## User-facing change

- Remove the old full-screen `AiwaContact` / LET'S MAKE SOME NOISE section from
  the homepage. The actual /contact page remains intact and is accessible from
  the header, footer and project calls to action.
- Preserve the existing SAY HELLO animated marquee, Muscat three-image gallery,
  physical-location details, keyboard/touch gallery controls and thematic artwork.
- Move that gallery and the established Aiwa footer into `AiwaGlobalEnding`,
  mounted once in `src/app/layout.tsx` immediately after route content.
- Render the identical gallery and footer on every current route, the Next.js
  not-found page, and all future pages without per-page imports.
- Remove per-page `AiwaGlobalFooter` invocations to avoid duplicate footers.
- Preserve the public `#office` anchor for the shared gallery. Rename the
  Contact page's own office anchor to `#contact-office`, including its marquee
  link, to avoid invalid duplicate IDs.
- Replace legacy `/#contact` links with the dedicated `/contact` route.

## Architecture

`AiwaGlobalEnding` is a server composition of the existing client
`AiwaOffice` and `AiwaGlobalFooter` components. The existing carousel and
navigation behavior remains unchanged. A small dedicated wrapper stylesheet
centralizes gutters, theme backgrounds and section seam alignment, while
`aiwa-polish.css` ensures the original homepage editorial type system is
consistently available even on legal, Work, Contact and future pages.

The shared ending is mounted under the root `ThemeProvider` and below route
content, but above `AiwaRouteTransition`. It is outside page-specific
`<main>` elements, and the persistent route transition is preserved.

## QA contract

- Exactly one global wrapper, `#office` section and `#site-footer` per route.
- No old `.aiwa-contact` homepage panel or duplicate footer.
- The `#work` section leads directly into SAY HELLO on the homepage.
- SAY HELLO and footer meet cleanly without a blank gap.
- Contact page `#contact-office` and its marquee link remain valid.
- Three image scenes, buttons, keyboard arrows, phone, address and maps remain.
- Back-to-top works on homepage and inner pages.
- Dark/light mode, accessibility, reduced-motion, no-JS, mobile widths,
  and absence of horizontal overflow are tested.
- Static export remains compatible with Cloudflare Pages.

CI: `scripts/homepage-finale-smoke.cjs` now tests the new global architecture
across all route templates rather than the deleted contact-scroll section.
Existing visual/theme/Work/Contact suites are updated to match the new design.

## Release

Deploy after the static export and all relevant browser checks pass. This PR is
independent from loader typography PR #25 (separate branch, no overlapping files).
