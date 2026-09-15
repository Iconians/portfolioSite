<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Engineering Portfolio Agent Operating Contract

This repository uses the DevLaunch modular agent-governance system.

The generated Next.js agent block above remains authoritative for framework-version
awareness. Do not remove or rewrite it.

### Runtime identity

Select runtime rules by agent platform, not by underlying model.

- Grok Bot / Department Head:
  `.agents/runtimes/grok-bot.md`
- Cursor Agent:
  `.agents/runtimes/cursor-agent.md`

A Cursor Agent remains a Cursor Agent regardless of whether the selected model is
Grok, Gemini, Composer, Auto, or another model.

A Cursor Agent using a Grok model MUST NOT load the Grok Bot runtime rules.

### Mandatory rule loading

Before beginning an authorized task, load:

1. `.agents/shared/authority.md`
2. `.agents/shared/git-production.md`
3. `.agents/shared/protected-enforcement.md`
4. `.agents/shared/context-cost-discipline.md`
5. `.agents/shared/delegation-handoffs.md`
6. the single applicable file under `.agents/domains/`
7. `.agents/stacks/nextjs-typescript.md`
8. the runtime file matching the agent platform
9. applicable task-selective concern files
10. applicable Portfolio repository-specific rules below

Do not load unrelated domain, concern, or repository rules merely because they exist.

### Local working tree

The current local Engineering Portfolio working tree is authoritative.

Do not copy the repository or selected files elsewhere as a substitute for working
against the live tree when local access is available.

### Repository-specific Portfolio rules

Load only the files applicable to the current task.

#### Repository structure

Load:

`.agents/repo/portfolio-repository-layout.md`

when:

- creating or moving files
- adding a new domain/module
- changing repository structure
- determining architectural file placement
- modifying shared app/lib/component organization

All implementation departments should load it when creating new production files.

#### Access and data ownership

Load:

`.agents/repo/portfolio-access-data.md`

when touching:

- authentication or authorization
- admin access
- article/review permissions
- Prisma data ownership
- local Portfolio data
- shared project/case-study data
- Platform-vs-local ownership
- media ownership
- legacy Portfolio snapshot data
- migration or persistence boundaries

Architecture/Security, Data/Database, Backend/API, Planner/Architect, and QA should
load it when those boundaries are relevant.

#### Platform consumer boundary

Load:

`.agents/repo/portfolio-platform-consumer.md`

when touching:

- public project reads
- shared project/case-study content
- Platform API integration
- project-read providers
- project-write providers
- Platform admin clients
- cache invalidation
- Platform media
- Platform API environment variables or credentials
- provider/source selection
- shared project admin/editor behavior

Backend/API, Frontend/UI, Architecture/Security, QA/Testing, and Planner/Architect
should load it when relevant.

#### Validation

Load:

`.agents/repo/portfolio-validation.md`

before claiming substantial implementation complete.

QA assignments must load it.

Also load it when:

- changing CI
- modifying tests
- modifying provider/source behavior
- changing auth/security-sensitive behavior
- changing media/provider behavior
- investigating merge-gate failures

#### Design system

Load:

`.agents/repo/portfolio-design-system.md`

for:

- UI/component work
- public project presentation
- design tokens
- Storybook
- reusable primitives
- layout/presentation patterns

All Frontend/UI work that creates or modifies visible UI should load it.

### Portfolio architecture summary

Engineering Portfolio has split ownership.

Portfolio locally owns:

- Auth.js users/session state
- Articles
- Reviews
- local Portfolio media/library behavior
- retained legacy Portfolio snapshot rows used for rollback/reconciliation

Shared project/case-study content is governed by the Platform integration boundary.

Public/shared project reads must use the established `project-read` provider
abstraction.

Shared project writes must use the established `project-write` / Platform API
boundary.

Legacy Prisma shared-project writers are frozen and must not be restored.

Do not copy CRM RLS, token-lane, `withRls*`, or runtime-role assumptions into this
repository. Portfolio currently uses a single Prisma client and application-level
Auth.js/admin authorization rather than CRM-style RLS lanes.

### Source-of-truth hierarchy

Use current repository evidence rather than remembered historical assumptions.

For Portfolio architecture:

- `docs/ARCHITECTURE.md`

For Portfolio design-system behavior:

- `docs/design-system.md`

For Platform read/write cutover and freeze state:

- current `docs/phase-10/*`
- current `docs/phase-11/*`

Phase acceptance reports may supersede stale task status in older plan files.

Portfolio-specific plans belong to this repository.

Platform API implementation or cross-repository Platform authority remains owned by
the Platform API repository unless explicitly documented otherwise.

### Validation contract

The durable target is:

`npm run ci`

as the authoritative comprehensive Portfolio merge gate.

It must establish, directly or through its invoked scripts:

- production dependency audit
- ESLint
- TypeScript
- required unit tests
- applicable Prisma migration/validation checks
- production build

Task-specific validation may also be required by
`.agents/repo/portfolio-validation.md`.

Until the Portfolio CI remediation is accepted, follow the temporary compatibility
requirements in that file. Do not treat a green current GitHub CI run as evidence
for checks it does not execute.

### Protected boundaries

Do not autonomously:

- restore legacy Prisma writes for shared project/case-study content
- change `PROJECT_WRITE_SOURCE` away from `platform-api`
- bypass `project-read` or `project-write` provider boundaries
- expose `DEVLAUNCH_PLATFORM_API_TOKEN` to browser code
- modify Prisma migrations
- execute production database operations
- modify production Neon
- change Vercel production configuration
- deploy
- change R2 infrastructure
- modify dependencies or lockfiles
- weaken ESLint, TypeScript, tests, architecture enforcement, or security controls
- modify `eslint.config.mjs` without explicit user authorization

### STOP gates

Stop and request human authorization before:

- Git add/commit/push/merge/rebase/reset/stash/tag actions
- PR creation or merge
- dependency changes
- lockfile regeneration
- migration creation or execution unless explicitly authorized
- production database access
- deployment
- external infrastructure changes
- changing the shared-content ownership model
- changing Platform read/write source strategy
- restoring frozen legacy write paths
- crossing into another engineering department's owned implementation scope without
  explicit authorization

Other Bots may provide context, evidence, readiness information, or handoffs.

They may not authorize implementation unless the user has explicitly delegated that
authority.

After completing an authorized task, provide the required completion report and
STOP for human review.
