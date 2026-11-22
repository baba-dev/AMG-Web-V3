# Team & Culture — Aiwa V3 release gate

## Scope
- `/team`: seven editorial chapters, hero, authentic archive, filterable legacy profiles with accessible dialogs, specialties, culture, Muscat, careers.
- `/join-us`: companion recruitment/culture landing page, linking only to known official company routes.
- Shared global Aiwa footer and signal route transition remain in the root layout; no duplication.
- Uses the established Anton / Barlow Condensed / Space Grotesk + licensed Roc typography and light/dark palette.

## Source evidence and limitations
- Company team page: https://aiwamediagroup.com/our-team/
- Company careers page: https://aiwamediagroup.com/career/
- Team records are **legacy archive data**; role titles and current employment require owner sign-off.
- The old site was seen serving inconsistent team lists across indexed and live snapshots. The selected ten records match the observed company-origin archive snapshot. This is not asserted as current headcount.
- Portraits are intentionally absent, represented by typographic monograms. **Do not substitute invented headshots.** Import approved real photographs (WebP/AVIF) per person and update `portrait` only after confirming identity and publication permission.
- Media reused from `public/media/archive` is already present in this repository. Labels distinguish company production footage/imagery from campaign artwork. `aiwa-signal.svg` is original graphic illustration, never documentary photography.
- Former internship listings are NOT assumed to be active; Join Us points to the official company LinkedIn presence and contact route instead.

## Run checks
1. `npm ci`
2. `npm run test:team`
3. `npm run lint`
4. `npm run build` (must export `out/team.html` and `out/join-us.html`)
5. Serve `out/` at `http://127.0.0.1:4173` and run `npm run test:themes` when Playwright is installed.
6. Manual QA: desktop widths 1440/1280/1024; mobile 768/390/360. Toggle dark/light on both pages, verify contrast, no clipped headings, no horizontal overflow.
7. Keyboard: tab through filters, open profile, Escape closes, focus returns to triggering person. Profile source opens in a separate tab safely.
8. Reduced motion: type reveals do not animate, navigation works without overlay, hover-only visual effects are non-essential.
9. Verify route transition from homepage navigation to Team, Team to Join Us, browser Back, and global footer appearance.
10. Check image loads and alt text; retest after real employee photos are approved.

## Publication decision
Code can be reviewed without verified current portraits and titles, but **a current-team claim is blocked** until each published individual is checked. Avoid automatically redirecting the old /our-team/ URL until this content review is complete.
