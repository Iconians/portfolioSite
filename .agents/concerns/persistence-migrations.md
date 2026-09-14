# Concern: Persistence & Migrations

Load for schema/model/repository/migration/reconciliation work.

- keep queries bounded
- use explicit constraints/indexes based on real access patterns
- make transaction ownership clear
- avoid N+1 behavior
- migration creation/execution remain separately authorized
- confirm exact environment before execution
- prefer backward-compatible evolution
- separate introduction from destructive removal
- validate/reconcile migrated data
- "no exception" is not sufficient migration proof
- preserve rollback/recovery until acceptance
