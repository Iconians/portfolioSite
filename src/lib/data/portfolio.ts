import { db } from "@/lib/db/client";
import { requireAdmin } from "@/lib/permissions";
import { assignPortfolioSlug } from "@/lib/portfolio/assign-slug";
import { validatePortfolioExtendedInput } from "@/lib/portfolio/validate-extended";
import {
  mapPortfolioRecord,
  PortfolioItemSchema,
  portfolioItemSelect,
  PROJECT_TYPE_ORDER,
} from "@/lib/types/portfolio";

import type {
  CreatePortfolioInput,
  PortfolioExtendedInput,
  PortfolioItem,
  PortfolioItemWithUser,
  UpdatePortfolioInput,
} from "@/lib/types/portfolio";

function normalizeProjectType(
  projectType: CreatePortfolioInput["projectType"] | undefined
): string | null | undefined {
  if (projectType === undefined) {
    return undefined;
  }

  return projectType === "" ? null : projectType ?? null;
}

function buildExtendedWriteData(input: PortfolioExtendedInput) {
  const validated = validatePortfolioExtendedInput(input);
  const platform =
    validated.showPlatformSection !== undefined ||
    validated.platformFeatures !== undefined
      ? {
          showPlatformSection: validated.showPlatformSection ?? false,
          platformFeatures: validated.platformFeatures ?? [],
        }
      : undefined;

  return {
    ...(validated.slug !== undefined && { slug: validated.slug }),
    ...(validated.subtitle !== undefined && { subtitle: validated.subtitle }),
    ...(validated.summary !== undefined && { summary: validated.summary }),
    ...(validated.problem !== undefined && { problem: validated.problem }),
    ...(validated.solution !== undefined && { solution: validated.solution }),
    ...(validated.architecture !== undefined && {
      architecture: validated.architecture,
    }),
    ...(validated.challenges !== undefined && { challenges: validated.challenges }),
    ...(validated.lessonsLearned !== undefined && {
      lessonsLearned: validated.lessonsLearned,
    }),
    ...(validated.futureImprovements !== undefined && {
      futureImprovements: validated.futureImprovements,
    }),
    ...(validated.lifecycleStatus !== undefined && {
      lifecycleStatus: validated.lifecycleStatus,
    }),
    ...(validated.publishStatus !== undefined && {
      publishStatus: validated.publishStatus,
    }),
    ...(validated.startDate !== undefined && { startDate: validated.startDate }),
    ...(validated.endDate !== undefined && { endDate: validated.endDate }),
    ...(validated.sortOrder !== undefined && { sortOrder: validated.sortOrder }),
    ...(validated.gallery !== undefined && { gallery: validated.gallery }),
    ...(validated.features !== undefined && { features: validated.features }),
    ...(validated.responsibilities !== undefined && {
      responsibilities: validated.responsibilities,
    }),
    ...(platform && {
      showPlatformSection: platform.showPlatformSection,
      platformFeatures: platform.platformFeatures,
    }),
    ...(validated.seoTitle !== undefined && { seoTitle: validated.seoTitle }),
    ...(validated.seoDescription !== undefined && {
      seoDescription: validated.seoDescription,
    }),
    ...(validated.docs !== undefined && { docs: validated.docs }),
    ...(validated.heroMediaId !== undefined && {
      heroMediaId: validated.heroMediaId,
    }),
    ...(validated.ogMediaId !== undefined && { ogMediaId: validated.ogMediaId }),
  };
}

