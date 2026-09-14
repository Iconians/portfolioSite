# Engineering Portfolio — Design System

These rules govern Portfolio-specific presentation and design-system behavior.

Load for visible UI, reusable components, public project presentation, Storybook,
tokens, or design-system work.

## Source of truth

Primary Portfolio design-system documentation:

`docs/design-system.md`

Use current implementation and design-system changelog/evidence where applicable.

## Shared primitives

Reusable presentation primitives live primarily under:

`src/components/ui/`

Prefer established primitives over creating one-off replacements.

Before creating a new primitive:

1. search for an existing component
2. verify whether composition can solve the requirement
3. verify whether the design-system docs define the pattern
4. create a new primitive only when the requirement is genuinely reusable

## Presentation ownership

The design system owns presentation behavior.

It does not own:

- Platform API content truth
- provider selection
- shared project write behavior
- authentication
- persistence decisions

UI must render established application/domain state rather than recreating business
rules.

## Public portfolio presentation

Public project/case-study pages must preserve the distinction between:

- presentation/layout
- content supplied by the project-read provider

Do not move Platform source/provider decisions into components.

## Server-first

Follow the Next.js stack rules.

Pages remain Server Components by default.

Use Client Components only for required browser interaction/state/effects.

Do not convert a large page tree to client rendering merely to simplify one
interactive control.

## Storybook

Portfolio includes Storybook.

For reusable primitive or design-system changes, determine whether the affected
component has an existing Storybook representation.

Update or validate stories when the change materially affects reusable presentation
behavior.

Do not create Storybook work for unrelated backend/domain tasks.

## Tokens and consistency

Use established Portfolio tokens and design-system conventions.

Do not hard-code competing visual values when a design token or existing primitive
already represents the requirement.

## Reusable vs route-specific UI

Reusable components belong under the established component structure.

Truly route-specific presentation may remain route-local when it has no reasonable
reuse outside that route.

Do not promote every small component into the design system.

## Accessibility

UI changes must preserve semantic markup, keyboard behavior, focus behavior, labels,
and accessible state communication.

Do not sacrifice accessibility to match a visual mock.

## Validation

Use the validation contract in:

`.agents/repo/portfolio-validation.md`

For meaningful design-system changes, include applicable Storybook/design verification
in addition to normal implementation checks.
