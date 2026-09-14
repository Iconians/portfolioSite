---
name: Engineering Portfolio Validation & Governance Remediation
overview: "Authoritative remediation plan to align Engineering Portfolio validation and agent governance with the stronger DevLaunch standard. EP-GOV-001/002 governance pack + modular rules router are ACCEPTED / CLOSED (human 2026-09-14). EP-VAL-001/002 CI expansion and EP-QA tasks remain unimplemented. Temporary validation gap language in portfolio-validation.md must remain until VAL remediation is accepted."
todos:
  - id: ep-gov-001
    content: "EP-GOV-001: Portfolio .agents/repo pack — ACCEPTED / CLOSED (human 2026-09-14)"
    status: completed
  - id: ep-gov-002
    content: "EP-GOV-002: Modular Cursor rules.mdc router — ACCEPTED / CLOSED (human 2026-09-14)"
    status: completed
  - id: ep-qa-001
    content: "EP-QA-001: Freeze Portfolio validation matrix (merge vs selective vs operator) — NOT AUTHORIZED"
    status: pending
  - id: ep-qa-002
    content: "EP-QA-002: Confirm consumer invariant unit suites remain in merge gate — NOT AUTHORIZED"
    status: pending
  - id: ep-val-001
    content: "EP-VAL-001: Expand npm run ci to include typecheck + unit tests — NOT IMPLEMENTED / NOT AUTHORIZED"
    status: pending
  - id: ep-val-002
    content: "EP-VAL-002: Align GitHub CI to same ci contract — NOT IMPLEMENTED / NOT AUTHORIZED"
    status: pending
  - id: ep-val-003
    content: "EP-VAL-003: Remove TEMPORARY validation notes after VAL-001/002 accepted — BLOCKED"
    status: pending
isProject: false
---

# Engineering Portfolio — Validation & Governance Gap Remediation Plan

**Status:** Approved for persistence 2026-09-14 (human). Planning SoT for this remediation program.  
**Human acceptance recorded:** EP-GOV-001 and EP-GOV-002 **ACCEPTED / CLOSED** 2026-09-14.

**Authorization scope of this file:** Plan status updates for accepted GOV only. Does **not** authorize implementation of QA, Backend/API, Architecture/Security remediation tasks, CI/package changes, tests, source, deps, migrations, Git, deploy, or production.

**Repo:** `engineering-portfolio`  
**Evidence baseline:** Engineering Portfolio governance audit (Planner) + plan approval message 2026-09-14.

---

## Reconciliation note (2026-09-14)

After the original plan draft, the human created modular Portfolio governance on disk and replaced legacy Cursor rules. Read-only verification for this persistence task found:

| Artifact | Verified present |
|----------|------------------|
| `AGENTS.md` Operating Contract + modular load order | Yes |
| `.agents/shared/`, `domains/`, `stacks/`, `concerns/`, `runtimes/` | Yes |
| `.agents/repo/portfolio-repository-layout.md` | Yes |
| `.agents/repo/portfolio-access-data.md` | Yes |
| `.agents/repo/portfolio-platform-consumer.md` | Yes |
| `.agents/repo/portfolio-validation.md` | Yes (includes **TEMPORARY REPOSITORY GAP — validation**) |
| `.agents/repo/portfolio-design-system.md` | Yes |
| `.cursor/rules.mdc` modular Cursor governance router | Yes (no CRM-shaped RLS/token/runtime-role mandates observed) |

**Therefore (updated 2026-09-14):**
- **EP-GOV-001** = **ACCEPTED / CLOSED** (human acceptance 2026-09-14).
- **EP-GOV-002** = **ACCEPTED / CLOSED** (human acceptance 2026-09-14).

**Still true / unchanged:**
- `npm run ci` = `audit:production && lint && db:migrate:deploy && prisma validate && build` — **does not** include typecheck or unit tests.
- GitHub `.github/workflows/ci.yml` mirrors that weaker path.
- Husky pre-commit still runs `typecheck` + `lint` + `test`.
- **EP-VAL-001 / EP-VAL-002 are not implemented** merely because governance describes the target.
- Temporary validation compatibility language in `portfolio-validation.md` **must remain** until VAL remediation is implemented and accepted.
- Do **not** remove that temporary language as part of plan persistence.

