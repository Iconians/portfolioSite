import { db } from "@/lib/db/client";
import { requireAdmin } from "@/lib/permissions";
import {
  ProjectVersionInputSchema,
  ProjectVersionUpdateSchema,
} from "@/lib/types/portfolio";

import type {
  ProjectVersion,
  ProjectVersionInput,
  ProjectVersionUpdate,
} from "@/lib/types/portfolio";

export async function listProjectVersions(
  portfolioId: string
): Promise<ProjectVersion[]> {
  await requireAdmin();
  return db.projectVersion.findMany({
    where: { portfolioId },
    orderBy: [{ sortOrder: "asc" }, { year: "asc" }, { createdAt: "asc" }],
  });
}

export async function listPublicProjectVersions(
  portfolioId: string
): Promise<ProjectVersion[]> {
  return db.projectVersion.findMany({
    where: { portfolioId },
    orderBy: [{ sortOrder: "asc" }, { year: "asc" }, { createdAt: "asc" }],
  });
}

export async function createProjectVersionRecord(
  portfolioId: string,
  input: ProjectVersionInput
): Promise<ProjectVersion> {
  await requireAdmin();
  const data = ProjectVersionInputSchema.parse(input);

  return db.projectVersion.create({
    data: {
      portfolioId,
      year: data.year,
      version: data.version,
      title: data.title,
      description: data.description ?? null,
      sortOrder: data.sortOrder ?? 0,
    },
  });
}

export async function updateProjectVersionRecord(
  id: string,
  input: ProjectVersionUpdate
): Promise<ProjectVersion> {
  await requireAdmin();
  const data = ProjectVersionUpdateSchema.parse(input);

  return db.projectVersion.update({
    where: { id },
    data,
  });
}

export async function deleteProjectVersionRecord(id: string): Promise<void> {
  await requireAdmin();
  await db.projectVersion.delete({ where: { id } });
}

export async function getProjectVersionById(
  id: string
): Promise<ProjectVersion | null> {
  await requireAdmin();
  return db.projectVersion.findUnique({ where: { id } });
}

export async function countProjectVersions(portfolioId: string): Promise<number> {
  await requireAdmin();
  return db.projectVersion.count({ where: { portfolioId } });
}

export async function getNextProjectVersionSortOrder(
  portfolioId: string
): Promise<number> {
  await requireAdmin();
  const latest = await db.projectVersion.findFirst({
    where: { portfolioId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  return (latest?.sortOrder ?? -1) + 1;
}
