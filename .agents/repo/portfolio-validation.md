# Engineering Portfolio — Validation Contract

This file defines Portfolio-specific completion, QA, and merge validation.

The durable standard is stronger than the repository's temporary current CI state.

## Durable completion standard

Substantial Portfolio changes must not be considered complete until applicable
validation establishes:

- zero new ESLint errors
- zero TypeScript errors
- required automated tests pass
- Prisma/schema validation passes when relevant
- production dependency audit passes where part of the repository gate
- production build succeeds
- task-specific provider/security/media checks pass when applicable

Do not weaken validation to accommodate implementation.

## Canonical target merge gate

The target authoritative Portfolio merge command is:

`npm run ci`

Its durable contract is expected to include:

1. `npm run audit:production`
2. `npm run lint`
3. `npm run typecheck`
4. `npm test`
5. CI database migration deployment when configured
6. Prisma validation
7. production build

GitHub CI should consume the same canonical validation contract rather than maintain
a weaker divergent merge path.

## TEMPORARY REPOSITORY GAP — validation

Until EP-VAL-001 and EP-VAL-002 are implemented and human-accepted:

`npm run ci`

alone is NOT sufficient completion evidence for merge-quality work.

Agents and humans must additionally run:

- `npm run typecheck`
- `npm test`

before claiming substantial implementation complete.

Current GitHub CI green must NOT be described as proof that TypeScript and unit tests
passed unless those checks are visible in the actual CI execution.

This temporary requirement may be removed only after:

1. `npm run ci` includes typecheck and unit tests, and
2. GitHub CI invokes the comprehensive gate, and
3. the user has accepted that remediation.

## Required merge validation

Once remediation is accepted, the authoritative required merge tier is:

`npm run ci`

Do not omit checks from that contract without explicit authorization.

## Unit tests

Portfolio automated tests currently live primarily under:

`tests/unit/`

The merge suite must continue to include Platform consumer/invariant coverage,
including relevant tests for:

- `project-read`
- `project-write`
- `project-source`
- provider selection
- source coherence
- write freeze
- cache policy where covered

Do not remove an existing invariant test merely because a refactor makes it
inconvenient.

## Task-selective validation

Run additional checks when the task touches the relevant concern.

Examples include existing:

- Portfolio media URL audits
- Platform media URL audits
- project-read provider verification
- project-read provider comparison
- Storybook/design-system verification

Use the actual repository scripts that exist at task time.

Do not invent commands.

## Operator / staging validation

Production or live-provider acceptance remains human/operator-controlled.

Phase cutover checklists, live Platform API smoke checks, production-token checks,
production Vercel validation, and similar external verification are NOT implied by
ordinary implementation authorization.

Do not execute them unless explicitly authorized.

## Deferred test tiers

The following are not currently required merely because another DevLaunch repository
uses them:

- Playwright/E2E
- CRM-style RLS integration matrix
- fixture-backed CRM-style acceptance harness
- live Platform API calls in default CI

Adding one requires separate evidence and authorization.

## Husky / pre-commit

Local pre-commit validation may remain a fast subset.

Passing pre-commit does not replace the authoritative merge gate.

Never bypass failing pre-commit checks merely to create a commit.

Fix the underlying implementation.

## Provider/source invariant

Validation must preserve the intentional CI configuration:

`PROJECT_READ_SOURCE=database`

`PROJECT_WRITE_SOURCE=platform-api`

unless a separately authorized architecture decision changes it.

Do not reinterpret this intentional mixed-source state as a configuration defect.

## QA independence

QA must independently verify material claims.

A Backend, Frontend, Data, or Architecture PASS is useful evidence but is not QA's
verdict.

QA may use coworker reports to identify test targets, but must reproduce the material
checks it relies upon.

## SKIPPED is not PASS

A validation path that was not executed must be reported as not run.

Do not describe skipped, unavailable, blocked, or unauthorized validation as passing.

## Completion reporting

Report:

- commands run
- tests/checks passed
- failures encountered
- checks not run
- why any applicable check was omitted
- known risks
- unresolved issues
