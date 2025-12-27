import { db } from "@/lib/db/client";
import { requireAdmin } from "@/lib/permissions";
import type {
  CreatePortfolioInput,
  UpdatePortfolioInput,
  PortfolioItem,
  PortfolioItemWithUser,
} from "@/lib/types/portfolio";
import { PortfolioItemSchema } from "@/lib/types/portfolio";

// Public queries
export async function getAllPortfolioItems(): Promise<PortfolioItem[]> {
  return db.portfolio.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      img: true,
      caption: true,
      description: true,
      category: true,
      url: true,
      github: true,
      createdAt: true,
      updatedAt: true,
      createdBy: true,
    },
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

  return db.portfolio.create({
    data: {
      ...validatedData,
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

  return db.portfolio.update({
    where: { id },
    data: {
      ...validatedData,
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
