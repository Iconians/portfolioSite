export class PlatformSlugImmutableError extends Error {
  constructor() {
    super("Platform case study slug is immutable after create.");
    this.name = "PlatformSlugImmutableError";
  }
}
