/**
 * Canonical case study information architecture (Phase 6).
 *
 * Defines section order, nav ids, and omit rules for `/projects/[slug]`.
 * Visual rendering stays in existing Portfolio domain components; this module
 * is layout rules only — no UI.
 *
 * Phase 8 duplication inventory (do not fix here):
 * - Summary embeds technology badges; `ProjectTechnologies` exists but is unused on the route
 * - Story subsections use shared typography and Surface primitives
 * - `ProjectGallery` inline grid (Phase 7 lightbox pattern)
 * - Home/reviews section headers outside typography primitives
 *
 * Deferred V1:
 * - Related articles section (no schema consumer on project pages)
 * - Dedicated technology section via `ProjectTechnologies` (summary shows badges today)
 */

import { hasProjectGallery } from "@/lib/portfolio/gallery";
import { shouldShowPlatformShowcase } from "@/lib/portfolio/platform";
import { hasProjectEvolution } from "@/lib/portfolio/project-evolution";
import { hasProjectMetrics } from "@/lib/portfolio/project-metrics";
import { hasProjectStoryContent } from "@/lib/portfolio/project-story";
import {
  getProjectCardSummary,
  isValidProjectLink,
  uniqueCategories,
} from "@/lib/portfolio/public-project";

import type { PortfolioItem, PortfolioMetric, ProjectVersion } from "@/lib/types/portfolio";

export type CaseStudySectionKey =
  | "preview-banner"
  | "hero"
  | "summary"
  | "metrics"
  | "story"
  | "evolution"
  | "platform"
  | "gallery"
  | "links";

export interface CaseStudySectionDefinition {
  key: CaseStudySectionKey;
  /** Stable nav anchor when the section exposes `id` on the page. */
  id?: string;
  /** Human-readable label for docs and admin tooling. */
  label: string;
  shouldInclude: (context: CaseStudyLayoutContext) => boolean;
}

export interface CaseStudyLayoutContext {
  project: PortfolioItem;
  metrics: PortfolioMetric[];
  versions: ProjectVersion[];
  isPreview: boolean;
}

export function hasProjectSummary(project: PortfolioItem): boolean {
  const summary = getProjectCardSummary(project);
  const technologies = uniqueCategories(project.category);

  return summary.trim().length > 0 || technologies.length > 0;
}

function shouldIncludeLinks(project: PortfolioItem): boolean {
  return (
    isValidProjectLink(project.url) ||
    isValidProjectLink(project.github) ||
    isValidProjectLink(project.docs)
  );
}

/** Canonical section registry — order is the public case study IA. */
export const CASE_STUDY_SECTIONS: readonly CaseStudySectionDefinition[] = [
  {
    key: "preview-banner",
    label: "Admin preview banner",
    shouldInclude: (context) => context.isPreview,
  },
  {
    key: "hero",
    label: "Hero",
    shouldInclude: () => true,
  },
  {
    key: "summary",
    id: "summary",
    label: "Summary",
    shouldInclude: (context) => hasProjectSummary(context.project),
  },
  {
    key: "metrics",
    id: "metrics",
    label: "Metrics",
    shouldInclude: (context) => hasProjectMetrics(context.metrics),
  },
  {
    key: "story",
    id: "story",
    label: "Engineering story",
    shouldInclude: (context) => hasProjectStoryContent(context.project),
  },
  {
    key: "evolution",
    id: "evolution",
    label: "Timeline",
    shouldInclude: (context) => hasProjectEvolution(context.versions),
  },
  {
    key: "platform",
    id: "platform",
    label: "Platform capabilities",
    shouldInclude: (context) =>
      shouldShowPlatformShowcase({
        showPlatformSection: context.project.showPlatformSection,
        platformFeatures: context.project.platformFeatures,
      }),
  },
  {
    key: "gallery",
    id: "gallery",
    label: "Case study media",
    shouldInclude: (context) => hasProjectGallery(context.project.gallery),
  },
  {
    key: "links",
    id: "links",
    label: "Project links",
    shouldInclude: (context) => shouldIncludeLinks(context.project),
  },
];

export function getVisibleCaseStudySections(
  context: CaseStudyLayoutContext
): CaseStudySectionDefinition[] {
  return CASE_STUDY_SECTIONS.filter((section) => section.shouldInclude(context));
}

export function getCaseStudySectionKeys(
  context: CaseStudyLayoutContext
): CaseStudySectionKey[] {
  return getVisibleCaseStudySections(context).map((section) => section.key);
}
