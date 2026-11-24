# Aiwa Media Group — Web V3

The next-generation Aiwa agency website: a fast, static, bilingual-brand-aware editorial experience for a Muscat-based creative and technology agency. **Beyond the Noise** is the creative direction. The Romans is a reference for craft and choreography, not a source of proprietary assets or code.

- V3 site: https://next.aiwamediagroup.com/
- Legacy content and media source: https://aiwamediagroup.com/
- Repository: https://github.com/baba-dev/AMG-Web-V3

## Start here

| Read | Purpose |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Mandatory development rules and agent execution contract |
| [Current direction](docs/current-direction.md) | Canonical decisions, shipped baseline, priorities and unresolved work |
| [Agentic development](docs/agentic-development.md) | Fast implementation, parallel work, verification and handoff |
| [CI policy](docs/ci-policy.md) | Actual build/check topology and failure handling |
| [Client logo library](docs/client-logos/README.md) | Asset inventory and publication contract |
| [Documentation index](docs/README.md) | Historical implementation references |

## Local development

Use the Node version pinned in `.node-version` (26.13.1 at the November 24 baseline) and the committed npm lockfile. Do not introduce a second package manager.

```bash
npm ci --no-audit --no-fund
npm run dev
```

Open http://localhost:3000. Before release:

```bash
npm run lint
npm run build
```

The production artifact is `out/`, not a Next.js server. To exercise the exported site locally, run `node scripts/work-static-preview.cjs` after building (port 4173); see the [CI policy](docs/ci-policy.md) for browser test setup. Do not use a development server as proof of static-export compatibility.

## Architecture

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/ui/Base UI primitives, Lucide and next-themes. Versions in `package.json` and the lockfile are authoritative.

Cloudflare Pages serves a fully static export. Keep `output: "export"`, unoptimized images, and static-compatible routing; server-dependent features require a separately approved architecture. Prefer server-rendered markup and small client islands for interaction.

| Location | Role |
| --- | --- |
| `src/app/` | Route entries, root layout, global tokens and route CSS |
| `src/components/` | Shared Aiwa shell, editorial sections, interactions and UI primitives |
| `src/lib/` | Canonical navigation, content registries and route-motion utilities |
| `public/` | Approved local web media, artwork and static assets |
| `scripts/` | Export preview, targeted QA, media checks and private-font preparation |
| `.github/workflows/` | Static-export release gate and manual reference audit |
| `docs/` | Decisions, provenance, implementation and validation notes |

No secrets or proprietary font binaries in Git. The normal build uses public typography; optional Roc is provisioned by the protected build mechanism described in [licensed font delivery](docs/licensed-roc-and-space-typography.md).

## Working agreement

Implement approved work end-to-end in a focused PR, with a polished responsive experience and meaningful regression checks. Avoid ceremonial eight-commit requirements for small work, duplicate QA, re-planning after approval and unrelated refactors. Preserve existing behavior unless the task changes it. A successful build alone does not establish visual quality; report actual browser evidence and any unavailable checks.

The current route inventory and outstanding priorities live in [Current direction](docs/current-direction.md), not this overview.
