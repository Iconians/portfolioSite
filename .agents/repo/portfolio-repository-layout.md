# Engineering Portfolio — Repository Layout

These rules define Portfolio-specific physical placement and architecture routing.

Load this file when creating, moving, or reorganizing files.

## Architecture source

Primary architecture reference:

`docs/ARCHITECTURE.md`

Use current repository structure as additional evidence.

## Application structure

Portfolio uses the Next.js App Router under:

`src/app/`

Routes, layouts, pages, and route-specific implementation belong there when they are
truly route-owned.

Do not place reusable domain logic in `src/app/`.

## Domain logic

Production application/domain logic belongs under:

`src/lib/`

Existing domain ownership includes areas such as:

- `actions/`
- `articles/`
- `auth/`
- `data/`
- `media/`
- `portfolio/`
- `project-read/`
- `project-write/`
- `project-source/`
- `storage/`
- `apiInquiries/`

Before creating a new domain directory:

1. identify architectural responsibility
2. search for an existing owning domain
3. prefer extending the established domain when ownership matches
4. create a new domain only when it represents a genuinely separate responsibility

## Project consumer domains

Do not blur:

- `project-read`
- `project-write`
- `project-source`

These folders encode important Platform-consumer ownership.

Provider/source logic belongs there rather than in UI/routes.

## Components

Reusable UI lives under:

`src/components/`

Existing categories include:

- `ui`
- `Portfolio`
- `Admin`
- `patterns`
- `layout`
- `typography`

Follow existing domain/presentation ownership rather than adding unrelated components
to a flat root.

UI-specific work must also load:

`.agents/repo/portfolio-design-system.md`

## Tests

Automated tests live under:

`tests/`

Unit tests currently dominate the repository.

Mirror production-domain ownership when practical.

Do not colocate tests inside production implementation directories merely for
convenience.

## Scripts

Executable repository/development/verification scripts belong under:

`scripts/`

Do not place operational scripts inside domain libraries.

## Plans

Portfolio-specific implementation and presentation plans belong in this repository.

Do not copy Platform API master/cross-repository plans here merely to make them easier
for an agent to reach.

Platform API program authority remains in the Platform API repository unless the
current task explicitly states otherwise.

## Phase evidence

Portfolio consumer/cutover evidence may legitimately live under:

- `docs/phase-10/`
- `docs/phase-11/`

Use current accepted reports rather than assuming older plan TODO markers are current.

## Placement rule

Before creating a file:

1. identify what owns the behavior
2. identify whether it is route, UI, domain, integration, persistence, test, or script
3. search for an existing matching Portfolio domain
4. place it where future maintainers will expect to find that responsibility

Do not create files in the nearest convenient directory.
