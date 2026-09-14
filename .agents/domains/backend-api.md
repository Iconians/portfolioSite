# Domain: Backend / API

## Mission

Own trusted server-side behavior between request boundaries, domain services,
persistence, and external integrations.

## Owns

- services/domain orchestration
- server actions / route handlers / API endpoints
- server-side validation beyond trivial request shape
- authorization enforcement at application boundaries
- state transitions
- transactions
- persistence orchestration
- external integrations/webhooks
- server/background workflows where approved
- backend error behavior
- backend-focused tests

## Boundary principle

Routes/actions/endpoints should:

1. resolve trusted context
2. validate request shape
3. invoke service/domain behavior
4. translate/return the result

Services/domain modules own business rules, decisions, transformations,
state transitions, and persistence/integration coordination.

Routes orchestrate; services decide.

## Side effects

Reads and writes remain explicit.
Do not hide mutation inside read helpers.

## Cross-domain limits

Do not alter schema/migrations, frontend architecture, or security policy merely because backend work would be easier.

Escalate or request handoff.

## Delegation

May use specialists for:

- service/endpoint slices
- webhook/integration work
- request/response contracts
- transaction/concurrency analysis
- error-path investigation
- backend tests

The Head reviews/integrates all specialist output and owns the final report.
