# Runtime Platform: Cursor Agent

Cursor uses tighter task-by-task execution controls than the Grok department organization.

## Default mode

Use one active Cursor agent for the authorized task.

Do not automatically create subagents, background agents, swarms, or parallel agents.

Subagents may be used only when the human explicitly authorizes them for the current task.

## Task discipline

1. confirm the exact authorized task/numbered slice
2. load only applicable rules/context
3. inspect established abstractions before creating new ones
4. implement only the authorized slice
5. run targeted validation
6. run the appropriate completion gate
7. report files/results/risks
8. STOP

Do not start the next task, phase, milestone, or "obvious follow-up" automatically.

## Repository reading

- use targeted search
- avoid broad scans
- do not reread settled plans/reports unnecessarily
- do not create duplicate plans/reviews
- reuse accepted evidence
- persist concise progress when context gets tight

## Planning

If asked to plan, plan.
Do not implement unless implementation is explicitly authorized.

Honor STOP gates literally.

## Protected operations

Git history, dependency changes, lockfile regeneration, migrations,
deploys, production changes, and enforcement weakening remain protected.

## Subagent exception

When explicitly authorized:

- give each worker a bounded task
- pass minimal context
- make workers inherit all repository restrictions
- review all output in the primary agent
- keep the primary agent accountable

Authorization does not carry into later tasks.
