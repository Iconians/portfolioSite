/** Shared presentation tokens aligned with public portfolio pages (Home, About, Articles). */
export const projectPageStyles = {
  page: "min-h-screen w-full bg-background text-foreground",
  sectionHeaderGap: "mb-6 md:mb-8",
  card: "rounded-xl border border-border bg-card text-card-foreground shadow-sm",
  /** Nested content sitting on an elevated section surface. */
  innerSurface:
    "rounded-xl border border-[var(--blog-card-border)] bg-[var(--card-inner-bg)]",
  cardElevated:
    "rounded-xl border border-[var(--blog-card-border)] bg-[var(--card-inner-bg)] text-[var(--text-primary)]",
  cardPadding: "p-5 md:p-6",
  panelHighlight:
    "rounded-xl border border-[var(--blog-card-border)] bg-[var(--card-inner-bg)] shadow-sm",
  /** Bridge for domain components — migrate to Text in Phase 8. */
  sectionDescription: "text-lg text-muted-foreground",
  subsectionTitle: "text-base font-semibold text-[var(--heading-color)]",
  eyebrow: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
  body: "text-[0.9375rem] leading-7 text-muted-foreground",
  bodyLarge: "text-base leading-7 text-muted-foreground md:text-lg md:leading-8",
  metricLabel: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
  metricValue: "text-2xl font-semibold tracking-tight text-[var(--heading-color)] md:text-[1.75rem]",
  iconWrap: "flex h-8 w-8 shrink-0 items-center justify-center text-primary",
} as const;

export type { ContentWidthVariant as ProjectSectionWidth } from "@/components/layout/ContentWidth";
