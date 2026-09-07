/** Platform admin POST /api/v1/admin/case-studies request (M1 contract). */

export interface PlatformApiCaseStudyCreateRequest {
  title: string;
  project_type: string;
  slug?: string;
}
