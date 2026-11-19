# Home page Section 4 — About Aiwa Media Group

## Scope

The fourth major homepage section begins immediately below the completed Specialisms block. The reference is the About Us teaser on [The Romans](https://www.wearetheromans.com/) homepage (small section label, oversized editorial statement, concise agency paragraph, learn-more link).

## Approved independent Aiwa adaptation

- Eyebrow: **ABOUT US**.
- Headline: **CREATIVE MEDIA / FOR BRANDS / THAT REFUSE / TO BLEND IN.** Staggered multi-line reveal, with italic emphasis.
- Paragraph: Aiwa Media Group's established competencies: strategy, branding, digital marketing, production, events and technology.
- Location: **FROM MUSCAT, OMAN / TO EVERYWHERE.**
- CTA: **LEARN MORE** links to the existing [Aiwa About page](https://aiwamediagroup.com/about-us/) until a new Next.js `/about` route is implemented.
- Section 3 closing **THIS IS WHY** CTA now links to `#about`; header **ABOUT** also targets the section. Section 3's seven temporary category links remain `href="#"` as requested.

The design follows Aiwa's established black/white editorial palette and typography-led presentation. The reference's exact font metrics, background and animation keyframes are not definitively available from public inspection, so this is a carefully authored motion/layout approximation, not a verified pixel-identical reproduction.

## Technical decisions

- Isolated `AiwaAbout` client component and stylesheet; no new dependencies.
- IntersectionObserver reveals heading text through masked line containers, staggered translate and skew with modest blur, then fades in body/CTA.
- Reverses animation on leaving and re-entering viewport, but fully exposes content when JavaScript is unavailable.
- Respects `prefers-reduced-motion: reduce`; no tracking, data storage or paid services.
- Native `<section id="about">`, `<h2>`, meaningful link target and keyboard focus visibility.
- Keeps Next.js `output: "export"` on Cloudflare Pages Free.

## Verification

Extend Chromium browser smoke suite at 1440×900 and 390×844:
- Confirm section 4 starts exactly at the bottom of section 3, with no overlap or gap.
- Confirm navigation and CTA targets, eyebrow, copy and headline.
- Confirm no horizontal overflow or clipped headline lines.
- Record screenshots of section 4 for visual review.
- Check viewport-reveal and reduced-motion state (new screenshot tests cover reduced motion).
