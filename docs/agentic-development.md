# Agentic development playbook

Goal: ship polished, coherent slices quickly with fewer handoffs, fewer CI loops, and less context drift. Use the root [agent rules](../AGENTS.md) as the mandatory compact contract.

## 1. Start with the smallest useful context

1. Read AGENTS, current direction, the task and relevant source. Inspect main HEAD, open related PRs, package scripts and the CI path selector. Read historical docs only for the affected surface.
2. Define a concrete outcome and acceptance checks in a few lines. For a larger cross-cutting change, identify files, dependency order and risks; for an approved plan or narrow fix, proceed without another approval round.
3. Choose one integration branch from current main. Reuse existing patterns and asset registries. If a branch already owns the work, inspect it and coordinate rather than opening a competing implementation.

## 2. Execute in parallel where safe

| Workstream | Ownership |
| --- | --- |
| Content / media | Source verification, attribution, asset inventory, metadata, no invented facts |
| Engineering | Route and data architecture, shared component integration, static export |
| Design / motion | Original artwork, typography, choreography, responsive and theme polish |
| Verification | Targeted acceptance checks, accessibility, browser screenshots, CI diagnosis |

One agent may do all roles. Independent read-only tasks can run concurrently; independent writers must have disjoint paths. Assign a single owner to shared files such as globals, root layout, navigation, shared footer and CI; integrate against latest main. Never use parallel writes to the same branch ref without coordination. No invented subagent results.

## 3. Deliver the vertical slice

- Implement content model and route, reusable interaction, responsive visual treatment, media and meaningful tests as one outcome. Keep CSS scoped and token-driven; do not add libraries or abstractions for one trivial behavior.
- Prefer progressive enhancement and server-rendered content; reserve client islands for actual interaction. Static route generation and direct-entry/reload must work.
- For new routes, link them from canonical navigation only when ready, update metadata and applicable export assertions, and ensure the CI selector sees the route and its dependencies.
- Polish the actual screen, not just the implementation: hierarchy, whitespace, typography, both themes, visual asset quality, hover/focus/touch, loading/resting states and reduced motion.
- Separate content-source uncertainty from engineering completion. Flag blockers instead of publishing speculative copy. Do not expose unreleased assets or private data.

## 4. Choose a right-sized validation path

| Change | Local checks before push (when execution is available) |
| --- | --- |
| Documentation only | Verify links, commands, route claims, consistency and diff; required GitHub checks still apply |
| Small CSS/content fix | Targeted ESLint if applicable, affected route in both themes and responsive widths, relevant smoke |
| New route or feature | Lint, static build, exported preview, relevant browser journey and direct/reload navigation |
| Shared shell, theme or motion | Above plus representative homepage/inner routes, menu layering, keyboard, reduced motion and mobile |
| CI/dependencies | Full manual/CI regression selection, check-name compatibility and reproducible build |

Start with a representative desktop (1440px) and mobile (390px), expand to 320/768 and breakpoint-adjacent sizes as needed. Inspect actual rendered text/contrast and loaded fonts, not just class names. Reuse CI scripts; don't create a new full-width matrix for each polish pass. Preserve useful accessibility and functionality checks. Use export preview instead of relying on dev behavior. See [CI policy](ci-policy.md) for exact commands.

## 5. Close the loop

For failing CI: verify PR head, find the first causal failing step and inspect logs/artifacts, distinguish infrastructure flake from a product regression, reproduce when possible, apply the smallest correct fix and validate the new head. A failure caused by intentionally changed UX warrants updating the stale expectation, not deleting a meaningful test. Do not weaken tests to unblock merging.

Use one PR per slice. Large tasks may use logical checkpoints (foundation, data/media, UI, responsive/motion, integration, QA, docs), but no arbitrary commit count. Keep commit messages descriptive. Don't generate redundant issue/PR comments for routine status.

PR handoff:
- Summary: outcome and changed scope.
- Decisions: new direction, tradeoffs, source/asset provenance if applicable.
- Validation: exact checks run and results; browser evidence or explicit limitations.
- Risks: remaining placeholders, content permissions, or follow-up work.
- Status: PR link, head SHA/check state, merge or deployment status only if verified.

When authorized to merge, verify applicable checks on the current head, required approvals and mergeability; merge without bypassing protections. If CI is still running, leave the PR open (or enable repository-supported auto-merge when authorized); do not claim the merge or future monitoring occurred. Verify deployment separately when available. Update durable docs only for lasting decisions and actual merged status.
