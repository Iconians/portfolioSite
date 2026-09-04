/** Platform admin PATCH /api/v1/admin/case-studies/{id} request (CaseStudyPatchRequest). */

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
}
