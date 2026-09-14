# Stack: FastAPI / Python

## Architecture

Preferred flow:

Route → Service → Repository / Integration → Database / External Service

- routes orchestrate
- services decide
- repositories persist
- schemas define contracts
- integrations isolate external systems

Do not reverse dependencies or introduce circular cross-layer ownership.

## FastAPI routes

Routes may:

- receive request input
- use dependencies
- resolve auth context
- rely on Pydantic request-shape validation
- call services
- translate known results/errors to HTTP
- return response schemas

Routes must not contain:

- substantial business logic
- SQL
- persistence orchestration
- external-storage implementation details
- large workflow ladders
- hidden mutations

## Services

Services own:

- business/domain decisions
- non-trivial validation
- authorization decisions beyond identity extraction
- transformations
- mutation workflows
- transaction/repository/integration coordination
- state transitions

Business logic should be testable without FastAPI.

Avoid meaningless service wrappers.

## Repositories

Repositories express domain-specific persistence intent.
Do not build generic repositories that merely proxy ORM methods.

Repositories must not own HTTP concerns, API response shaping, FastAPI dependencies,
or business authorization policy.

## Pydantic

Use distinct schemas where responsibilities differ:

- create/update input
- public response
- administrative response
- nested response
- internal value object

Do not expose ORM entities directly as API contracts.

## Python quality

- strong types
- no `Any`/type-ignore escape hatches without real boundary justification
- domain-intent naming
- small cohesive functions/modules
- no broad swallowed exceptions
- explicit side effects
- deterministic behavior where practical

Naming:

- modules/functions/variables: `snake_case`
- classes/Pydantic models: `PascalCase`
- constants: `UPPER_SNAKE_CASE`

Avoid vague catch-all names such as `utils.py`, `helpers.py`, `manager.py` when domain ownership can be named.

## Configuration/secrets

Centralize settings.
Do not scatter env reads.

Never hardcode/log/return credentials, DB URLs, service tokens, or storage secrets.

Keep local/dev/staging/prod isolated.

## Testing

Prefer:

- `tests/unit/<domain>/`
- `tests/integration/<domain>/`
- `tests/api/<domain>/`

Unit-test domain behavior without FastAPI where practical.
Integration-test real persistence boundaries in isolated environments.
API-test status, schemas, auth/authz, validation, pagination, error sanitization, and mutations.

Mock external boundaries in unit tests; do not mock the behavior under integration test.

## Maintainability

Priority:

1. correctness
2. security
3. maintainability
4. clarity
5. simplicity
6. consistency
7. measured/necessary performance

Avoid speculative enterprise patterns and unnecessary infrastructure.
