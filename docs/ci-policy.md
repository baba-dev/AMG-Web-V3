# CI policy

A single static build and a single preview per PR. The static output check retains its original workflow/job name. Hero and dual-theme smoke run once on every PR. Other unique browser suites run on relevant changes; CI changes and manual dispatch run the full suite. Main pushes verify the production export without repeating PR browser checks. Failed or manual runs retain diagnostics. External public reference screenshots are manual-only and not a release gate. No synthetic media-position or pixel assertions: menu stacking is checked against the real sibling layers and visible pointer target. Existing specialized test scripts remain available. Check branch protection before retiring any legacy required check names; the app cannot read administrative settings.

## Actual workflow

Source: [verify-static-export.yml](../.github/workflows/verify-static-export.yml), [ci-browser.cjs](../scripts/ci-browser.cjs), [reference-motion-audit.yml](../.github/workflows/reference-motion-audit.yml).

- Required-check compatibility: retain workflow **Verify Cloudflare Pages static build** and job **Next.js static export**. Do not infer branch protection from workflow names alone.
- Pull requests: locked install, one static build, verify `out/` and current route files, one Chromium installation, one static preview on port 4173, then one invocation per selected browser suite.
- Always-on PR suites: `hero-visual-smoke.cjs`, `all-pages-theme-qa.cjs`. Other suites are path-selected. Changes to CI, build configuration, lockfile or preview harness and manual dispatch run all unique suites. Missing diff information falls back to full QA.
- Main pushes verify export, without repeating browser suites. Concurrency cancels obsolete runs. Failed/manual runs retain diagnostic artifacts. External reference workflow is manual and nonblocking.
- Lint is a local development check exposed by package.json; do not claim the existing workflow runs it.

## Local export QA

Use the pinned Node version. In one shell:

```bash
npm ci --no-audit --no-fund
npm run lint
npm run build
npm install --no-save --package-lock=false playwright
npx playwright install chromium --only-shell
node scripts/work-static-preview.cjs
```

In another shell, run the relevant script against the export (port 4173):

```bash
node scripts/hero-visual-smoke.cjs
npm run test:themes
# Or run all selected unique browser suites with a manual event:
CI_EVENT=workflow_dispatch node scripts/ci-browser.cjs
```

The last command uses POSIX shell syntax; on PowerShell set `$env:CI_EVENT = "workflow_dispatch"` first. Inspect the specific script for supported options and output. Do not repeatedly run the full suite during narrow iteration; use targeted checks first.

## Change discipline

- For new routes, extend the export route check and relevant theme/scope coverage; do not add duplicated builds, preview servers or browser installs. Include new route dependencies in the selector when necessary. Keep full manual coverage for integration regressions.
- Distinguish useful assertions (functional behavior, real hit testing, semantics, static routes, theme readability) from obsolete selectors, duplicate checks and brittle pixel/geometry assumptions. Replace stale expectations when the approved design changes; retain the regression intent.
- Use job logs and diagnostic artifacts to establish failure cause. Only rerun genuine transient failures; fix deterministic errors. Verify the latest head rather than an earlier green run. Do not bypass branch protection, mark failures ignored, or delete a meaningful gate to accelerate a merge.
- Docs-only PRs still trigger the existing workflow and always-on smoke; the current policy does not introduce a docs-only bypass. Any future optimization must preserve check-name compatibility and the required release guarantees.
