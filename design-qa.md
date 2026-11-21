# Design QA — Muscat Futurecraft `/home-2`

## Evidence

- Source reference: `/workspace/scratch/789c05502833/generated_images/exec-75b4cad2-072a-4588-987f-e493da7f00e4.png`
- Live implementation: `https://feat-home-2-muscat-futurecra.amg-web-v3.pages.dev/home-2`
- Desktop capture: `/workspace/scratch/789c05502833/home2-qa-latest/home-2/desktop-hero.png`
- Mobile capture: `/workspace/scratch/789c05502833/home2-qa-latest/home-2/mobile-hero.png`
- Mobile navigation capture: `/workspace/scratch/789c05502833/home2-qa-latest/home-2/mobile-navigation.png`
- Film interaction captures: `/workspace/scratch/789c05502833/home2-qa-latest/home-2/desktop-film.png` and `mobile-film.png`
- Automated viewports: 1440×900 and 390×844 at 1× density
- Live browser review viewport: 1365×768

## Comparison

The implementation preserves the selected direction's defining hierarchy: warm ivory ground, oversized two-part editorial headline, Muscat mountain-and-coast collage, orange sun, fine contour motion, blue arc, offset filmmaker portrait, coordinates and the black work CTA. The generated reference is treated as art direction rather than flattened into a screenshot; type, navigation, CTA and interaction layers remain native, responsive and accessible.

Desktop evidence confirms the intended overlap between the landscape, second headline and portrait without horizontal overflow. Mobile evidence confirms the headline reflows to a strong stacked composition, the portrait remains legible, and the coordinate/CTA row fits inside the first fold.

## Focused interaction evidence

- Film portrait opens the existing polished full-film dialog and closes from the visible close control and Escape.
- `ENTER THE WORK` updates the URL to `#work` and lands on the Selected Campaigns section.
- Mobile navigation opens as a full-screen menu, leaves its close control above the overlay, and closes again.
- Pointer and scroll depth motion are disabled by `prefers-reduced-motion`.
- Native images load at their expected source dimensions and the document reports no horizontal overflow at either automated viewport.

## Iteration history

1. Initial desktop/mobile browser capture established the layout and asset fidelity.
2. The mobile close button was found beneath the navigation overlay; its stacking order was corrected.
3. The mobile first fold was tightened so coordinates and the complete work CTA remain visible.
4. The route-specific regression test was updated to ignore a harmless YouTube `compute-pressure` permission warning while continuing to fail on real page errors.
5. Final Cloudflare static build and desktop/mobile browser smoke checks passed.

## Console and runtime

- Final static export: passed.
- Final route-specific browser smoke: passed.
- No application page errors or unexpected console errors in the final run.
- The external YouTube embed emits a browser permissions-policy notice for `compute-pressure`; this is isolated to YouTube and does not affect playback or the page.

## Final result

passed
