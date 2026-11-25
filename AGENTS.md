<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Aiwa V3 agent rules

Read this file first. For every task, inspect [current direction](docs/current-direction.md), [execution playbook](docs/agentic-development.md) and the relevant source. Read the [CI policy](docs/ci-policy.md) before changing tests or workflows. Historical release documents are evidence, not current product instructions. The latest explicit owner decision takes precedence over older product documentation; never let it override security, licensing, accessibility or static-hosting constraints.

## Execute, don't cycle

- An approved plan is authorization to implement its scope, not an invitation to re-plan. Start from current main, check open PRs and changed files, and reuse existing components, tokens, data and tests.
- Ask only when a material decision cannot be safely inferred (publication rights, destructive changes, architecture/cost, or materially different product direction). Use reversible defaults for ordinary implementation details.
- Own the whole slice: UI, content, responsive behavior, motion, navigation, accessibility, QA and documentation. Do not leave placeholder UI, guessed facts or unfinished wiring as a completed feature.
- One coherent PR per outcome. Use as many meaningful commits as needed; eight commits are optional for large planned work, not a gate. Parallelize independent read/research/build tasks only; coordinate shared files and serialize integration. Do not overwrite a collaborator's work or merge unrelated changes.
- If blocked, finish the independent parts and report the exact blocker. Never claim a command, screenshot, deployment, green CI or merge happened without evidence.

## Product and UI non-negotiables

- Aiwa is an original editorial agency experience. Use The Romans as a public visual/motion benchmark; create original artwork and use verified Aiwa media, never copy proprietary source, unlicensed fonts or images.
- Use the shared typography roles and theme tokens in `src/app/globals.css`. Anton display, Barlow Condensed 900 italic emphasis, Space Grotesk reading/UI, Geist Mono metadata. Footer text links/contact details match the Privacy Notes role. Preserve the Arabic Optical Echo art. Roc is optional, never necessary for layout correctness.
- Both light and dark themes, 320px through wide desktop, no horizontal overflow, clipped headings, illegible contrast or broken menus. Keyboard access, visible focus, semantic structure and reduced-motion are required. Provide touch-friendly controls; keep essential content visible without animation.
- Choreograph, don't decorate indiscriminately: animate meaningful entrances/transitions with a clear resting state; avoid layout jank, competing layers, scroll hijacks and endless offscreen animation. Preserve hero intro vs scroll-film separation, route transitions and menu/film stacking.
- Shared header, mega-menu (links + illustration only), footer and navigation data are single sources of truth. Do not recreate global chrome per route. Check link targets in the actual static export before replacing temporary destinations.
- Prefer original SVG for vectors/motion and appropriately sized local WebP for raster media; preserve supplied client marks, white logo surfaces and 300/600 asset pairs. Verify content provenance and publication permission; never invent client work, team biographies or results.

## Engineering and release

- Static Cloudflare Pages export is a hard constraint. No runtime server, dynamic route without static params, server action or API assumption. Use `npm ci` and the pinned Node version; no dependency additions without a clear need.
- Preserve the generated Next.js instructions above. TypeScript, scoped CSS and canonical tokens first; favor small client boundaries and existing patterns. No new global overrides, secret leakage, or broad rewrites for narrow fixes.
- Read `package.json` and workflow scripts for real commands. Run the smallest relevant local checks, then the required export/CI gate. Reuse targeted suites, add assertions for genuine new risks, and retire only demonstrably redundant or obsolete checks. Never weaken a real failing check merely to get green.
- Inspect the rendered page in both themes and representative desktop/mobile sizes for visual work. Check actual interaction behavior, not brittle invented geometry. If a browser is unavailable, state that explicitly.
- Follow [CI policy](docs/ci-policy.md): one build/preview, mandatory hero/theme smoke, changed-scope suites, manual full/reference QA. Preserve required check names and branch protection.
- On CI failure inspect the failing job/logs at the current head, reproduce and fix the root cause, then re-check. Do not blindly rerun deterministic failures. Merge only when requested/authorized and all applicable gates are green; never bypass required checks.
- In the PR describe scope, decisions, concrete tests/results, visual evidence or gaps, and remaining risks. Update canonical docs only when a durable decision, route, workflow or asset contract changes. Keep status factual and concise.

## Design-system governance (mandatory for AI and human contributors)

Read [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) before changing visual routes. The homepage is the reference, not an invitation to redesign it. Use canonical roles in `src/styles/typography.css` and editorial tokens in `src/components/aiwa-polish.css`. Do not invent a route palette, local font-size scale, brand font or second global CTA. Artwork and device media may have project colors; page chrome may not. Any genuinely new role requires a shared token and documented rationale. The technology contract runs with the existing static verification and browser suite; expand its scope deliberately as other routes are normalized, never hide a failing check. Render and compare both themes and desktop/mobile against the homepage before claiming visual parity.
