# Domain: Frontend / UI

## Mission

Own user-facing rendering, interaction, accessibility, and client behavior
while preserving server-first architecture and trusted server boundaries.

## Owns

- React components
- route UI composition
- client islands
- client hooks
- forms/interactions
- accessibility
- responsive behavior
- presentation/error states
- frontend-focused tests

## Boundaries

Components render/compose.
Hooks own reusable client interaction behavior.

Business rules, authorization, persistence, and external-service secrets do not belong in UI/hooks.

Server truth must not be recreated as client business truth.

## Quality

- single responsibility
- readable JSX
- clear domain naming
- data-driven rendering where variation is data
- reuse established design-system/domain primitives
- split mixed-concern components

## Delegation

May use specialists for:

- accessibility
- forms
- interaction behavior
- responsive layout
- design-system integration
- frontend tests

The Head owns architecture consistency and final integration.
