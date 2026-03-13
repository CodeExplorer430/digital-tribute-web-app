# Software Requirements Specification

This document captures the current product baseline in an IEEE 830-style format
for Everlume.

## Purpose

Everlume provides public memorial pages, controlled private access, family-admin
management workflows, QR short links, media handling, and moderated visitor
participation.

## Stakeholders

- Public visitors and invited family/friends
- Family administrators and memorial owners
- Repository maintainers and operators
- Platform operators for Vercel, Supabase, Cloudflare, Cloudinary, and Cloud
  Run

## Functional Requirements

| ID    | Requirement                                                           | Current implementation                                     |
| ----- | --------------------------------------------------------------------- | ---------------------------------------------------------- |
| FR-01 | Public visitors can browse and open public memorial pages.            | Public homepage directory and `/memorials/[slug]` routes   |
| FR-02 | Private and password-protected memorials enforce access restrictions. | `page-access`, `page-password`, and unlock flow            |
| FR-03 | Visitors can submit guestbook messages with anti-abuse controls.      | Public guestbook route, CAPTCHA, rate limiting, moderation |
| FR-04 | Protected media requires explicit consent before viewing.             | Consent gate, consent cookie/token, media proxy routes     |
| FR-05 | Family admins can create, edit, and publish memorial pages.           | Admin CRUD routes and memorial editor                      |
| FR-06 | Family admins can manage photos, videos, and timeline events.         | Admin media routes/components and upload/transcode flows   |
| FR-07 | Family admins can moderate guestbook entries.                         | Admin moderation routes and screen                         |
| FR-08 | Family admins can manage users and account activation state.          | Admin user-management routes and screen                    |
| FR-09 | Short links and QR codes route memorial visitors reliably.            | App redirect route, Cloudflare worker, QR tooling          |
| FR-10 | Operators can back up, restore, and verify production readiness.      | Backup workflows, prereq gates, launch-readiness checks    |

## External Interfaces

- Browser UI over Next.js App Router pages
- JSON API surface under `/api/admin/*`, `/api/public/*`, `/api/guestbook`
- Supabase Auth/Postgres/Storage
- Cloudinary widget and media delivery URLs
- Cloud Run transcode callback contract
- Cloudflare Worker short-link routing

## Non-Functional Requirements

| ID     | Requirement                                                         | Verification baseline                                  |
| ------ | ------------------------------------------------------------------- | ------------------------------------------------------ |
| NFR-01 | Admin actions are role-gated and owner-scoped.                      | `requireAdminUser`, route tests, RLS-backed schema     |
| NFR-02 | Admin mutations are auditable.                                      | `admin_audit_logs`, route tests, admin audit helpers   |
| NFR-03 | Public anti-abuse controls are enabled in production.               | prereq gate, guestbook route, Upstash + CAPTCHA checks |
| NFR-04 | Public experience meets accessibility and performance budgets.      | Playwright a11y lane and Lighthouse CI                 |
| NFR-05 | Releases meet static quality and regression gates.                  | format/lint/typecheck/unit/e2e/build workflows         |
| NFR-06 | Security headers and browser restrictions are applied consistently. | Next header policy and header-focused unit tests       |
| NFR-07 | Recovery procedures exist for data, worker, and frontend incidents. | backup runbooks, restore drill, rollback SOP           |
| NFR-08 | Operational services and secrets are explicitly mapped.             | service architecture map and prereq scripts            |

## Constraints And Assumptions

- Admin client code must go through `/api/admin/*` and not query Supabase
  directly.
- Production anti-spam controls require Upstash-backed rate limiting and
  Turnstile CAPTCHA.
- Cloudflare Worker builds and deployment remain part of release readiness for
  short-link functionality.
- Local and CI verification rely on mock-first strategies for third-party
  integrations.

## Acceptance Baseline

The current product baseline is accepted when:

- functional flows remain green in unit and Playwright coverage,
- release gates (`lint`, `typecheck`, `test:coverage`, `e2e`, `a11y`,
  `launch_readiness`, `perf_a11y_gate`, `build`) remain green,
- operational prerequisites and worker prerequisites pass before deployment.
