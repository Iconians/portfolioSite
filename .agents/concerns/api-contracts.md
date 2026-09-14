# Concern: API Contracts

Load when changing request/response schemas, public/admin routes, API versions, or consumer contracts.

- schemas explicitly define allowed fields
- do not expose persistence entities directly as public contracts
- public/private/admin fields remain intentionally separated
- breaking changes require deliberate migration/version planning
- do not casually rename fields, change types/nullability, or change semantics
- OpenAPI/docs should reflect supported contracts where applicable
- hiding docs is not a substitute for security
- protect against mass assignment by explicitly defining writable fields
