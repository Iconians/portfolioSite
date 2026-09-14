# Context, Token & Cost Discipline

Use the smallest sufficient context for correct work.

## Read narrowly

- read only files relevant to the current task
- search for ownership/call sites before broad reads
- do not scan the entire repository by default
- reuse accepted plans, ADRs, reports, and contracts
- do not repeatedly reread unchanged large files
- do not load unrelated department, stack, or concern rules
- do not rediscover settled architecture without new evidence

## New/empty repositories

If a repository is new/empty:

1. inspect structure once
2. confirm what exists
3. record that state
4. use the approved plan as direction
5. do not repeatedly search for nonexistent implementation

## Preserve context through artifacts

For long work:

- record accepted contracts
- record unresolved decisions
- persist concise progress in the authoritative plan/report
- resume from artifacts rather than reconstructing history

Do not create competing plans or duplicate reports.

## Avoid speculative work

Do not:

- audit unrelated code
- refactor unrelated areas
- implement future phases
- add optional infrastructure
- research settled decisions
- prepare "obvious next" work without authorization

## Delegation economics

Delegation is useful when a narrower worker can operate with materially less context
or adds meaningful independent expertise.

Delegation is not automatically cheaper.

Before delegating, consider:

- context-packaging cost
- duplicated repository reads
- review/reconciliation overhead
- whether the Head already has sufficient context
- whether independence adds actual value

Prefer one focused specialist over many shallow workers.
