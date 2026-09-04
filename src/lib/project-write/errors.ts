export class ProjectWriteConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProjectWriteConfigurationError";
  }
}

export class PlatformApiAdminNetworkError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "PlatformApiAdminNetworkError";
  }
}

export class PlatformApiAdminResponseError extends Error {
  readonly status: number;
  readonly retryAfterSeconds: number | null;
  readonly detail: string | null;
  readonly operation: string | null;

  constructor(
    status: number,
    message: string,
    options?: {
      retryAfterSeconds?: number | null;
      detail?: string | null;
      operation?: string | null;
    }
  ) {
    super(message);
    this.name = "PlatformApiAdminResponseError";
    this.status = status;
    this.retryAfterSeconds = options?.retryAfterSeconds ?? null;
    this.detail = options?.detail ?? null;
    this.operation = options?.operation ?? null;
  }
}

export class PlatformApiAdminMalformedResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlatformApiAdminMalformedResponseError";
  }
}
