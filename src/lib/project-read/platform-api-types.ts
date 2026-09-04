/** Subset of DevLaunch Platform API V1 public engineering projection (read-only). */

export interface PlatformApiCategoryRef {
  name: string;
  slug: string;
}

export interface PlatformApiTechnologyRef {
  name: string;
}

export interface PlatformApiListItem {
  slug: string;
  title: string;
  subtitle?: string | null;
  summary?: string | null;
  project_type: string;
  lifecycle_status: string;
  is_featured?: boolean;
  published_at?: string | null;
  categories?: PlatformApiCategoryRef[];
  technologies?: PlatformApiTechnologyRef[];
}

export interface PlatformApiMetric {
  label: string;
  value: string;
  description?: string | null;
}

export interface PlatformApiMilestone {
  year?: number | null;
  version?: string | null;
  title: string;
  description?: string | null;
}

export interface PlatformApiContentItem {
  kind: string;
  text: string;
}

export interface PlatformApiLink {
  link_type: string;
  url: string;
  label?: string | null;
}

export interface PlatformApiMediaItem {
  public_url: string;
  role: string;
  alt_text?: string | null;
  caption?: string | null;
  mime_type?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface PlatformApiCaseStudyDetail extends PlatformApiListItem {
  problem?: string | null;
  solution?: string | null;
  architecture?: string | null;
  challenges?: string | null;
  lessons_learned?: string | null;
  future_improvements?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  content_version: number;
  metrics?: PlatformApiMetric[];
  milestones?: PlatformApiMilestone[];
  content_items?: PlatformApiContentItem[];
  links?: PlatformApiLink[];
  media?: PlatformApiMediaItem[];
}

export interface PlatformApiListResponse {
  items: PlatformApiListItem[];
  total: number;
  page: number;
  limit: number;
}

export type PlatformApiFetchResult<T> =
  | { status: "ok"; data: T; etag?: string; cacheControl?: string; notModified: false }
  | { status: "not_modified"; etag?: string; cacheControl?: string; notModified: true };