---

## Current-state gaps

1. **Split validation contract:** Husky pre-commit runs `typecheck` + `lint` + `test`, but **`npm run ci` and GitHub CI omit typecheck and unit tests**.
2. **Merge evidence weaker than local pre-commit:** GitHub CI green does not prove typecheck/unit passed.
3. **Governance pack now on disk** (reconciled): modular `.agents/` + router `rules.mdc` exist; GOV tasks implemented pending acceptance — **not** a remaining authoring gap.
4. **Risk if agents treat current CI as sufficient:** Would permanently weaken the standard; temporary gap language exists to prevent that.
5. **Test tier clarity:** Strong unit coverage for Platform consumer (`tests/unit/project-read|project-write|project-source`). No E2E suite; no CRM-style integration/acceptance harness — and none required for this remediation.

**Preserve (not gaps):**
- `audit:production` in CI
- Prisma validate + migrate deploy in CI
- Production build in CI
- Intentional CI env: `PROJECT_READ_SOURCE=database` + `PROJECT_WRITE_SOURCE=platform-api`
- Existing consumer/coherence/write-freeze unit tests
- Local ownership of Articles/Reviews/auth/local media vs Platform shared content

---

## Desired target state

### Canonical validation

`npm run ci` becomes the **authoritative comprehensive local/merge command**, providing deterministic evidence for:

| Check | Target |
|-------|--------|
| Production dependency audit | `npm run audit:production` (keep) |
| Lint | `npm run lint` (keep) |
| TypeScript | `npm run typecheck` (**add**) |
| Unit tests | `npm test` / `bun test` (**add**) |
| Prisma migrate deploy (CI DB) | keep where `DATABASE_URL` available |
| Prisma validate | keep |
| Production build | `npm run build` (keep) |

GitHub CI consumes **that same contract** (prefer invoking `npm run ci` / `ci:github` after `npm ci`) rather than a permanently divergent weaker step list.

Husky may remain a fast subset (`typecheck` + `lint` + `test`); it must not be the only place those checks live.

### Portfolio test tiers

| Tier | Role | Portfolio target |
|------|------|------------------|
| **Required merge** | `npm run ci` | audit + lint + typecheck + unit + prisma migrate/validate + build |
| **Task-selective** | When touched | media URL audits; provider compare/verify scripts; Storybook as needed |
| **Operator/staging** | Human cutover | Phase-10/11 readiness checklists; live Platform URL/token smoke — **not** default CI |
| **Deferred** | Explicitly out | Playwright/E2E; CRM-style DB RLS integration matrix; fixture acceptance harness |

### Platform consumer invariants (must remain protected)

- Shared public reads → `project-read` provider boundary
- Shared writes → `project-write` / Platform admin client; **never** restore Prisma shared-content writes
- `PROJECT_WRITE_SOURCE=platform-api` (M17 freeze)
- CI `PROJECT_READ_SOURCE=database` / `PROJECT_WRITE_SOURCE=platform-api` remains valid unless new evidence requires change
- Platform API token server-only
- Local Portfolio content ownership stays separate from Platform-owned shared content

### Governance target structure (confirmed on disk)

```
.agents/repo/
├── portfolio-repository-layout.md
├── portfolio-access-data.md
├── portfolio-platform-consumer.md
├── portfolio-validation.md
└── portfolio-design-system.md
```

No structural change recommended vs audit. Governance describes the **strong durable contract**; temporary gaps remain called out until VAL remediation lands.

---

## Task register

### Architecture / Security

#### EP-GOV-001 — Author Portfolio `.agents/repo/*` target contracts

| Field | Value |
|-------|--------|
| **Status** | **ACCEPTED / CLOSED** (human 2026-09-14) |
| **Owner** | Architecture / Security |
| **Files** | `.agents/repo/portfolio-repository-layout.md`, `portfolio-access-data.md`, `portfolio-platform-consumer.md`, `portfolio-validation.md`, `portfolio-design-system.md` (+ `AGENTS.md` operating contract) |
| **Reason** | Durable Portfolio-specific contracts without copying reusable shared/domain/stack/concern text |
| **Depends on** | — |
| **Validation** | Pack present; cites Portfolio evidence; `portfolio-validation.md` retains TEMPORARY gap until VAL accepted |
| **STOP** | Closed — human accepted 2026-09-14 |

