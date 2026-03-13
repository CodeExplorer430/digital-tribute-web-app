# ISO/IEC 25010 Quality Model Mapping

This document maps the current implementation to the ISO/IEC 25010 quality
characteristics and highlights the main remaining gaps.

| Characteristic         | Current evidence                                                                                          | Current gap focus                                                                                          |
| ---------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Functional suitability | Public/admin flows are implemented and heavily tested.                                                    | Continue tracking optional UX enhancements separately from compliance work.                                |
| Performance efficiency | Lighthouse CI budgets and Next production builds are enforced.                                            | Add explicit service SLO targets for runtime monitoring.                                                   |
| Compatibility          | Webpack and Turbopack coverage exist; worker and app integrations are documented.                         | Continue validating external service compatibility during dependency waves.                                |
| Usability              | Public and admin flows are tested; skip link and accessibility lane exist.                                | Add explicit accessibility statement and manual assistive-tech validation notes.                           |
| Reliability            | Backup workflows, restore drills, incident SOP, and launch-readiness checks exist.                        | Add explicit RTO/RPO targets and evidence retention policy.                                                |
| Security               | Admin RBAC, audit logs, anti-abuse controls, private media signing, and security headers are implemented. | Formalize CSRF/origin review, add continuous SAST/SCA evidence, and track privacy/data-retention controls. |
| Maintainability        | High unit coverage, mirrored tests, and documented branch governance exist.                               | Add formal traceability and standards-oriented QA records.                                                 |
| Portability            | Next/Vercel app, Cloudflare worker, and Cloud Run transcode service are documented.                       | Keep deployment contracts versioned and verify environment parity regularly.                               |

## Immediate Improvement Priorities

1. Continuous security scanning evidence in CI
2. Formal QA/SRS/traceability documents
3. Explicit privacy, retention, and observability policy coverage
