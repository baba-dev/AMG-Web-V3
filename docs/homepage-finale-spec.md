# Homepage finale — Sections 6 and 7

## Scope and source
The Romans homepage (public observed content) finishes its featured work with
a full-viewport **Get in touch / work with us** typographic conversion treatment,
then an image-led office/location sequence and global footer. Exact proprietary
easing values, assets and licensed fonts are not accessible: this implementation
is an original, independently authored Aiwa adaptation using those visible
structural ideas.

Aiwa's existing section sequence is Hero (1), Film (2), Specialisms (3),
About (4), Selected Campaigns (5). The new Section 6 is **GET IN TOUCH** and
the final Section 7 is **MUSCAT / OUR WORLD + global footer**.

### Source-backed facts
- One disclosed office: Aiwa Media Group, HGRW+VMV, 3711 Way,
  Muscat, Oman: https://aiwamediagroup.com/contact-us/
- Telephone: +968 9613 8461 (same public contact source).
- Current contact form: https://aiwamediagroup.com/contact-us/
- Career: https://aiwamediagroup.com/career/
- Company and team pages: /about-us/ and /our-team/ on the same domain.
- Instagram: @aiwamediagroup.om (confirmed by the official YouTube
  video description https://www.youtube.com/watch?v=d4wBqEmgFKA).
- LinkedIn: https://www.linkedin.com/company/aiwamediagroup/
- Company attribution: Aiwa Media Group by Ahmed Al Ajmi Trading, stated on
  the existing company website.
- **Do not invent offices in other countries, awards, email addresses, or
  client results.**

## Design targets

**Section 6 / conversion**
- Editorial near-black canvas in dark mode, warm ivory in light.
- Small outlined GET IN TOUCH label.
- Two-line giant condensed headline: **LET'S MAKE / SOME NOISE.**
- Offset duplicate render as an aria-hidden kinetic/masked visual layer.
- Original subtitle: “Great ideas deserve attention. Let's make something
  impossible to ignore.”
- Primary button START A PROJECT links to existing working Aiwa contact page.
- A ~175svh desktop scroll stage with a sticky 100svh visual frame.
- A reversible scroll-scrubbed mask/skew/offset reveal and CTA.
- Mobile uses a natural-height composition and intersection-driven reveal.
- No-JS and reduced motion display fully accessible static content.

**Section 7 / location story**
- One factual location, Muscat. Three **original illustrated editorial
  frames**: Muscat skyline, creative studio tools, production process.
- The frames are NOT photographs or claimed depictions of Aiwa’s actual
  office or employees. Approved media may later replace them.
- Manual next/previous buttons and numbered selectors; accessible live
  captions, no autoplay, mobile swipe that does not hijack vertical scroll.
- Verified address, telephone, directions and existing contact form.
- Correct local identity in the footer, social links, route navigation,
  back-to-top animation and genuine external legal/about resources.
- No false multi-office listing.

## Eight commits
1. Reference specification and review decisions.
2. Section 6 semantic layout / CTA.
3. Reversible desktop typographic motion.
4. Dedicated responsive / reduced-motion variants.
5. Original Muscat editorial media and interactive office gallery.
6. Global footer, verified external navigation and policies.
7. Performance, keyboard/contrast and duotone polishing.
8. Playwright desktop/mobile/scroll/keyboard tests, production CI,
   documentation and release checklist.

## Acceptance gates
- Existing 1–5 section geometry and motion unchanged.
- No overlays, no abrupt Section 5 → 6 → 7 gaps or page overflow.
- Contact headline and CTA visible/reachable in both themes.
- Section 6 scroll forward and reverse (0 / 25 / 50 / 75 / 100%).
- Section 7 carousel navigation by pointer and keyboard, button count,
  touch-swipe, real links, no claims of physical studio photographs.
- 1440×900, 1280×800, 390×844, 360×800 Chromium frames.
- No-JS and prefers-reduced-motion content accessibility.
- Next.js 16 static output with Node 26; Cloudflare Pages Free
  preview; no paid Workers/Pages Functions, database, or Stream costs.
- Do not merge until checks and preview pass.
