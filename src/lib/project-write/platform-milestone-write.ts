import "server-only";

import { AdminProjectLoadError } from "./admin-project-load-error";
import {
  buildPlatformMilestoneCreateRequest,
  buildPlatformMilestoneUpdateRequest,
  mapPlatformAdminMilestoneToProjectVersion,
} from "./platform-milestone-mapper";
import { resolvePlatformCaseStudyWriteContext } from "./platform-parent-context";

import type {
  ProjectVersion,
  ProjectVersionInput,
  ProjectVersionUpdate,
} from "@/lib/types/portfolio";

function nextMilestoneSortOrder(milestones: { sort_order: number }[]): number {
  if (milestones.length === 0) {
    return 0;
  }
  return Math.max(...milestones.map((milestone) => milestone.sort_order)) + 1;
}

async function assertMilestoneBelongsToCaseStudy(
  context: Awaited<ReturnType<typeof resolvePlatformCaseStudyWriteContext>>,
  milestoneId: string
): Promise<void> {
  const detail = await context.client.getCaseStudyById(context.platformCaseStudyId);
  const owned =
    detail.milestones?.some((milestone) => milestone.id === milestoneId) ?? false;
  if (!owned) {
    throw new AdminProjectLoadError(
      "Platform milestone not found for this project"
    );
  }
}

export async function createProjectVersionViaPlatform(
  portfolioLocalId: string,
  input: ProjectVersionInput
): Promise<ProjectVersion> {
  const context = await resolvePlatformCaseStudyWriteContext(portfolioLocalId);
  const detail = await context.client.getCaseStudyById(context.platformCaseStudyId);
  const sortOrder =
    input.sortOrder ?? nextMilestoneSortOrder(detail.milestones ?? []);
  const created = await context.client.createMilestone(
    context.platformCaseStudyId,
    buildPlatformMilestoneCreateRequest(input, sortOrder)
  );
  return mapPlatformAdminMilestoneToProjectVersion(
    created,
    context.portfolioLocalId
  );
}

export async function updateProjectVersionViaPlatform(
  portfolioLocalId: string,
  milestoneId: string,
  input: ProjectVersionUpdate
): Promise<ProjectVersion> {
  const context = await resolvePlatformCaseStudyWriteContext(portfolioLocalId);
  await assertMilestoneBelongsToCaseStudy(context, milestoneId);
  const updated = await context.client.updateMilestone(
    milestoneId,
    buildPlatformMilestoneUpdateRequest(input)
  );
  return mapPlatformAdminMilestoneToProjectVersion(
    updated,
    context.portfolioLocalId
  );
}

export async function deleteProjectVersionViaPlatform(
  portfolioLocalId: string,
  milestoneId: string
): Promise<void> {
  const context = await resolvePlatformCaseStudyWriteContext(portfolioLocalId);
  await assertMilestoneBelongsToCaseStudy(context, milestoneId);
  await context.client.deleteMilestone(milestoneId);
}
