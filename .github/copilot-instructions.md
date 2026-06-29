# OctoCAT Supply Chain Management Application – General Copilot Instructions

These are repository-wide guidelines. Path‑scoped files in `.github/instructions/*.instructions.md` provide focused guidance for specific areas (frontend, API, database).

## High-Level Architecture

TypeScript monorepo with:
- `api/` Express REST API (SQLite persistence, repository pattern, Swagger docs)

- `frontend/` React + Vite + Tailwind UI
- Shared demo + infra docs under `docs/` and deployment scripts under `infra/`

Refer to `docs/architecture.md` and `docs/sqlite-integration.md` for deeper details. Avoid restating them in reviews and link instead.

## Language Coverage In This Repository

The repository currently includes code and automation across these languages/formats:
- TypeScript (`.ts`, `.tsx`) for API, frontend, tests, and build tooling.
- JavaScript / Node ESM-CJS config (`.js`, `.mjs`) for ESLint/PostCSS/Tailwind/Vite-related config.
- SQL (`.sql`) for SQLite migrations and seed data.
- Shell scripting (`.sh`) for demo and hook automation.
- YAML (`.yml`) for Docker Compose, Dependabot, GitHub Actions workflows, and prompts.
- Bicep (`.bicep`) for Azure container app infrastructure.
- HTML/CSS (`.html`, `.css`) for frontend host page and global styling.
- Make (`Makefile`) for cross-stack developer workflows.
- Markdown (`.md`) for docs, walkthroughs, prompts, and instruction files.
- JSON (`.json`) for package/tool configuration and API Swagger artifacts.

Use the best-practices sections below whenever generating, reviewing, or modifying files in these languages.

## TypeScript Best Practices (API + Frontend)

These build on the strict-mode guidance in the W3Schools TypeScript best-practices reference and are adapted to this repo.

1. Keep strict typing enabled and intact.
2. Avoid `any`; use `unknown`, generics, discriminated unions, and explicit DTO/model interfaces.
3. Use type inference when obvious, but keep explicit types on public APIs and function parameters.
4. Prefer `interface` for extendable object contracts and `type` for unions/tuples/mapped utilities.
5. Use safe narrowing with type guards (`typeof`, `instanceof`, `in`, custom predicates).
6. Handle nullable values intentionally (`?.`, `??`, explicit checks).
7. Use type-only imports/exports when no runtime value is needed.
8. Keep modules cohesive and small: route handler -> repository/service -> shared util.
9. For async work, flatten control flow, use `Promise.all` for independent I/O, and preserve error context.
10. Favor pure functions and dependency injection where testability matters.

### TypeScript API Conventions (`api/src/**`)

1. Keep route files thin: parse/validate input, call repository methods, return response.
2. Use parameterized SQL only; never concatenate user input into SQL strings.
3. Use existing custom error types and middleware flow for status-code consistency.
4. Preserve naming conventions: camelCase in TS models, snake_case in SQL columns with reliable mapping.
5. Add/maintain Swagger route docs when adding or changing behavior.
6. For multi-step writes touching multiple entities, use transactions.
7. Avoid N+1 query patterns; prefer JOIN + post-processing.

### TypeScript Frontend Conventions (`frontend/src/**`)

1. Keep components focused and composable; split data logic from presentational rendering.
2. Maintain accessible semantics first (labels, keyboard support, focus visibility).
3. Keep API contracts typed end-to-end; avoid `unknown as ...` unless strongly justified.
4. Use explicit loading, empty, and error states for async UI.
5. Avoid avoidable re-render hotspots in list-heavy views.

## JavaScript / MJS Best Practices (`*.js`, `*.mjs`)

1. Treat config scripts as production code: small, deterministic, and side-effect aware.
2. Prefer explicit exports and consistent module system per file (`type: module` vs CJS scope).
3. Centralize duplicated config values instead of copy/pasting across tooling files.
4. Keep lint configuration strict enough to prevent drift from TypeScript standards.

## SQL Best Practices (`api/database/**`)

1. Migrations are immutable: add new sequential migration files; never rewrite old ones.
2. Use explicit constraints for data integrity: `NOT NULL`, `CHECK`, foreign keys, and indexed FK columns.
3. Ensure seed files remain deterministic and reference-safe.
4. For schema changes, update seeds when required columns are introduced.
5. Prefer additive, low-risk schema changes over destructive rebuilds.
6. Validate query performance for endpoints with heavy filtering/sorting.

## Shell Script Best Practices (`*.sh`)

1. Write scripts to be idempotent where possible.
2. Quote variables and paths defensively.
3. Fail fast on command errors and surface actionable messages.
4. Keep scripts non-interactive unless interaction is explicitly required.
5. Avoid embedding secrets; read from environment variables.

## YAML Best Practices (`*.yml`)

1. Keep workflow and Compose YAML declarative, readable, and minimally duplicated.
2. Pin or tightly constrain action/tool versions where stability/security matters.
3. Keep environment variables explicit and avoid hidden implicit defaults.
4. For CI workflows, separate build/test/deploy responsibilities cleanly.
5. Avoid overly broad permissions in GitHub Actions.

## Bicep Best Practices (`infra/*.bicep`)

1. Parameterize environment-specific values; avoid hard-coded deployment specifics.
2. Mark sensitive data with `@secure()` and pass secrets via secure channels.
3. Prefer clear resource naming and consistent tags for traceability.
4. Keep modules focused and outputs meaningful for downstream automation.
5. Use explicit API versions and review regularly for upgrade opportunities.

## HTML/CSS Best Practices (`frontend/index.html`, `frontend/src/index.css`)

1. Preserve semantic HTML structure and accessibility basics.
2. Keep global CSS minimal; prefer Tailwind utilities and component-level consistency.
3. Avoid fragile selector coupling and unnecessary specificity escalation.
4. Ensure responsive behavior at core breakpoints before merging UI changes.
5. Prevent layout shifts and visual regressions with predictable sizing.

## Makefile Best Practices (`Makefile`)

1. Keep targets composable, descriptive, and side-effect predictable.
2. Preserve backend autodetection behavior and cross-language compatibility logic.
3. Ensure help text remains accurate when adding/changing targets.
4. Do not duplicate command sequences that should be shared via existing targets.

## JSON Best Practices (`*.json`)

1. Keep JSON machine-friendly and schema-consistent.
2. Maintain stable key naming and avoid noisy reordering.
3. For Swagger artifacts, ensure route/model updates remain synchronized with code.
4. Never store secrets in tracked JSON files.

## Markdown Best Practices (`*.md`)

1. Keep documentation actionable, current, and linked to source-of-truth files.
2. Prefer concise sections with examples over long narrative blocks.
3. Update docs alongside behavioral changes in API/frontend/build workflows.
4. Use consistent headings and terminology across walkthroughs and instructions.

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
