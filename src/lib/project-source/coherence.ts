import { ProjectSourceConfigurationError } from "./errors";

export type ProjectDataSource = "database" | "platform-api";

export type ParsedProjectSource = "unset" | "database" | "platform-api" | "invalid";

export interface CoherentProjectSourceConfiguration {
  readSource: ProjectDataSource;
  writeSource: ProjectDataSource;
  rawReadSource: string | null;
  rawWriteSource: string | null;
}

type EnvLike = Record<string, string | undefined>;

let cachedConfiguration: CoherentProjectSourceConfiguration | null = null;

export function parseProjectSourceRaw(
  raw: string | undefined
): ParsedProjectSource {
  const trimmed = raw?.trim().toLowerCase();
  if (!trimmed) {
    return "unset";
  }
  if (trimmed === "database") {
    return "database";
  }
  if (trimmed === "platform-api") {
    return "platform-api";
  }
  return "invalid";
}

function toEffectiveReadSource(parsed: ParsedProjectSource): ProjectDataSource {
  return parsed === "platform-api" ? "platform-api" : "database";
}

function formatRawValue(raw: string | null): string {
  return raw?.trim() ? raw.trim() : "(unset)";
}

export function resolveCoherentProjectSourceConfiguration(
  env: EnvLike = process.env
): CoherentProjectSourceConfiguration {
  const rawReadSource = env.PROJECT_READ_SOURCE?.trim() || null;
  const rawWriteSource = env.PROJECT_WRITE_SOURCE?.trim() || null;
  const parsedRead = parseProjectSourceRaw(env.PROJECT_READ_SOURCE);
  const parsedWrite = parseProjectSourceRaw(env.PROJECT_WRITE_SOURCE);

  if (parsedRead === "invalid") {
    throw new ProjectSourceConfigurationError(
      `Invalid PROJECT_READ_SOURCE value "${formatRawValue(rawReadSource)}". Expected "database" or "platform-api".`
    );
  }

  if (parsedWrite === "invalid") {
    throw new ProjectSourceConfigurationError(
      `Invalid PROJECT_WRITE_SOURCE value "${formatRawValue(rawWriteSource)}". Expected "platform-api".`
    );
  }

  if (parsedWrite !== "platform-api") {
    throw new ProjectSourceConfigurationError(
      `Legacy Prisma shared-content writes are frozen (M17). PROJECT_WRITE_SOURCE must be "platform-api". Received "${formatRawValue(rawWriteSource)}".`
    );
  }

  const readSource = toEffectiveReadSource(parsedRead);
  const writeSource: ProjectDataSource = "platform-api";

  return {
    readSource,
    writeSource,
    rawReadSource,
    rawWriteSource,
  };
}

export function getCoherentProjectSourceConfiguration(
  env: EnvLike = process.env
): CoherentProjectSourceConfiguration {
  if (!cachedConfiguration) {
    cachedConfiguration = resolveCoherentProjectSourceConfiguration(env);
  }
  return cachedConfiguration;
}

export function resetCoherentProjectSourceConfigurationForTests(): void {
  cachedConfiguration = null;
}
