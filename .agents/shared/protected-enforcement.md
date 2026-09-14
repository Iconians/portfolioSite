# Protected Enforcement

Engineering standards must not be weakened to make implementation pass.

## Protected configuration

Material changes to enforcement/governance configuration require explicit human authorization.

Protected examples include:

- `AGENTS.md` and `.agents/**` while acting as an implementation agent
- `.cursor/rules.mdc`
- ESLint/Ruff configuration
- TypeScript/type-checker configuration
- test configuration
- coverage thresholds
- structure/architecture checker configuration
- CI/merge-gate configuration
- security enforcement configuration

Do not:

- disable rules
- lower severity
- broaden ignores
- add broad exemptions/baselines
- raise thresholds solely to silence failures
- weaken assertions
- bypass architecture/structure checks
- add unnecessary ignore directives

## Fix implementation, not standards

If code fails enforcement:

1. fix the source
2. rerun the relevant gate
3. if compliance appears genuinely impractical, STOP
4. report the exact tool/file/rule/threshold conflict
5. explain why source compliance is impractical
6. wait for approval

"Fix lint/tests/CI" is not permission to change enforcement configuration.
