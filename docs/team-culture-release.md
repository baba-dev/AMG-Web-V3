# Team & Culture — Aiwa V3 release gate

## Scope
- `/team`: seven editorial chapters, an editorial gallery, five current company-supplied profiles with role-specific icons and accessible dialogs, specialties, culture, Muscat and careers.
- `/join-us`: recruitment/culture landing page linking only to known official company routes.
- Shared global footer and signal route transition remain in the root layout.
- Uses the established Aiwa typography and dual light/dark palette.

## Team roster approval and visual treatment
The company explicitly supplied the five current team members and their descriptions for this update:
1. Imaad Khan — Founder & CEO; over 20 years nurturing small businesses and launching their online presence.
2. Abeer Sayed — Director of Operations; client and project management, Events Orchestration.
3. Sameer Siddiqui — SDE-II, DevOps Engineer; web technology, cloud providers, IT development, servers and ESP32-based IoT.
4. Mahmoud — Sales; Omani sales professional.
5. Talha — Media & Artwork; designer.

Legacy employees not included in the new approved list have been removed from the public team directory. We do not invent surnames, further roles, images or biography details.

Profile cards and dialogs use distinct **Lucide vector icons**, never portrait photos or AI-generated likenesses. Monogram letters are purely decorative. Unrelated archival campaign imagery in the editorial gallery remains labeled as campaign work, not employee portraits.

## Run checks
1. `npm ci`
2. `npm run test:team`
3. `npm run lint`
4. `npm run build` (verify `out/team.html` and `out/join-us.html`)
5. Serve `out/` at `http://127.0.0.1:4173` and run `npm run test:themes` with Playwright installed.
6. Manually QA widths 1440/1280/1024 and 768/390/360; both themes; contrast, typography and horizontal overflow.
7. Check each filter, card and role icon; keyboard Tab, Escape and focus restoration in dialog.
8. Check reduced motion and route transitions across Team and Join Us.
9. Verify editorial images are not labelled as portraits; no team profile has an image.
10. Review final employee details before publishing company-facing copy.

## Publication decision
This new roster supersedes the historical, unverified list from the old company site. No portrait permissions or images are required. Release still depends on the normal CI and site QA checks.
