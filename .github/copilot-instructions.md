# OctoCAT Supply Chain Management Application – General Copilot Instructions

These are repository-wide guidelines. Path‑scoped files in `.github/instructions/*.instructions.md` provide focused guidance for specific areas (frontend, API, database).

## High-Level Architecture

TypeScript monorepo with:
- `api/` Express REST API (SQLite persistence, repository pattern, Swagger docs)

- `frontend/` React + Vite + Tailwind UI
- Shared demo + infra docs under `docs/` and deployment scripts under `infra/`

Refer to `docs/architecture.md` and `docs/sqlite-integration.md` for deeper details. Avoid restating them in reviews and link instead.

## Language-Specific Best Practices
This repo is TypeScript-first (no Python/Java/Go/C# source is present despite the Makefile's template scaffolding for those backends). Path-scoped files under `.github/instructions/*.instructions.md` cover API/database/frontend review specifics; the rules below are baseline language conventions to apply everywhere they're relevant.

### TypeScript / JavaScript (api/, frontend/)
- Keep `strict` mode enabled in `tsconfig.json` (and prefer additional flags like `noImplicitAny`, `strictNullChecks`) rather than loosening it to silence errors.
- Let TypeScript infer types for simple locals; add explicit annotations for function parameters, return types, and public API surfaces.
- Avoid `any`; prefer `unknown` plus narrowing when a type is genuinely unknown, or a precise union/generic.
- Use `interface` for extensible object shapes (props, DTOs); use `type` for unions, tuples, and mapped/utility types.
- Prefer ES module `import`/`export`; keep 2-space indentation and existing ESLint (`typescript-eslint`) + Prettier conventions in `eslint.config.mjs`/`eslint.config.js`.

### SQL (database/migrations, database/seed)
- Name migrations with a strict sequential/number prefix; never edit a previously-applied migration—add a new one.
- Use `CREATE TABLE IF NOT EXISTS` / `CREATE INDEX IF NOT EXISTS` where feasible for idempotency, and wrap multi-statement migrations in a transaction.
- Never string-concatenate user input into SQL in application code—always use parameterized queries/prepared statements.
- Keep seed scripts re-runnable (`INSERT OR IGNORE`/upsert) and deterministic (explicit IDs) since other seed files reference them.

### Bicep / Azure IaC (infra/)
- Annotate every parameter and resource with `@description(...)`; avoid hardcoded secrets—use `@secure()` params, Key Vault references, or managed identities instead.
- Apply least-privilege RBAC (scope role assignments narrowly; avoid subscription-level `Owner`/`Contributor`).
- Keep resource declarations idempotent/deterministic (no imperative scripting); pin explicit API versions per resource.
- Only output non-sensitive values (IDs, names, URLs)—never secrets or connection strings.

### Shell scripts (entrypoint.sh, demo/, .github/hooks/)
- Start scripts with `set -euo pipefail`; quote all variable and command substitutions (`"$var"`, `"$(cmd)"`).
- Validate required env vars/arguments early and fail fast with a clear message and non-zero exit code.
- Avoid parsing `ls`; use globs or `find -print0`. Prefer `#!/usr/bin/env bash` and `[[ ]]` conditionals.

### Dockerfiles (api/, frontend/)
- Use multi-stage builds; copy dependency manifests and install before copying full source to maximize layer caching.
- Run as a non-root user, pin base image tags (avoid `latest`), and keep `.dockerignore` current to shrink context and avoid leaking secrets.

### YAML / GitHub Actions (.github/workflows, .github/actions)
- Default `permissions:` to least privilege (e.g., `contents: read`) and elevate only specific jobs that need it.
- Pin third-party actions to a commit SHA (version tag at minimum for first-party actions); never inline secrets in YAML.
- Cache dependencies keyed on the lockfile hash; prefer reusable/composite workflows over duplicated job logic.

### Markdown / Documentation (docs/, README.md)
- Keep headings hierarchical (one `#` per doc) and use relative links for internal references.
- Update the relevant doc in the same PR as any behavior change it describes.

## General Review Guidance
When generating suggestions:
1. Prefer incremental, minimal diffs; preserve existing style and naming.
2. Surface security, correctness, and data integrity issues before micro-optimizations.

3. Encourage type safety (no `any` unless justified). Suggest adding/refining model or DTO types when gaps appear.

4. Flag duplicate logic that belongs in a shared utility or repository method.
5. Ensure error handling uses existing custom error types where appropriate (e.g., NotFound, Validation, Conflict) and propagates consistent HTTP status codes via middleware.
6. Encourage tests: request unit tests for new repository logic and component tests (or at least React Testing Library coverage) for critical UI paths.
7. For performance concerns, highlight N+1 query patterns, unnecessary data loading, or large bundle additions.
8. Prefer environment variable driven configuration; avoid hard‑coded paths/secrets.

## Monorepo Workflow

- Build frequently: `npm run build --workspace=api` or `--workspace=frontend` (root build runs both)

- Keep PRs scoped: code + tests + docs (architecture or build notes) when behavior changes.
- Update related instruction files if new folders or architectural slices are introduced.

## Do Not Repeat
Do not inline full API route or component files in review feedback unless absolutely necessary: quote only the lines requiring change. Summarize low‑impact nits.

## Escalation Order for Suggestions
1. Security / data integrity
2. Logical / functional correctness
3. Performance / scalability
4. Maintainability / duplication
5. Readability / consistency
6. Style / minor formatting

## Tone & Feedback Style
Be concise, actionable, and cite a rationale ("because" clause) for non-trivial recommendations. Offer one preferred solution; optionally a lightweight alternative.

---
If new subsystems are added (e.g., `mobile/`, `worker/`), create a new `*.instructions.md` with `applyTo` globs instead of bloating this file.
