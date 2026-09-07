/** Platform case study was created but the transitional navigation bridge failed. */

export class PlatformProjectBridgeError extends Error {
  readonly platformCaseStudyId: string;
  readonly platformSlug: string;

  constructor(platformCaseStudyId: string, platformSlug: string, cause?: unknown) {
    super(
      "Project was created on Platform, but local navigation setup failed. " +
        `Platform slug: ${platformSlug}. The authoritative case study was preserved. ` +
        "Retry after resolving the database issue or contact an operator for bridge recovery."
    );
    this.name = "PlatformProjectBridgeError";
    this.platformCaseStudyId = platformCaseStudyId;
    this.platformSlug = platformSlug;
    if (cause instanceof Error) {
      this.cause = cause;
    }
  }
}
