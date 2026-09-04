export class ProjectSourceConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProjectSourceConfigurationError";
  }
}