function sortPortfolioItems(items: PortfolioItem[]): PortfolioItem[] {
  return [...items].sort((a, b) => {
    const typeOrder = (type: string | null | undefined) => {
      const t = type?.toLowerCase?.() ?? type ?? "";
      if (!t) {return PROJECT_TYPE_ORDER.length;}
      const i = PROJECT_TYPE_ORDER.indexOf(t as (typeof PROJECT_TYPE_ORDER)[number]);
      return i === -1 ? PROJECT_TYPE_ORDER.length : i;
    };
    const orderA = typeOrder(a.projectType);
    const orderB = typeOrder(b.projectType);
    if (orderA !== orderB) {return orderA - orderB;}
    if (a.sortOrder !== b.sortOrder) {return a.sortOrder - b.sortOrder;}
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

// Public queries
export async function getAllPortfolioItems(): Promise<PortfolioItem[]> {
  const items = await db.portfolio.findMany({
    orderBy: { createdAt: "desc" },
    select: portfolioItemSelect,
  });

  return sortPortfolioItems(items.map(mapPortfolioRecord));
}

export async function getPublishedPortfolioItems(): Promise<PortfolioItem[]> {
  const items = await db.portfolio.findMany({
    where: { publishStatus: "published" },
    orderBy: { createdAt: "desc" },
    select: portfolioItemSelect,
  });

  return sortPortfolioItems(items.map(mapPortfolioRecord));
}

export async function getPublishedPortfolioItemBySlug(
  slug: string
): Promise<PortfolioItem | null> {
  const item = await db.portfolio.findFirst({
    where: { slug, publishStatus: "published" },
    select: portfolioItemSelect,
  });

  return item ? mapPortfolioRecord(item) : null;
}

export async function getPortfolioItemById(
  id: string
): Promise<PortfolioItemWithUser | null> {
  await requireAdmin();

  const item = await db.portfolio.findUnique({
    where: { id },
    select: {
      ...portfolioItemSelect,
      createdByUser: {
        select: { email: true },
      },
    },
  });

  return item ? mapPortfolioRecord(item) : null;
}

export async function getPortfolioItemBySlug(
  slug: string
): Promise<PortfolioItem | null> {
  const item = await db.portfolio.findUnique({
    where: { slug },
    select: portfolioItemSelect,
  });

  return item ? mapPortfolioRecord(item) : null;
}

export async function resolveHeroMediaIdFromImg(
  img: string
): Promise<string | null> {
  const asset = await db.mediaAsset.findFirst({
    where: { publicUrl: img },
    select: { id: true },
  });

  return asset?.id ?? null;
}

export async function updatePortfolioItemRecord(
  id: string,
  data: Record<string, unknown>
): Promise<PortfolioItem> {
  const item = await db.portfolio.update({
    where: { id },
    data,
    select: portfolioItemSelect,
  });

  return mapPortfolioRecord(item);
}

// Admin-only mutations
export async function createPortfolioItem(
  data: CreatePortfolioInput,
  extended?: PortfolioExtendedInput
): Promise<PortfolioItem> {
  const user = await requireAdmin();

  const validatedData = PortfolioItemSchema.parse(data);
  const projectType = normalizeProjectType(validatedData.projectType);
  const slug = await assignPortfolioSlug(
    validatedData.caption,
    extended?.slug,
    undefined
  );
  const heroMediaId =
    extended?.heroMediaId ??
    (await resolveHeroMediaIdFromImg(validatedData.img));

  const item = await db.portfolio.create({
    data: {
      ...validatedData,
      projectType: projectType ?? null,
      slug,
      heroMediaId,
      createdBy: user.id,
      ...buildExtendedWriteData(extended ?? {}),
    },
    select: portfolioItemSelect,
  });

  return mapPortfolioRecord(item);
}

export async function updatePortfolioItem(
  id: string,
  data: UpdatePortfolioInput,
  extended?: PortfolioExtendedInput
): Promise<PortfolioItem> {
  await requireAdmin();

  const item = await db.portfolio.findUnique({ where: { id } });
  if (!item) {
    throw new Error("Portfolio item not found");
  }

  const validatedData = PortfolioItemSchema.partial().parse(data);
  const projectType = normalizeProjectType(validatedData.projectType);
  const nextCaption = validatedData.caption ?? item.caption;
  const slug =
    extended?.slug !== undefined
      ? await assignPortfolioSlug(nextCaption, extended.slug, id)
      : item.slug ??
        (await assignPortfolioSlug(nextCaption, undefined, id));

  const nextImg = validatedData.img ?? item.img;
  let heroMediaId: string | null | undefined;
  if (extended?.heroMediaId !== undefined) {
    heroMediaId = extended.heroMediaId;
  } else if (validatedData.img !== undefined) {
    heroMediaId = await resolveHeroMediaIdFromImg(nextImg);
  }

  const updated = await db.portfolio.update({
    where: { id },
    data: {
      ...validatedData,
      ...(projectType !== undefined && { projectType }),
      slug,
      ...(heroMediaId !== undefined && { heroMediaId }),
      ...buildExtendedWriteData(extended ?? {}),
      updatedAt: new Date(),
    },
    select: portfolioItemSelect,
  });

  if (
    validatedData.img !== undefined &&
    heroMediaId === null &&
    nextImg
  ) {
    const linkedHeroMediaId = await resolveHeroMediaIdFromImg(nextImg);
    if (linkedHeroMediaId) {
      return updatePortfolioItemRecord(id, { heroMediaId: linkedHeroMediaId });
    }
  }

  return mapPortfolioRecord(updated);
}

export async function deletePortfolioItem(id: string): Promise<void> {
  await requireAdmin();

  const item = await db.portfolio.findUnique({ where: { id } });
  if (!item) {
    throw new Error("Portfolio item not found");
  }

  await db.portfolio.delete({ where: { id } });
}
