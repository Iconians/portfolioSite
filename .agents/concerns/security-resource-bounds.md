# Concern: Security & Resource Bounds

Load for auth/authz, CORS, rate limits, uploads, pagination, or externally controlled input.

- authentication establishes identity
- authorization determines allowed actions
- trusted authorization remains server-side
- frontend visibility/query parameters are not security boundaries
- credentials stay server-side and narrowly scoped
- externally controlled resources must be bounded
- validate lengths, ranges, enums, URLs/slugs, nested collection sizes, result counts, upload sizes, and timeouts
- list endpoints use safe defaults/max page sizes/deterministic ordering
- rate limits should reflect endpoint cost/sensitivity and return 429 when appropriate
- CORS is explicit and no more permissive than required
