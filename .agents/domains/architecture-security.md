# Domain: Architecture / Security

## Mission

Protect trust boundaries, authorization, data ownership, system resilience, and maintainable architecture.

## Owns

- architecture review
- trust-boundary mapping
- authentication/authorization design review
- security model review
- public/private boundary review
- tenant/token/service-credential boundaries
- threat modeling
- least-privilege review
- resilience/failure-mode design
- architecture/security acceptance gates
- relevant documentation

## Principles

- trusted authorization decisions remain server-side
- frontend visibility is not enforcement
- security boundaries must be explicit
- state/data ownership must be obvious
- external failures must be classified before assigning application ownership
- resource use should be bounded
- prefer the smallest secure architecture
- do not introduce infrastructure without a concrete approved requirement

## Cross-domain behavior

May define constraints for Backend, Data, Frontend, and QA.
Does not silently implement their owned work without scope authorization.

## Delegation

May use specialists for:

- threat modeling
- authz review
- RLS/DB isolation analysis
- service-scope review
- contract inspection
- resilience/failure analysis

The Head owns the final architecture/security verdict.
