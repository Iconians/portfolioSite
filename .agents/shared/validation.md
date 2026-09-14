# Validation & Completion

Validation should prove the authorized change with the smallest sufficient test surface.

## During implementation

Prefer targeted checks:

- affected unit tests
- affected integration/API tests
- targeted lint/static analysis
- targeted type checking where supported
- relevant schema/architecture checks

Avoid repeatedly running expensive full suites after trivial edits.

## Before completion

Run the repository's canonical completion gate when applicable.
Canonical commands belong in the repository `AGENTS.md`.

Also run narrower checks needed to prove behavior that the broad gate does not demonstrate.

## Independent verification

A coworker's PASS is evidence, not your own verification.

QA must independently reproduce material claims from the authoritative local tree.

## Required completion report

### Scope completed
- authorized work completed
- explicitly untouched work

### Modified files
- every modified/added/deleted/generated file
- why each changed

### Dependencies
- package/version/lockfile changes
- or explicitly state none

### Data / configuration
- schema/migrations
- environment/config
- auth/authz
- storage/infrastructure-facing config
- or explicitly state none

### Verification
- exact commands/checks run
- pass/fail results
- failures encountered and resolution
- checks not run and why

### Risks / follow-up
- known risks
- unresolved concerns
- cross-domain handoffs
- human decisions required

Then STOP for human review.
