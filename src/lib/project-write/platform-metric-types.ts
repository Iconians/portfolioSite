/** Platform admin metric mutation types (CaseStudyMetricCreate/UpdateRequest). */

export interface PlatformApiMetricCreateRequest {
  label: string;
  value: string;
  description?: string | null;
  show_on_business?: boolean;
  sort_order?: number;
}

export interface PlatformApiMetricUpdateRequest {
  label?: string | null;
  value?: string | null;
  description?: string | null;
  show_on_business?: boolean | null;
  sort_order?: number | null;
}

export interface PlatformApiAdminMetric {
  id: string;
  label: string;
  value: string;
  description?: string | null;
  show_on_business: boolean;
  sort_order: number;
}