#### EP-GOV-002 — Retire CRM-shaped always-on `.cursor/rules.mdc`

| Field | Value |
|-------|--------|
| **Status** | **ACCEPTED / CLOSED** (human 2026-09-14) |
| **Owner** | Architecture / Security |
| **Files** | `.cursor/rules.mdc` (now modular Cursor governance router) |
| **Reason** | Prior always-on rules imposed CRM RLS/token/runtime-role myths Portfolio does not implement |
| **Depends on** | EP-GOV-001 pack present |
| **Validation** | Router points at `AGENTS.md` / `.agents/`; no CRM-shaped Portfolio RLS/token mandates observed in current `rules.mdc` |
| **STOP** | Closed — human accepted 2026-09-14 |

---

### QA / Testing

#### EP-QA-001 — Freeze Portfolio validation matrix

| Field | Value |
|-------|--------|
| **Status** | **NOT AUTHORIZED** / pending |
| **Owner** | QA / Testing |
| **Files** | Content alignment with `portfolio-validation.md` (no new framework) |
| **Reason** | Single authoritative merge vs selective vs operator matrix |
| **Depends on** | — |
| **Validation** | Matrix matches existing scripts; does not invent E2E/integration tiers |
| **STOP** | Human sign-off before script/CI changes |

#### EP-QA-002 — Confirm consumer invariant coverage under merge gate

| Field | Value |
|-------|--------|
| **Status** | **NOT AUTHORIZED** / pending |
| **Owner** | QA / Testing |
| **Files** | None required if existing unit suites stay in `npm test` |
| **Reason** | Write-freeze, provider selection, coherence, cache-policy regressions stay in merge unit suite |
| **Depends on** | EP-QA-001; EP-VAL-001 (once `ci` includes tests) |
| **Validation** | `npm test` executes those suites |
| **STOP** | QA confirms no additional required merge suites beyond unit for this remediation |

---

### Backend / API (tooling / scripts / CI)

#### EP-VAL-001 — Expand `npm run ci` to the target comprehensive gate

| Field | Value |
|-------|--------|
| **Status** | **NOT IMPLEMENTED** / **NOT AUTHORIZED** |
| **Owner** | Backend / API (package/script ownership) with QA review |
| **Files** | `package.json` (`ci`; keep/adjust `ci:github` env wrapper) |
| **Reason** | Close husky vs merge gap; make `ci` the one comprehensive contract |
| **Change intent** | Insert `npm run typecheck` and `npm test` into `ci` while preserving `audit:production`, `lint`, `db:migrate:deploy`, `prisma validate`, `build` |
| **Suggested order** | `audit:production` → `lint` → `typecheck` → `test` → `db:migrate:deploy` → `prisma validate` → `build` |
| **Depends on** | EP-QA-001 |
| **Validation** | Local `npm run ci` (CI-like env) green |
| **STOP** | Human acceptance that `ci` is authoritative |

**Governance describing this target does not count as implementation.**

#### EP-VAL-002 — Align GitHub CI to the same `ci` contract

| Field | Value |
|-------|--------|
| **Status** | **NOT IMPLEMENTED** / **NOT AUTHORIZED** |
| **Owner** | Backend / API (workflow) with QA review |
| **Files** | `.github/workflows/ci.yml` |
| **Reason** | Eliminate weaker divergent merge path |
| **Change intent** | After `npm ci`, invoke `npm run ci` or `npm run ci:github`; keep Postgres + env `PROJECT_READ_SOURCE=database`, `PROJECT_WRITE_SOURCE=platform-api` |
| **Depends on** | EP-VAL-001 |
| **Validation** | PR CI green; typecheck + unit in logs; write-freeze env unchanged |
| **STOP** | Human merge of workflow change |

#### EP-VAL-003 — Remove temporary validation gap language after remediation

