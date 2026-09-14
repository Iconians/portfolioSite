# Engineering Portfolio — Platform Consumer Contract

These rules govern Engineering Portfolio's integration with DevLaunch Platform API.

This is a critical repository-specific boundary.

## Shared project reads

Shared public project/case-study reads must use the provider abstraction under:

`src/lib/project-read/`

Do not bypass that provider with ad-hoc Prisma reads for shared project content when
the Platform provider is selected.

Current supported read sources include:

- `database`
- `platform-api`

Read-source selection is controlled by:

`PROJECT_READ_SOURCE`

Use existing configuration helpers rather than reading environment variables ad hoc
through unrelated code.

## Shared project writes

Shared project/case-study writes must use the provider abstraction under:

`src/lib/project-write/`

The current required write source is:

`PROJECT_WRITE_SOURCE=platform-api`

Legacy Prisma shared-project writers are frozen.

Do not restore:

`PROJECT_WRITE_SOURCE=database`

Do not create new direct Prisma write paths for Platform-owned shared project data.

## Mixed-source rollback state

The repository intentionally supports a rollback-compatible state in which:

`PROJECT_READ_SOURCE=database`

and:

`PROJECT_WRITE_SOURCE=platform-api`

may coexist.

Do not "fix" this merely because read/write sources differ.

That mixed configuration is intentional unless a separately authorized architecture
decision changes it.

## Platform credentials

Server-side Platform integration uses environment/config values including:

- `DEVLAUNCH_PLATFORM_API_URL`
- `DEVLAUNCH_PLATFORM_API_TIMEOUT_MS`
- `DEVLAUNCH_PLATFORM_API_TOKEN`

The token is server-only.

Never:

- expose it to browser bundles
- return it through APIs
- log it
- place it in public environment variables
- pass it to client components

## Platform consumer identity

Use the established Engineering Portfolio Platform consumer/audience values from the
existing provider implementation.

Do not invent alternate consumer names, audiences, scopes, or tokens without evidence
and authorization.

## Provider ownership

Routes, actions, components, and pages must not independently reproduce provider
selection logic.

Provider configuration and source coherence belong in the established provider/source
modules.

Preserve:

- `project-read`
- `project-write`
- `project-source`

ownership boundaries.

## Public project paths

Public project detail/list/home-featured behavior must consume shared content through
the established read provider.

Frontend components render provider results.

They must not decide which persistence system owns shared content.

## Admin project editing

Admin shared-project edit/load/write behavior must use the Platform write/admin
clients.

Do not route shared-content mutations back through retained legacy Prisma writers.

Articles and reviews are separate Portfolio-local domains and are not covered by this
shared-project write rule.

## Write freeze

M17 freezes legacy shared-content Prisma writes.

Treat this as an architectural invariant, not a temporary implementation detail.

Any proposed removal or relaxation of the freeze requires explicit human
authorization and architecture review.

## Cache behavior

Preserve established provider/cache behavior, including existing:

- Platform read caching
- ISR/revalidation behavior
- project detail invalidation
- homepage invalidation where applicable

Do not create independent cache invalidation logic if an established helper already
owns that responsibility.

Changes affecting source/provider caching must load:

`.agents/concerns/resilience-observability.md`

when applicable.

## Media

Portfolio-local media and Platform-owned shared media are separate ownership lanes.

Shared project/case-study media must use the established Platform media integration.

Do not create duplicate R2/shared-object write paths from Portfolio.

When modifying media URL or storage behavior also load:

`.agents/concerns/external-storage.md`

## Contract changes

If changing Platform request/response DTO mappings, endpoint assumptions, consumer
identity, or API behavior, load:

`.agents/concerns/api-contracts.md`

Do not silently change both sides of a contract from this repository.

Platform API implementation belongs to the Platform API repository.

## Failure behavior

Provider failures must remain explicit and diagnosable.

Do not silently fall back to another source unless the existing provider contract
explicitly defines that behavior.

Do not convert integration failures into misleading empty-state success.

## Forbidden

Do not:

- bypass `project-read` for shared public content
- bypass `project-write` for shared mutations
- restore legacy Prisma shared writes
- expose Platform tokens to the client
- invent parallel Platform clients without justification
- duplicate provider-selection logic across UI/routes
- change source strategy merely to make a failing test pass
- modify Platform API implementation from this repository
