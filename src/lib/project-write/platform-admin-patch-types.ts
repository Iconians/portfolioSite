/** Platform admin PATCH /api/v1/admin/case-studies/{id} request (CaseStudyPatchRequest). */

import type { PlatformApiAdminConsumerSettingInput } from "./platform-presentation-types";

/** M3 editor-owned Platform content-item kinds (engineering consumer). */
export type PlatformApiM3ContentItemKind =
  | "feature"
  | "responsibility"
  | "capability";

export interface PlatformApiAdminContentItemInput {
  kind: PlatformApiM3ContentItemKind;
  audience: string;
  text: string;
}

export interface PlatformApiAdminTechnologyInput {
  name: string;
}

export interface PlatformApiAdminCategoryInput {
  slug: string;
  name: string;
}

export interface PlatformApiAdminLinkInput {
  link_type: string;
  url: string;
  label?: string | null;
}

export interface PlatformApiCaseStudyPatchRequest {
  title?: string | null;
  subtitle?: string | null;
  summary?: string | null;
  problem?: string | null;
  solution?: string | null;
  architecture?: string | null;
  challenges?: string | null;
  lessons_learned?: string | null;
  future_improvements?: string | null;
  project_type?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  content_items?: PlatformApiAdminContentItemInput[];
  content_item_kinds_to_replace?: PlatformApiM3ContentItemKind[];
  technologies?: PlatformApiAdminTechnologyInput[];
  categories?: PlatformApiAdminCategoryInput[];
  links?: PlatformApiAdminLinkInput[];
  consumer_settings?: PlatformApiAdminConsumerSettingInput[];
  badge?: string | null;
  best_for?: string | null;
  business_outcome?: string | null;
  business_context_note?: string | null;
  results_narrative?: string | null;
  business_summary_override?: string | null;
  business_problem_override?: string | null;
  business_solution_override?: string | null;
  engineering_summary_override?: string | null;
}
