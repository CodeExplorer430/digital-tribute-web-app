# Traceability Matrix

This matrix links the major current requirements to implementation and
verification evidence.

| Requirement                          | Primary implementation                                  | Verification                                  | Notes                                                              |
| ------------------------------------ | ------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------ |
| Public memorial rendering            | App Router memorial page and public components          | unit tests + public Playwright flow           | Includes public directory and memorial view composition            |
| Private/password memorial protection | `page-access`, `page-password`, unlock route            | unit tests + password/private e2e coverage    | Includes metadata gating and unlock token handling                 |
| Guestbook submission and moderation  | public guestbook route, admin moderation routes/screens | unit/component/route tests + moderation e2e   | Includes rate limiting, CAPTCHA, moderation                        |
| Protected media consent              | consent gate, media routes, consent helpers             | route/component/helper tests                  | Includes consent logging and media token flows                     |
| Admin memorial CRUD                  | admin memorial routes and editor/new form               | route/component tests + create memorial e2e   | Includes hero image and memorial presentation settings             |
| Admin media management               | photo, video, upload, and timeline routes/components    | route/component tests + video upload e2e      | Includes transcode callback and Cloudinary metadata save           |
| Admin user management                | admin users routes and screen                           | route/component tests + auth e2e lane         | Includes invite, reset, activate/deactivate, last-admin guards     |
| Short links and QR routing           | app redirect route, worker, QR components               | route tests + launch-readiness + worker tests | Includes QR selector and health checks                             |
| Release quality gates                | GitHub Actions CI and local scripts                     | workflow definitions + passing CI baseline    | Covers format, lint, typecheck, coverage, e2e, perf, build         |
| Backup and recovery                  | backup workflows and runbooks                           | backup docs + restore drill workflow          | Operational evidence still depends on actual run history retention |
