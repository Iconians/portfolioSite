import type { CreatePortfolioProjectInput } from "./create-portfolio-project-input";
import type { PlatformApiCaseStudyCreateRequest } from "./platform-create-types";

export function buildPlatformCreatePayload(
  input: CreatePortfolioProjectInput
): PlatformApiCaseStudyCreateRequest {
  const payload: PlatformApiCaseStudyCreateRequest = {
    title: input.title.trim(),
    project_type: input.projectType,
  };

  const trimmedSlug = input.slug?.trim();
  if (trimmedSlug) {
    payload.slug = trimmedSlug;
  }

  return payload;
}
