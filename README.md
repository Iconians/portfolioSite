# Engineering Portfolio Platform

This repository powers my Engineering Portfolio Platform: a production application for presenting engineering work through structured case studies, project evolution, technical articles, media, metrics, and client feedback, backed by a secured administrative content system.

Rather than treating the portfolio as a collection of static project pages, the platform is designed to model and communicate how software systems are designed, built, and evolved over time.

Live site: [clytoncripe.com](https://www.clytoncripe.com)

Architecture reference: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

Design system (presentation layer): [`docs/design-system.md`](docs/design-system.md)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS Modules |
| Animations | Framer Motion |
| Database | Neon PostgreSQL + Prisma 7 |
| Auth | Auth.js (NextAuth v5) |
| Media storage | Local (dev) / Cloudflare R2 via S3 API (prod) |
| Package manager | Bun |
| Deploy | Vercel |

---

## Running Locally

**Prerequisites:** Bun, PostgreSQL (Neon recommended), env vars configured.

```bash
git clone https://github.com/Iconians/portfolioSite.git
cd portfolioSite
bun install

# Configure environment (DATABASE_URL, AUTH_SECRET, storage vars — see below)
cp .env.example .env.local   # if present; otherwise copy from team docs

bun run db:migrate:deploy
bun run dev
```

Open http://localhost:3000.

`bun run dev` runs `prisma generate` first so schema changes are picked up automatically.

### First-time content (optional)

For a fresh database only:

```bash
bun run seed:admin          # Create admin user
bun run migrate:content     # Import legacy MDX articles + seed portfolio/reviews
bun run backfill:portfolio-slugs
```

Production and normal admin workflows do **not** require these scripts.

### Admin

- Sign in at `/admin` with the seeded admin credentials
- Manage portfolio projects, media, articles, and reviews from the sidebar

---

## Object Storage (Cloudflare R2)

Production media uses the storage abstraction (`src/lib/storage/`).

```bash
STORAGE_PROVIDER=s3
S3_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
S3_REGION=auto
S3_BUCKET=engineering-platform-assets
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_PUBLIC_URL_BASE=https://pub-xxxx.r2.dev
```

- Local dev defaults to `STORAGE_PROVIDER=local` → files under `public/media/`
- Upload API: `POST /api/media/upload` (admin auth)
- Set `S3_PUBLIC_URL_BASE` before dev/build when using R2 URLs with `next/image`

---

## Deployment (Vercel)

1. Set `DATABASE_URL` (Neon **Pooled** connection string), `AUTH_SECRET`, and storage env vars for Production.
2. Run migrations in CI or manually: `bun run db:migrate:deploy`
3. Check Vercel function logs if you see a digest error on deploy.

---

## Scripts

| Script | Purpose |
|--------|---------|
| `bun run dev` | Generate Prisma client + start dev server |
| `bun run build` | Production build |
| `bun test tests/unit` | Unit tests |
| `bun run db:migrate:deploy` | Apply migrations |
| `bun run seed:admin` | Create admin user |
| `bun run migrate:content` | One-time legacy import |
| `bun run backfill:portfolio-slugs` | Slug + heroMediaId backfill |
| `bun run ci` | Lint, migrate, validate, build |

---

## Project Structure (summary)

```
src/app/              Routes (public, admin, API)
src/components/       UI by domain (Admin, Portfolio, …)
src/lib/actions/      Server actions
src/lib/data/         Prisma queries
src/lib/portfolio/    Portfolio business logic
src/lib/media/        Media upload service
src/lib/storage/      Storage providers
tests/unit/           Unit tests
prisma/               Schema + migrations
scripts/              Migration/backfill utilities
docs/                 Architecture documentation
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full V2 system map.

---

## Quality

```bash
bun test tests/unit
npx tsc --noEmit
npm run lint
```
