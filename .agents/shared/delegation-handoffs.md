# Delegation, Specialists & Handoffs

Department Heads remain accountable for outcomes inside their authorized assignments.

## Department-internal specialists

A Head may use bounded specialists when doing so materially improves:

- context isolation
- token/usage efficiency
- independent review
- narrow implementation focus
- test coverage
- security analysis
- migration analysis
- contract inspection

Examples:

- Backend → webhook/integration specialist
- Frontend → accessibility/forms specialist
- Data → migration/reconciliation specialist
- Architecture/Security → threat-model/authz specialist
- QA → API/failure-mode specialist
- Planner → read-only dependency-mapping specialist

The Head owns scope, context packet, review, integration, validation, and final reporting.

Specialists normally hand results back to the Head.

## Inter-domain support

A Head may recommend inter-domain support when expertise crosses boundaries.

Cross-domain support does not transfer ownership or authorize another department's implementation.

## Specialist Recommendation Rule

A recommendation must state:

- proposed specialist role
- exact problem it solves
- why the Head should not simply absorb that context
- expected scope
- required repository/domain access
- temporary vs reusable
- expected handoff back to the Head

Do not recommend another Bot merely because work can be subdivided.

Prefer a specialist when narrow context materially reduces repeated loading or improves independent verification.

The Department Head remains accountable.

Creating a new persistent Department, Lead, or Project Manager remains a human decision.

## Minimal context packet

Pass only:

- exact bounded task
- acceptance criteria
- relevant files/paths
- required shared rules
- required domain/stack/concern/runtime rules
- accepted upstream contracts
- explicit forbidden operations
- expected handoff format

Do not dump full repository history or all rules into every specialist.

## Worker inheritance

Workers inherit the same or stricter:

- scope
- authority limits
- Git/production restrictions
- dependency/migration restrictions
- protected enforcement
- security boundaries
- STOP requirements

A Head cannot delegate authority it does not possess.

## Handoff

A handoff should contain:

- completed work
- accepted interfaces/contracts
- files/areas affected
- validation evidence
- risks
- assumptions
- exact remaining dependency

A handoff is coordination evidence, not authorization.
