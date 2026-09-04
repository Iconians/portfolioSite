import type {
  PlatformApiMilestoneCreateRequest,
  PlatformApiMilestoneUpdateRequest,
  PlatformApiAdminMilestone,
} from "./platform-milestone-types";
import type {
  ProjectVersion,
  ProjectVersionInput,
  ProjectVersionUpdate,
} from "@/lib/types/portfolio";

function milestoneTimestamp(): Date {
  return new Date();
}

export function mapPlatformAdminMilestoneToProjectVersion(
  milestone: PlatformApiAdminMilestone,
  portfolioLocalId: string
): ProjectVersion {
  const timestamp = milestoneTimestamp();
  return {
    id: milestone.id,
    portfolioId: portfolioLocalId,
    year: milestone.year ?? 0,
    version: milestone.version ?? "",
    title: milestone.title,
    description: milestone.description ?? null,
    sortOrder: milestone.sort_order,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function mapPlatformAdminMilestonesToProjectVersions(
  milestones: PlatformApiAdminMilestone[] | undefined,
  portfolioLocalId: string
): ProjectVersion[] {
  return [...(milestones ?? [])]
    .sort((left, right) => {
      const orderDiff = left.sort_order - right.sort_order;
      if (orderDiff !== 0) {
        return orderDiff;
      }
      return left.id.localeCompare(right.id);
    })
    .map((milestone) =>
      mapPlatformAdminMilestoneToProjectVersion(milestone, portfolioLocalId)
    );
}

export function buildPlatformMilestoneCreateRequest(
  input: ProjectVersionInput,
  sortOrder: number
): PlatformApiMilestoneCreateRequest {
  return {
    year: input.year,
    version: input.version,
    title: input.title,
    description: input.description?.trim() ? input.description.trim() : null,
    sort_order: sortOrder,
  };
}

export function buildPlatformMilestoneUpdateRequest(
  input: ProjectVersionUpdate
): PlatformApiMilestoneUpdateRequest {
  const payload: PlatformApiMilestoneUpdateRequest = {};

  if (input.year !== undefined) {
    payload.year = input.year;
  }
  if (input.version !== undefined) {
    payload.version = input.version;
  }
  if (input.title !== undefined) {
    payload.title = input.title;
  }
  if (input.description !== undefined) {
    payload.description = input.description?.trim()
      ? input.description.trim()
      : null;
  }
  if (input.sortOrder !== undefined) {
    payload.sort_order = input.sortOrder;
  }

  return payload;
}
