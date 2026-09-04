import { slugifyTitle } from "@/lib/portfolio/slug";

import { PlatformSlugImmutableError } from "./platform-update-errors";

import type {
  PlatformApiCaseStudyPatchRequest,
  PlatformApiM3ContentItemKind,
} from "./platform-admin-patch-types";
import type {
  CreatePortfolioInput,
  PortfolioExtendedInput,
} from "@/lib/types/portfolio";

const ENGINEERING_AUDIENCE = "engineering";

function normalizeNullableText(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function formatDateForPlatform(
  value: Date | null | undefined
): string | null {
  if (!value) {
    return null;
  }
  return value.toISOString().slice(0, 10);
}

function parseHighlightsToTechnologies(
  highlights: string | null | undefined
): PlatformApiCaseStudyPatchRequest["technologies"] {
  if (!highlights?.trim()) {
    return [];
  }

  return highlights
    .split("•")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
    .map((name) => ({ name }));
}

function mapCategories(
  categories: string[]
): NonNullable<PlatformApiCaseStudyPatchRequest["categories"]> {
  return categories.map((name) => {
    const trimmed = name.trim();
    return {
      name: trimmed,
      slug: slugifyTitle(trimmed),
    };
  });
}

function mapLinks(input: {
  url?: string | null;
  github?: string | null;
  docs?: string | null;
}): NonNullable<PlatformApiCaseStudyPatchRequest["links"]> {
  const links: NonNullable<PlatformApiCaseStudyPatchRequest["links"]> = [];
  if (input.url?.trim()) {
    links.push({ link_type: "live", url: input.url.trim() });
  }
  if (input.github?.trim()) {
    links.push({ link_type: "github", url: input.github.trim() });
  }
  if (input.docs?.trim()) {
    links.push({ link_type: "docs", url: input.docs.trim() });
  }
  return links;
}

function mapContentItemPatch(
  extended: PortfolioExtendedInput
): Pick<
  PlatformApiCaseStudyPatchRequest,
  "content_items" | "content_item_kinds_to_replace"
> {
  const kindsToReplace: PlatformApiM3ContentItemKind[] = [];
  const items: NonNullable<PlatformApiCaseStudyPatchRequest["content_items"]> =
    [];

  if (extended.features !== undefined) {
    kindsToReplace.push("feature");
    for (const text of extended.features) {
      const trimmed = text.trim();
      if (trimmed) {
        items.push({ kind: "feature", audience: ENGINEERING_AUDIENCE, text: trimmed });
      }
    }
  }

  if (extended.responsibilities !== undefined) {
    kindsToReplace.push("responsibility");
    for (const text of extended.responsibilities) {
      const trimmed = text.trim();
      if (trimmed) {
        items.push({
          kind: "responsibility",
          audience: ENGINEERING_AUDIENCE,
          text: trimmed,
        });
      }
    }
  }

  if (extended.platformFeatures !== undefined) {
    kindsToReplace.push("capability");
    for (const text of extended.platformFeatures) {
      const trimmed = text.trim();
      if (trimmed) {
        items.push({
          kind: "capability",
          audience: ENGINEERING_AUDIENCE,
          text: trimmed,
        });
      }
    }
  }

  if (kindsToReplace.length === 0) {
    return {};
  }

  return {
    content_item_kinds_to_replace: kindsToReplace,
    content_items: items,
  };
}

function mapStoryScalars(
  extended: PortfolioExtendedInput
): Pick<
  PlatformApiCaseStudyPatchRequest,
  | "problem"
  | "solution"
  | "architecture"
  | "challenges"
  | "lessons_learned"
  | "future_improvements"
> {
  return {
    problem: normalizeNullableText(extended.problem ?? undefined),
    solution: normalizeNullableText(extended.solution ?? undefined),
    architecture: normalizeNullableText(extended.architecture ?? undefined),
    challenges: normalizeNullableText(extended.challenges ?? undefined),
    lessons_learned: normalizeNullableText(extended.lessonsLearned ?? undefined),
    future_improvements: normalizeNullableText(
      extended.futureImprovements ?? undefined
    ),
  };
}

export function buildPlatformCaseStudyPatchRequest(input: {
  legacy: CreatePortfolioInput;
  extended: PortfolioExtendedInput;
  originalSlug: string;
}): PlatformApiCaseStudyPatchRequest {
  const requestedSlug = input.extended.slug?.trim();
  if (requestedSlug && requestedSlug !== input.originalSlug) {
    throw new PlatformSlugImmutableError();
  }

  const summary =
    normalizeNullableText(input.extended.summary) ??
    normalizeNullableText(input.legacy.description);

  const projectType = input.legacy.projectType?.trim();

  return {
    title: input.legacy.caption,
    subtitle: normalizeNullableText(input.extended.subtitle),
    summary,
    ...mapStoryScalars(input.extended),
    project_type: projectType ? projectType : null,
    start_date: formatDateForPlatform(input.extended.startDate ?? undefined),
    end_date: formatDateForPlatform(input.extended.endDate ?? undefined),
    seo_title: normalizeNullableText(input.extended.seoTitle ?? undefined),
    seo_description: normalizeNullableText(input.extended.seoDescription ?? undefined),
    technologies: parseHighlightsToTechnologies(input.legacy.highlights),
    categories: mapCategories(input.legacy.category),
    links: mapLinks({
      url: input.legacy.url,
      github: input.legacy.github,
      docs: input.extended.docs,
    }),
    ...mapContentItemPatch(input.extended),
  };
}
