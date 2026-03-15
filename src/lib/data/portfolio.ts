import { db } from "@/lib/db/client";
import { requireAdmin } from "@/lib/permissions";
import type {
  CreatePortfolioInput,
  UpdatePortfolioInput,
  PortfolioItem,
  PortfolioItemWithUser,
} from "@/lib/types/portfolio";
import { PortfolioItemSchema, PROJECT_TYPE_ORDER } from "@/lib/types/portfolio";

// Public queries
export async function getAllPortfolioItems(): Promise<PortfolioItem[]> {
  const items = await db.portfolio.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      img: true,
      caption: true,
      description: true,
      category: true,
      url: true,
      github: true,
      keyFeatures: true,
      role: true,
      highlights: true,
      projectType: true,
      createdAt: true,
      updatedAt: true,
      createdBy: true,
    },
  });
  // Sort by project type order: 1 SaaS → 2 Client → 3 Engineering → 4 Personal (unset/NULL last), then by createdAt desc within same type
  return [...items].sort((a, b) => {
    const typeOrder = (type: string | null | undefined) => {
      const t = type?.toLowerCase?.() ?? type ?? "";
      if (!t) return PROJECT_TYPE_ORDER.length;
      const i = PROJECT_TYPE_ORDER.indexOf(t as (typeof PROJECT_TYPE_ORDER)[number]);
      return i === -1 ? PROJECT_TYPE_ORDER.length : i;
    };
    const orderA = typeOrder(a.projectType);
    const orderB = typeOrder(b.projectType);
    if (orderA !== orderB) return orderA - orderB;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export async function getPortfolioItemById(
  id: string
): Promise<PortfolioItemWithUser | null> {
  return db.portfolio.findUnique({
    where: { id },
    include: {
      createdByUser: {
        select: { email: true },
      },
    },
  });
}

// Admin-only mutations
export async function createPortfolioItem(
  data: CreatePortfolioInput
): Promise<PortfolioItem> {
  const user = await requireAdmin();

  const validatedData = PortfolioItemSchema.parse(data);
  const projectType =
    validatedData.projectType === "" ? null : validatedData.projectType ?? null;

  return db.portfolio.create({
    data: {
      ...validatedData,
      projectType,
      createdBy: user.id,
    },
  });
}

export async function updatePortfolioItem(
  id: string,
  data: UpdatePortfolioInput
): Promise<PortfolioItem> {
  const user = await requireAdmin();

  const item = await db.portfolio.findUnique({ where: { id } });
  if (!item) {
    throw new Error("Portfolio item not found");
  }

  // requireAdmin() already ensures admin access, so we allow the update
  // Optionally, we could add ownership checks here if needed

  const validatedData = PortfolioItemSchema.partial().parse(data);
  const projectType =
    validatedData.projectType !== undefined
      ? validatedData.projectType === ""
        ? null
        : validatedData.projectType
      : undefined;

  return db.portfolio.update({
    where: { id },
    data: {
      ...validatedData,
      ...(projectType !== undefined && { projectType }),
      updatedAt: new Date(),
    },
  });
}

export async function deletePortfolioItem(id: string): Promise<void> {
  const user = await requireAdmin();

  const item = await db.portfolio.findUnique({ where: { id } });
  if (!item) {
    throw new Error("Portfolio item not found");
  }

  // requireAdmin() already ensures admin access, so we allow the delete

  await db.portfolio.delete({ where: { id } });
}
