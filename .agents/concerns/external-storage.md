# Concern: External Object Storage

Load for object storage/media upload/delivery behavior.

- object bytes belong in object storage, not the relational DB
- DB stores validated metadata/object references
- storage credentials never reach browsers
- signed upload flows are constrained and short-lived
- validate MIME/type/size/object-key rules server-side
- never trust client-generated paths/keys/authorization context
- prevent path traversal/arbitrary bucket writes
- define overwrite behavior
- direct CDN/object delivery is preferred when appropriate
- DB/storage non-transactionality requires explicit recovery/reconciliation behavior
