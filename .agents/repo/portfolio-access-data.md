# Engineering Portfolio — Access & Data Ownership

These rules define Portfolio-specific authentication, authorization, persistence,
and ownership boundaries.

Load this file only when the current task touches these areas.

## Authentication

Engineering Portfolio uses Auth.js / NextAuth v5.

Protected administration flows must use the established authentication helpers and
existing admin-role checks.

Do not invent a second authentication mechanism unless explicitly authorized.

## Admin boundary

Administrative routes and actions must preserve the existing Portfolio admin
authorization model.

The current primary administrative role is:

`role === "admin"`

Do not weaken server-side authorization because equivalent UI controls exist.

Frontend visibility is not an authorization boundary.

## Article and review ownership

Articles and reviews remain Portfolio-local data.

Article editing must preserve the established author/admin ownership behavior,
including existing `canEditArticle` or equivalent authorization helpers.

Do not migrate these domains into Platform API merely because shared project content
uses Platform.

## Database model

Portfolio currently uses the established Prisma client in:

`src/lib/db/client.ts`

There is currently no CRM-style RLS/runtime-role/token-lane architecture in this
repository.

Therefore:

- do not introduce `withRls*` patterns from CRM
- do not assume DB session variables exist
- do not require token-lane DB roles
- do not claim RLS protects Portfolio data unless the repository later implements it
- do not copy CRM access assumptions into Portfolio

Authorization must still be enforced at trusted server boundaries.

## Portfolio-local ownership

Portfolio locally owns at least:

- User
- Article
- Review
- local MediaAsset behavior
- authentication/session-related state
- retained legacy Portfolio/project snapshot rows used for rollback/reconciliation

Existing schema and repository evidence remain authoritative if ownership changes.

## Shared project/case-study ownership

Shared project/case-study content has moved behind the Platform integration boundary.

Legacy Portfolio rows may remain as a read-only rollback/reconciliation snapshot.

They must not become an alternate active write source.

Do not restore direct Prisma mutation paths for shared project/case-study content.

Shared project writes must follow the rules in:

`.agents/repo/portfolio-platform-consumer.md`

## Source ownership rule

Every change must identify which system owns the state being modified.

Use this order of reasoning:

1. Is the state Portfolio-local?
2. Is it shared Platform-owned project/case-study state?
3. Is it local media or Platform-owned shared media?
4. Which established provider/service owns the operation?

Do not create a second source of truth.

## Media ownership

Portfolio has two distinct media lanes.

### Portfolio-local media

Local media-library behavior uses Portfolio storage abstractions under:

`src/lib/storage/`

and related media modules.

When configured for object storage, R2 is accessed through the existing S3-compatible
storage abstraction.

### Shared project media

Shared case-study/project media belongs to the Platform-side media workflow.

Portfolio must use the established Platform media/client boundary rather than
inventing parallel shared-object writes.

Load:

`.agents/concerns/external-storage.md`

when changing object-storage behavior.

Also load:

`.agents/repo/portfolio-platform-consumer.md`

when shared Platform media is involved.

## Migration and schema boundaries

Do not create or execute Prisma migrations unless explicitly authorized.

Do not treat retained shared-content snapshot tables as permission to restore their
legacy mutation paths.

Database changes must preserve the current ownership split unless the user explicitly
authorizes an architectural change.

## External state

When an external provider owns authoritative shared state, Portfolio must consume the
established persisted/provider representation rather than independently reconstructing
a second truth.

## Security rule

Never trust browser-controlled values for authorization decisions when trusted
server/session/provider context is already available.

Never expose server-only credentials to client code.
