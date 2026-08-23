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

---

## Visual Redesign — Phase 1 tokens (Candidate C)

**Added**

- `--ds-accent`, `--ds-accent-hover`, `--ds-accent-muted`, `--ds-accent-foreground`, `--ds-accent-muted-foreground`, `--ds-focus-ring` (theme-tuned Refined Green)
- `--ds-surface-alt`, `--ds-footer` section rhythm tokens
- Tailwind theme: `bg-surface-alt`, `bg-footer`, `text-ds-accent`, `bg-ds-accent-muted`, `text-ds-accent-muted-foreground`

**Changed**

- `globals.css` — neutral charcoal/light canvas; removed legacy Vite global overrides (`h1`, `a`, `#root`, carousel rules)
- `tokens.css` — maps `--primary`, `--ring`, `--sidebar-primary` to `--ds-accent*`; legacy aliases retained as bridges
- `Heading` — `text-foreground` headings; eyebrow variant uses `text-ds-accent`
- Philosophy / What I build list markers — neutral muted (not accent)

**Removed**

- `Phase0AccentReview.stories.tsx` (review-only; superseded by `Design System/Tokens` stories)

---

## Visual Redesign — Phase 2 homepage shell

**Added**

- `SectionBand` — full-bleed `canvas` / `surfaceAlt` / `footer` tone wrappers
- `SiteFooter` — platform footer with nav, social, copyright
- `PlatformEvolution` — static three-arc evolution narrative
- `EngineeringStack` — capability groups with `Badge` chips (replaces CDN icon wall)
- `src/lib/portfolio/home-featured.ts` — `HOME_FEATURED_SLUGS`, `pickHomeFeaturedProjects`
- `ProjectCard` — optional `eyebrow` slot (project type)
- `Badge` — `accentMuted` variant (neutral bg + foreground for small-text chips)
- Tailwind: `text-ds-accent-hover`, `hover:bg-ds-accent-hover`

**Changed**

- Homepage IA — nine sections with alternating rhythm; nav before hero
- `Navigation` — `> Clayton Cripe` brand, Work/Writing labels, Get in touch CTA
- `Hero` — senior positioning, View work + Get in touch CTAs
- `PortfolioSection` — curated four featured projects + expandable remaining portfolio
- `Button` default hover — `--ds-accent-hover`
- Token usage demo — skill chip uses accessible secondary pairing (not accent-muted fill)

**Removed**

- SimpleIcons CDN requests from homepage stack section
- Duplicate bullet list in What I build (cards only)

---

## Visual Redesign — Phase 3 About + blog

**Added**

- `src/lib/content/focus-areas.ts`, `engineering-principles.ts` — shared profile copy (home + About)
- `src/lib/articles/read-time.ts`, `blog-tags.ts`, `blog-prose.ts` — read time, tag filters, prose tokens
- `AboutContent` server sections — profile hero, focus, principles, skills, narrative, CTA
- Blog index tag filter pills (client island); article count in intro
- `ArticleCard` — `primaryTag`, `readTimeMinutes` metadata slots

**Changed**

- About page — alternating `SectionBand` rhythm, `SiteFooter`, engineering profile IA (no biography wall)
- Blog index + article pages — platform nav/footer, WRITING eyebrow, `ContentWidth` article body
- `BlogPostClient` — `BLOG_PROSE_CLASS` from `blog-prose.ts` (replaces inline `BLOG_ARTICLE_CLASS`)
- `getAllPosts` includes content server-side for read-time computation only

**Removed**

- `AboutContentClient.tsx` — animated paragraph wall replaced by server sections

---

## Visual Redesign — Phase 4 case study presentation

**Added**

- `Heading` — `variant="display"` for case study hero titles
- `ProjectPageSection` — optional `eyebrow` prop (accent section labels)
- Case study `SectionBand` rhythm inside `CaseStudyPage` (summary, story, platform, links)

**Changed**

- `ProjectDetailHero` — display heading, project-type eyebrow, primary + outline CTAs
- `ProjectSummary` — elevated surface card, restrained category badges
- `ProjectMetrics` / `MetricCard` — evidence-focused border-first cards with label eyebrows and restrained accent icons
- `ProjectStory` blocks — `Label` eyebrows on scannable story cards
- `ProjectEvolution` — EVOLUTION eyebrow, “How it evolved” title, timeline spacing
- `PlatformShowcase` / `ProjectGallery` — section eyebrows, border-first cards
- `ProjectPageFooter` — LINKS eyebrow, restrained inline actions
- `projects/[slug]/page.tsx` — `SiteFooter`, container shell (IA order unchanged)

**Changed (Phase 4 review)**

- `MetricCard` — restored optional restrained icons (bordered accent chip) for metric scannability; `metric-icons` extended for Storybook, accessibility, implementation/planned work
- `PlatformShowcase` — header block inset (`px-5 md:px-6`) aligned with capability card content

---

## Visual Redesign — Phase 5 polish

**Added**

- `src/lib/motion/use-reduced-motion.ts` — SSR-safe `useReducedMotion` hook for client animation islands

**Changed**

- Animation components (`AnimatedSection`, `AnimatedWrapper`, `AnimateHeading`, `AnimatedParagraphs`, `AnimatedCodeClient`) — honor `prefers-reduced-motion`; slightly reduced entry motion on home sections
- `TerminalLoader` — Candidate C accent tokens (`text-ds-accent`, `bg-ds-accent/15`); static terminal when reduced motion; decorative pulse/entry gated
- `NavigationMobile` — instant drawer when reduced motion
- `blogWrapper` — tag filter `aria-pressed`; 44px min touch height on mobile filter pills; focus ring on article links; static grid when reduced motion
- `BlogCard`, `PortfolioSectionClient` — reduced-motion static cards; subtler hover lift; focus-within parity on card patterns
- `ArticleCard` / `ProjectCard` — `group-focus-within` affordances; `motion-reduce:transform-none` on image scale
- `Hero` — subtitle uses `text-ds-accent`
- `tokens.css` — disables `animate-in` / `animate-pulse` under reduced motion
- `AnimatedParagraphs` — CSS module migrated to Tailwind utilities

**Removed**

- `animations.module.css` (typography utilities inlined in `AnimatedParagraphs`)

---

## Visual Redesign — Phase 6 validation + documentation

**Changed**

- `docs/design-system.md` — synced with shipped visual redesign: Candidate C tokens, `SectionBand`, `Heading display`, client boundaries, reduced motion, post-redesign deferred table
- Program acceptance: V1 architecture unchanged; no schema migrations; ESLint boundaries unchanged

**Validation (automated)**

- `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build` — pass at program sign-off
- Storybook dev catalog spot-check (`npm run storybook`); `build-storybook` remains local-only (not CI)