| Field | Value |
|-------|--------|
| **Status** | **BLOCKED** until EP-VAL-001 + EP-VAL-002 accepted |
| **Owner** | Architecture / Security |
| **Files** | `.agents/repo/portfolio-validation.md` |
| **Reason** | Remove TEMPORARY block only when remediation is real |
| **Depends on** | EP-VAL-001 + EP-VAL-002 accepted |
| **Validation** | Temporary block deleted; strong target contract remains |
| **STOP** | Arch confirms temporary notes gone |

**Do not remove temporary language now.**

---

## Dependency / order map

```
EP-QA-001 (validation matrix)          [NOT AUTHORIZED]
    ├── EP-GOV-001 [ACCEPTED / CLOSED 2026-09-14]
    │       └── EP-GOV-002 [ACCEPTED / CLOSED 2026-09-14]
    └── EP-VAL-001 (expand npm run ci) [NOT AUTHORIZED]
            └── EP-VAL-002 (GitHub CI) [NOT AUTHORIZED]
                    ├── EP-QA-002 [NOT AUTHORIZED]
                    └── EP-VAL-003 (remove TEMPORARY notes) [BLOCKED]
```

---

## Program acceptance criteria

1. `npm run ci` locally (with CI env) runs audit + lint + **typecheck** + **unit tests** + migrate deploy + prisma validate + build.
2. GitHub `ci.yml` fails if typecheck or unit tests fail.
3. CI retains `PROJECT_READ_SOURCE=database` and `PROJECT_WRITE_SOURCE=platform-api` unless a separate evidenced decision changes it.
4. Portfolio `.agents/repo/*` describe the strong target; no CRM RLS/token requirements — **EP-GOV-001 ACCEPTED / CLOSED**.
5. `.cursor/rules.mdc` is modular router and does not impose non-Portfolio security model — **EP-GOV-002 ACCEPTED / CLOSED**.
6. No Playwright/E2E, no new dependencies, no Platform/Vercel/R2/Neon production changes in this program.
7. TEMPORARY validation notes removed only after (1)–(2) accepted (EP-VAL-003).

---

## Temporary governance statements

### Still required (validation) — keep in `portfolio-validation.md`

> **TEMPORARY REPOSITORY GAP — validation:** Until EP-VAL-001 and EP-VAL-002 are accepted, `npm run ci` alone is **insufficient** completion evidence for merge-quality work. Agents/humans must also run `npm run typecheck` and `npm test` (already required by Husky pre-commit). Do not treat GitHub CI green as proof that typecheck/unit passed.

**Removal condition:** EP-VAL-001 + EP-VAL-002 accepted and observed in CI logs.

### GOV (rules.mdc CRM myths) — closed

EP-GOV-002 is **ACCEPTED / CLOSED**. Agents follow modular `AGENTS.md` + `.agents/` + router `rules.mdc`. Pre-router CRM-myth ignore language is obsolete.

**Do not** treat GOV acceptance as license to remove the **validation** temporary gap (still required until EP-VAL-001/002).

---

## Deferred / nonessential (explicitly excluded)

- Adding Playwright/E2E because CRM has it
- New integration-test harness / RLS matrix
- Changing Platform API, Neon production, Vercel, R2, migration *content*
- Expanding CI to live Platform contract calls (operator/staging only)
- Admin redesign, DS deferred roadmap items, Phase 20 refactors
- Forcing `PROJECT_READ_SOURCE=platform-api` in CI
- Unrelated dependency upgrades
- Duplicating reusable `.agents/shared|domains|stacks|concerns|runtimes` into Portfolio

---

## Invariants this plan must not drop

- Intentional CI: `PROJECT_READ_SOURCE=database` / `PROJECT_WRITE_SOURCE=platform-api`
- Shared reads through `project-read`
- Shared writes through `project-write` / Platform admin client
- M17 legacy shared-content Prisma write freeze
- Server-only Platform token
- Separation of Portfolio-local content from Platform-owned shared content

---

## Implementation authorization

Persisting this plan does **not** authorize EP-QA-001, EP-QA-002, EP-VAL-001, EP-VAL-002, EP-VAL-003, or any follow-on task.

Coworker coordination remains informational only. Advancement requires explicit human implementation authorization per task/department.

---

*End of authoritative plan — STOP after persistence report.*
