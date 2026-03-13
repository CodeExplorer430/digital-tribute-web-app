# Software Quality Assurance Plan

This document records the current IEEE 730-style quality plan for Everlume.

## Quality Objectives

- preserve public memorial availability and short-link correctness
- prevent unauthorized admin access or untracked admin mutations
- keep regression detection automated and release-blocking
- maintain accessible, performant visitor experiences
- keep operational recovery paths tested and documented

## Standards And References

- ISO/IEC 25010 quality model
- IEEE 730 software quality assurance planning
- IEEE 830 software requirements specification structure
- OWASP Top 10 web application risks
- repository governance and testing strategy documents in `docs/`

## Roles And Responsibilities

- Maintainer: approves scope, merges, and release decisions
- Reviewer: validates product, security, and operational changes before merge
- Operator: owns external services, secrets, and restore/rollback readiness

## Verification Strategy

- Static checks: `format:check`, `lint`, `typecheck`
- Unit/component/API coverage: `test:coverage`
- Worker verification: `test:worker`
- User-flow verification: `test:e2e`, `test:e2e:auth`, `test:a11y`
- Release confidence: `test:launch-readiness`, `test:perf`, `build`
- Operational verification: prereq, worker prereq, schema, backup, and
  transcode contract scripts/workflows

## Security And Quality Controls

- role-based admin route enforcement via `requireAdminUser`
- audit logging on admin mutations
- browser security headers via global Next header policy
- dependency review, CodeQL analysis, and SBOM artifact generation in GitHub
  workflows
- production deployment gates for anti-spam, transcode, and worker secrets

## Defect Handling

- CI-blocking failures must be fixed before merge
- production incidents follow `docs/handover/incident-and-rollback-sop.md`
- security or access-control regressions take precedence over feature work
- deferred risks must be documented explicitly in governance or security docs

## Release Entry And Exit Criteria

Entry:

- branch is scoped and reviewable
- acceptance criteria are mapped to tests or manual validation

Exit:

- required CI checks pass
- operational runbooks are updated for service/config changes
- security-sensitive changes include route/helper tests
- release-impacting external configuration is validated against prereq scripts

## Quality Records

- GitHub Actions run history and artifacts
- unit coverage artifacts
- Playwright reports and traces
- Lighthouse CI reports
- backup manifests and restore-drill artifacts
- worker build/deploy history
