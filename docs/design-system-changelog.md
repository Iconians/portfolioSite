# Design System Changelog

Lightweight API evolution log for the portfolio presentation layer. Entries reflect **shipped** work only.

Format: **Added** | **Changed** | **Deprecated** | **Removed** — with layer, summary, and phase reference where useful.

---

## V1.0 — Design System Program Complete

Program phases 1–11. Public portfolio + shared primitives; admin consumes opportunistically.

### Tokens (Phase 1)

**Added**

- `src/design-system/tokens/tokens.css` — semantic aliases `--ds-canvas`, `--ds-surface`, `--ds-elevated`, `--ds-border-subtle`, `--ds-text-primary`, `--ds-text-muted`
- Legacy bridge aliases: `--site-bg-color`, `--blog-card-border`, `--card-inner-bg`, `--heading-color`, etc.

**Changed**

- `globals.css` — removed global `button` width/height overrides; consolidated theme paths with tokens
- Project and home pages aligned to `bg-background` / canvas hierarchy

**Removed**

- Dead CSS modules: `PortfolioSection.module.css`, `blogPage.module.css`, `BlogCard.module.css`, `ReviewComponent.module.css`

---

### UI primitives (Phase 2)

**Added**

- `Dialog` — modal with focus trap, Escape, scroll lock
- `Link` — internal/external styled links
- `Alert` — variants `default`, `destructive`, `warning`
- `Separator` — horizontal / vertical
- `Spinner`, `LoadingState`
- Storybook bootstrap (`.storybook/`, `npm run storybook`)

**Changed**

- `Button` — `size="icon"` with 44px min touch target for gallery/admin controls

**Deprecated**

- Bespoke confirm overlay markup in pilot `ConfirmDialog` path (migrated to `Dialog`)

---

### Layout (Phase 3)

**Added**

- `Container`, `Section`, `Surface`, `Stack`, `Inline`, `ContentWidth`
- ESLint categories `layout`, `typography` (stub), `patterns` (stub) + boundary rules

**Changed**

- `ProjectPageSection` internals use layout primitives

---

### Typography (Phase 4)

**Added**

- `Heading` — levels 1–6, `variant="eyebrow"`
- `Text` — `body`, `bodyLarge`, `description`, `muted`
- `Label`, `Caption` (typography layer — not `ui/Label`)

**Removed**

- Typography keys from `project-page-styles.ts` (later file deleted in Phase 8)

---

### Patterns (Phase 5)

**Added**

- `MetricGrid`, `MetricCard`
- `Timeline`, `TimelineItem`
- `ProjectCard`
- `ArticleCard`
- `ReviewCard`
- `EmptyState` (moved from Admin-only copy; admin re-imports)

**Not added (Architecture Review)**

- `TechnologyBadgeList` — rejected (insufficient multi-consumer justification)
- `FeatureChecklist` — rejected (platform/story shapes not shared enough)

---

### Case study IA (Phase 6)

**Added**

- `src/lib/portfolio/case-study-layout.ts` — `CASE_STUDY_SECTIONS`, `getVisibleCaseStudySections`, `getCaseStudySectionKeys`
- `CaseStudyPage` composer — maps section keys to domain components
- Unit tests: `tests/unit/portfolio/case-study-layout.test.ts`

**Deferred (documented in layout module)**

- Related Articles section
- Dedicated `ProjectTechnologies` section (summary shows badges)

---

### Gallery (Phase 7)

**Added**

- `src/design-system/types/gallery.ts` — `GalleryImage` contract
- `EngineeringGallery`, `GalleryThumbnailGrid`, `GalleryLightbox`, header/navigation/viewport subcomponents
- Lightbox view modes: `fit` (default) and `actual` (100%)
- Unit tests: gallery navigation + view mode helpers

---

### Case study migration (Phase 8)

**Changed**

- Portfolio case study components migrated to layout, typography, surfaces, patterns
- `CaseStudyPage` remains canonical section composer

**Removed**

- `src/lib/portfolio/project-page-styles.ts` (entire bridge file)

---

### Public routes (Phase 9)

**Changed**

- Home, About, blogs, navigation migrated to layout/typography/patterns/primitives
- `AboutContentClient`, `BlogPostClient` — CSS modules removed; inline Tailwind for blog prose (`BLOG_ARTICLE_CLASS`)

**Removed**

- `aboutPage.module.css`, `blogPostClient.module.css`

---

### Storybook (Phase 10)

**Added**

- Stories for all `ui/` primitives (13 components)
- Grouped `Layout/Overview` and `Typography/Overview` stories
- `Design System/Tokens` color swatches
- Pattern stories including gallery interaction documentation (manual checklist)
- Preview theme toolbar + viewport presets (`sm`, `md`, `lg`)

**Not added (explicit deferrals)**

- `@storybook/test` play functions
- `@storybook/addon-a11y`
- `build-storybook` in CI

---

### Documentation (Phase 11)

**Added**

- `docs/design-system.md` — contributor guide
- `docs/design-system-changelog.md` — this file

---

## How to add entries

When you ship a design-system change:

1. Add a dated or versioned section **or** append under the current version with **Added** / **Changed** / **Deprecated** / **Removed**.
2. Name the layer (`ui`, `layout`, `typography`, `patterns`, `tokens`, `IA`).
3. Note breaking changes to props, variants, or contracts (`GalleryImage`, section keys).
4. Link to Storybook story if a new pattern or primitive is introduced.

Do not log drive-by CSS cleanup or deferred redesign work here unless it changes the public component API.
