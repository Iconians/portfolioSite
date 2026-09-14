# Stack: Next.js / React / TypeScript

## Architecture

Preferred flow:

Server → Client → UI

- server owns persisted/business truth and trusted authorization
- client owns ephemeral interaction state
- UI renders/composes
- database remains the persistence/source-of-truth layer according to repository architecture

## Next.js

- prefer Server Components
- `page.tsx` remains server-side by default
- use small Client Components only for state/effects/events/browser APIs
- fetch on the server whenever practical
- pass serializable data to client islands
- keep route files thin

## Ownership

Typical locations:

- `app/` / `src/app/`: routes, layouts, pages, route handlers, route-local UI
- `components/`: reusable/supporting React components
- `hooks/`: reusable client behavior
- `lib/` / established server-service paths: services, domain logic, integrations, validation, transformations, persistence orchestration
- `tests/`: automated tests according to repo convention
- `scripts/`: maintenance/admin/migration-support scripts
- `types/`: shared types, not domain logic

Physical location should reflect architectural ownership.

## Service boundary

Routes/server actions validate/orchestrate.
Services/domain modules decide.

Do not put business rules, persistence, authorization, or integration logic inside components/hooks.

## TypeScript

- preserve strict typing
- avoid `any`
- do not use `@ts-ignore` as a shortcut
- model domain states explicitly
- prefer typed maps/unions/enums over long repetitive branch ladders when data can express variation

## React quality

- single-purpose components
- readable JSX
- avoid duplicated state
- derive state rather than syncing it with effects when possible
- keep accessibility semantics intact
- use stable domain-specific keys

## Error handling

- never silently fail
- make failure paths traceable
- distinguish expected/domain errors from unexpected/system errors
- do not leak sensitive information

## Maintainability

Priority:

1. correctness
2. maintainability
3. clarity
4. simplicity
5. consistency
6. measured performance

Avoid premature abstractions and generic utility dumping grounds.
