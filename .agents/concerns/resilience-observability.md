# Concern: Resilience & Observability

Load when changing external calls, caching, retries, health checks, logging, or failure behavior.

Plan for:

- dependency timeout
- database timeout
- external-provider failure
- malformed dependency response
- deployment/cache failure

Use bounded timeouts and bounded retries only where safe.

Unsafe mutations must not be automatically retried unless idempotency/duplicate protection is guaranteed.

Caching must be intentional; sensitive/admin data must not leak into public caches.

Observability should provide safe diagnostic context without exposing secrets.

Never log credentials, auth headers, service tokens, passwords, signed secrets, or unnecessary sensitive request bodies.

Health endpoints should reveal minimal information.
