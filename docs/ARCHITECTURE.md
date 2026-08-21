# Architecture — Engineering Portfolio Management System (V2)

This document describes the **current** V2 architecture after Phases 1–18 and Phase 19 cleanup. It is descriptive, not a redesign proposal.

---

## Presentation Layer

### Public site

| Area | Location | Notes |
|------|----------|-------|
| Homepage | `src/app/page.tsx` | Portfolio cards, featured articles, reviews |
| Project detail | `src/app/projects/[slug]/page.tsx` | Hero, summary, tech, metrics, story, evolution, platform, links |
| Blog index / post | `src/app/blogs/` | DB-backed articles with optional cover media |
| About | `src/app/About/` | Static marketing content |
| Shared UI | `src/components/Portfolio/`, `src/components/ui/` | Reusable public components |

### Admin

| Area | Location | Notes |
|------|----------|-------|
| Shell | `src/components/Admin/layout/` | Sidebar, breadcrumbs, page header |
| Portfolio editor | `src/components/Admin/portfolio/ProjectEditor.tsx` | Tabbed editor (overview → platform) |
| Media library | `src/app/admin/media/` | Upload, metadata, delete |
| Articles / reviews | `src/app/admin/articles/`, `src/app/admin/reviews/` | CRUD with auth |

### Shared UI

- `MediaPicker` — browse library + inline upload (`src/components/Admin/media/MediaPicker.tsx`)
- Form primitives — `FormSection`, `FormField`, `ConfirmDialog`, `EmptyState`
- Animations — Framer Motion wrappers under `src/components/Animations/`

---

## Application Layer

### Server actions (`src/lib/actions/`)

Thin handlers: auth check → call service/data → revalidate paths → return `ActionResult`.

| Domain | Files |
|--------|-------|
| Portfolio | `portfolio.ts`, `portfolio-metrics.ts`, `portfolio-versions.ts` |
| Media | `media.ts` |
| Articles | `articles.ts` |
| Reviews | `reviews.ts` |

### Services (`src/lib/` by domain)

Business rules, validation, orchestration — **not** in components or route handlers.

| Domain | Path | Responsibility |
|--------|------|----------------|
| Portfolio | `src/lib/portfolio/` | Slugs, editor payload split, metrics/versions, platform showcase, public helpers |
| Media | `src/lib/media/` | Upload validation, storage orchestration, delete guards |
| Articles | `src/lib/articles/` | Cover image helpers |
| Storage | `src/lib/storage/` | Provider factory (local / S3-compatible) |

### Validation

- Zod schemas in `src/lib/types/` (`portfolio.ts`, `articles.ts`, `media.ts`, `reviews.ts`)
- Partial schemas for updates; editor uses `ProjectEditorSchema`

### Auth

- Auth.js (NextAuth v5) in `src/lib/auth.ts`
- `requireAdmin()` in `src/lib/permissions.ts` — admin role gate for mutations
- Middleware + admin layout gate for `/admin/*`

---

## Persistence Layer

### Prisma + Neon PostgreSQL

| Model | Purpose |
|-------|---------|
| `Portfolio` | Projects (legacy + V2 fields: slug, story, gallery JSON, platform, SEO, media FKs) |
| `PortfolioMetric` | Ordered stat cards |
| `ProjectVersion` | Evolution timeline |
| `MediaAsset` | Uploaded files metadata + storage key |
| `Article` | Blog posts + optional `coverMediaId` |
| `Review` | Client testimonials |
| `User` | Admin accounts |
| `AuditLog` | Admin action trail |

### Data access (`src/lib/data/`)

Prisma queries only — no business logic.

- `portfolio.ts`, `portfolio-metrics.ts`, `project-versions.ts`
- `media.ts`, `articles.ts`, `reviews.ts`

### Storage abstraction

```
getStorageProvider() → LocalStorageProvider | S3StorageProvider
```

- Dev: `STORAGE_PROVIDER=local` → `public/media/`
- Prod: `STORAGE_PROVIDER=s3` → Cloudflare R2 via S3 API

---

## Infrastructure

| Concern | Technology |
|---------|------------|
| Framework | Next.js 16 App Router |
| Runtime DB | Neon PostgreSQL (pooled connection on Vercel) |
| ORM | Prisma 7 with `@prisma/adapter-pg` |
| Object storage | Cloudflare R2 (S3-compatible) |
| Auth | Auth.js / NextAuth v5 |
| Deploy | Vercel |
| Tests | Bun test runner (`tests/unit/`) |

---

## Data Flow

```
Admin UI (client)
    ↓ submit
Server Action (validate + auth)
    ↓
Service (business rules)
    ↓
Data layer (Prisma)
    ↓
PostgreSQL + object storage
    ↓
Public Server Components (read published data)
    ↓
Public UI
```

### Media upload flow

```
MediaPicker → POST /api/media/upload (admin auth)
    → media.service → StorageProvider.upload
    → MediaAsset row → publicUrl returned
```

Portfolio hero / article cover store `heroMediaId` / `coverMediaId` FKs; `img` remains the denormalized public URL for cards and backward compatibility.

---

## Folder Structure (V2)

```
src/
  app/                    # Routes (public + admin + API)
  components/
    Admin/                # Admin-only UI
    Portfolio/            # Public project detail sections
    ui/                   # Shared primitives
  lib/
    actions/              # Server actions
    articles/             # Article domain helpers
    auth/                 # Auth utilities
    data/                 # Prisma queries
    media/                # Media service
    portfolio/            # Portfolio service + helpers
    storage/              # Storage providers
    types/                # Zod + TS types
prisma/                   # Schema + migrations
scripts/                  # One-time migration / backfill (not runtime)
tests/unit/               # Unit tests by domain
```

---

## Intentionally Retained (Phase 19)

| Item | Reason |
|------|--------|
| `Portfolio.img` | Homepage cards + hero rendering; synced from media picker |
| `heroMediaId` / `ogMediaId` | FK links to `MediaAsset`; delete guards |
| `keyFeatures`, `role`, `highlights` | Legacy DB columns; editable in Details tab; not on public detail yet |
| `description` vs `summary` | Cards use `summary` with `description` fallback |
| `scripts/migrate-content.ts` | One-time MDX/static → DB migration for fresh environments |
| `scripts/backfill-portfolio-slugs.ts` | Slug / heroMediaId backfill helper |
| MDX files under `src/app/lib/content/posts/` | Source for `migrate:content` only |

---

## Future Refactors (V3 / Phase 20 — not in scope)

- Drop `img` when all heroes resolve via `heroMediaId` only
- Migrate `keyFeatures` / `highlights` / `role` into structured JSON or remove from editor
- Public gallery section on project detail pages
- Draft preview route, metric visibility flags, autosave
- Consolidate duplicate metric/version schema tests (already deduped in Phase 19)
