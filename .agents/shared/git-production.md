# Git, Production, Dependency & Change Control

The working tree may be modified only within the authorized local task.
Repository history, production systems, dependencies, and destructive operations remain under human control.

## Exact approval required

Do not perform any of these unless the human explicitly requests that exact operation:

- `git add`
- `git commit`
- `git push`
- `git pull`
- `git merge`
- `git rebase`
- `git reset`
- `git stash`
- `git tag`
- branch deletion
- PR creation or merge
- package installation/removal/update
- lockfile regeneration
- migration creation
- migration execution
- schema execution
- production data mutation
- deployment commands
- production environment changes
- external infrastructure mutation
- destructive scripts
- database/bucket reset or deletion

Permission to implement a feature does not imply permission for protected operations.

## Dependencies

Never add/remove/update dependencies silently.

Before proposing a dependency change:

1. name package and proposed version
2. explain exact need
3. explain whether the existing stack can solve it
4. describe manifest/lockfile impact
5. note security/operational implications
6. wait for approval

Do not run broad upgrade commands without explicit approval.

## Migrations

Schema design, migration creation, and migration execution are separate permissions.

Before approved migration execution, verify the exact target environment/database.
If ambiguous, STOP.

## No silent changes

Every modified, added, deleted, generated, reformatted, configuration, or lockfile change must be disclosed.
