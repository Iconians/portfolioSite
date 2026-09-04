import type {
  PlatformApiCaseStudyDetail,
  PlatformApiListItem,
} from "@/lib/project-read/platform-api-types";

/** Platform admin case-study list item (includes Platform UUID). */
export interface PlatformApiAdminCaseStudyListItem extends PlatformApiListItem {
  id: string;
  publish_status?: string | null;
}

export interface PlatformApiAdminCaseStudyListResponse {
  items: PlatformApiAdminCaseStudyListItem[];
  total?: number;
  page?: number;
  limit?: number;
}

/** Platform admin case-study detail (authoritative shared-domain read). */
export interface PlatformApiAdminCaseStudyDetail extends PlatformApiCaseStudyDetail {
  id: string;
  publish_status?: string | null;
}

export interface PlatformApiAdminMediaListItem {
  id: string;
  case_study_id: string;
  storage_key: string;
  public_url: string;
  role: string;
  audience?: string | null;
  alt_text?: string | null;
  caption?: string | null;
  mime_type?: string | null;
  size_bytes?: number | null;
  width?: number | null;
  height?: number | null;
  sort_order?: number | null;
  upload_status?: string | null;
  created_at?: string | null;
}

export interface PlatformApiAdminMediaListResponse {
  items: PlatformApiAdminMediaListItem[];
  total?: number;
  page?: number;
  limit?: number;
}
