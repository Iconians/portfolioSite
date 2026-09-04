/** Platform admin milestone mutation types (MilestoneCreate/UpdateRequest). */

export interface PlatformApiMilestoneCreateRequest {
  year?: number | null;
  version?: string | null;
  title: string;
  description?: string | null;
  sort_order?: number;
}

export interface PlatformApiMilestoneUpdateRequest {
  year?: number | null;
  version?: string | null;
  title?: string | null;
  description?: string | null;
  sort_order?: number | null;
}

export interface PlatformApiAdminMilestone {
  id: string;
  year?: number | null;
  version?: string | null;
  title: string;
  description?: string | null;
  sort_order: number;
}
