import type {
  CreatePortfolioInput,
  PortfolioExtendedInput,
  PortfolioItem,
  UpdatePortfolioInput,
} from "@/lib/types/portfolio";
import {
  ProjectEditorSchema,
  type ProjectEditorFormData,
} from "@/lib/types/portfolio";
import { normalizePlatformFeatures } from "@/lib/portfolio/platform";

function formatDateInputValue(value: Date | null | undefined): string {
  if (!value) {
    return "";
  }

  return value.toISOString().slice(0, 10);
}

function parseOptionalDate(value: string | undefined): Date | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!value.trim()) {
    return null;
  }

  return new Date(`${value}T00:00:00.000Z`);
}

function normalizeStoryField(value: string | undefined): string | null {
  if (value === undefined) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function mapPortfolioItemToEditorValues(
  item?: Partial<PortfolioItem>
): ProjectEditorFormData {
  return {
    img: item?.img ?? "",
    caption: item?.caption ?? "",
    description: item?.description ?? "",
    category: item?.category?.length ? item.category : [""],
    url: item?.url ?? undefined,
    github: item?.github ?? undefined,
    keyFeatures: item?.keyFeatures ?? "",
    role: item?.role ?? "",
    highlights: item?.highlights ?? "",
    projectType: (item?.projectType ?? "") as ProjectEditorFormData["projectType"],
    slug: item?.slug ?? "",
    subtitle: item?.subtitle ?? "",
    summary: item?.summary ?? "",
    problem: item?.problem ?? "",
    solution: item?.solution ?? "",
    architecture: item?.architecture ?? "",
    challenges: item?.challenges ?? "",
    lessonsLearned: item?.lessonsLearned ?? "",
    futureImprovements: item?.futureImprovements ?? "",
    lifecycleStatus: (item?.lifecycleStatus ?? "active") as ProjectEditorFormData["lifecycleStatus"],
    publishStatus: (item?.publishStatus ?? "published") as ProjectEditorFormData["publishStatus"],
    startDate: formatDateInputValue(item?.startDate),
    endDate: formatDateInputValue(item?.endDate),
    sortOrder: item?.sortOrder ?? 0,
    gallery: item?.gallery ?? [],
    features: item?.features ?? [],
    responsibilities: item?.responsibilities ?? [],
    seoTitle: item?.seoTitle ?? "",
    seoDescription: item?.seoDescription ?? "",
    docs: item?.docs ?? undefined,
    heroMediaId: item?.heroMediaId ?? null,
    ogMediaId: item?.ogMediaId ?? null,
    showPlatformSection: item?.showPlatformSection ?? false,
    platformFeatures: item?.platformFeatures ?? [],
  };
}

export function splitProjectEditorPayload(data: ProjectEditorFormData): {
  legacy: CreatePortfolioInput;
  extended: PortfolioExtendedInput;
} {
  const parsed = ProjectEditorSchema.parse(data);

  const legacy: CreatePortfolioInput = {
    img: parsed.img,
    caption: parsed.caption,
    description: parsed.description,
    category: parsed.category.filter((entry) => entry.trim().length > 0),
    url: parsed.url,
    github: parsed.github,
    keyFeatures: parsed.keyFeatures,
    role: parsed.role,
    highlights: parsed.highlights,
    projectType: parsed.projectType,
  };

  const extended: PortfolioExtendedInput = {
    slug: parsed.slug?.trim() ? parsed.slug.trim() : undefined,
    subtitle: parsed.subtitle?.trim() ? parsed.subtitle : undefined,
    summary: parsed.summary?.trim() ? parsed.summary : undefined,
    problem: normalizeStoryField(parsed.problem),
    solution: normalizeStoryField(parsed.solution),
    architecture: normalizeStoryField(parsed.architecture),
    challenges: normalizeStoryField(parsed.challenges),
    lessonsLearned: normalizeStoryField(parsed.lessonsLearned),
    futureImprovements: normalizeStoryField(parsed.futureImprovements),
    lifecycleStatus: parsed.lifecycleStatus,
    publishStatus: parsed.publishStatus,
    startDate: parseOptionalDate(parsed.startDate),
    endDate: parseOptionalDate(parsed.endDate),
    sortOrder: parsed.sortOrder,
    gallery: parsed.gallery,
    features: parsed.features.filter((entry) => entry.trim().length > 0),
    responsibilities: parsed.responsibilities.filter(
      (entry) => entry.trim().length > 0
    ),
    seoTitle: parsed.seoTitle?.trim() ? parsed.seoTitle : undefined,
    seoDescription: parsed.seoDescription?.trim()
      ? parsed.seoDescription
      : undefined,
    docs: parsed.docs,
    heroMediaId: parsed.heroMediaId ?? null,
    ogMediaId: parsed.ogMediaId ?? null,
    showPlatformSection: parsed.showPlatformSection,
    platformFeatures: normalizePlatformFeatures(
      parsed.platformFeatures.filter((entry) => entry.trim().length > 0)
    ),
  };

  return { legacy, extended };
}

export function toUpdatePayload(data: ProjectEditorFormData): {
  legacy: UpdatePortfolioInput;
  extended: PortfolioExtendedInput;
} {
  const { legacy, extended } = splitProjectEditorPayload(data);
  return { legacy, extended };
}
