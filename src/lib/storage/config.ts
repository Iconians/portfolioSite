import path from "path";
import type { LocalStorageConfig, S3StorageConfig } from "./types";

function readEnv(primary: string, fallback?: string): string | undefined {
  const primaryValue = process.env[primary];
  if (primaryValue) {
    return primaryValue;
  }
  if (fallback) {
    return process.env[fallback];
  }
  return undefined;
}

function requireEnv(primary: string, fallback?: string): string {
  const value = readEnv(primary, fallback);
  if (!value) {
    const hint = fallback ? ` or ${fallback}` : "";
    throw new Error(`Missing required environment variable: ${primary}${hint}`);
  }
  return value;
}

export function loadLocalStorageConfig(): LocalStorageConfig {
  const rootDirectory = process.env.LOCAL_STORAGE_PATH
    ? path.resolve(process.env.LOCAL_STORAGE_PATH)
    : path.join(process.cwd(), "public", "media");

  const publicUrlBase =
    process.env.LOCAL_STORAGE_PUBLIC_URL_BASE?.replace(/\/$/, "") ?? "/media";

  return { rootDirectory, publicUrlBase };
}

export function loadS3StorageConfig(): S3StorageConfig {
  const endpoint = requireEnv("S3_ENDPOINT", "AWS_ENDPOINT_URL_S3");
  const bucket = requireEnv("S3_BUCKET");
  const region = requireEnv("S3_REGION", "AWS_REGION");
  const accessKeyId = requireEnv("S3_ACCESS_KEY_ID", "AWS_ACCESS_KEY_ID");
  const secretAccessKey = requireEnv(
    "S3_SECRET_ACCESS_KEY",
    "AWS_SECRET_ACCESS_KEY"
  );

  const publicUrlBase =
    process.env.S3_PUBLIC_URL_BASE?.replace(/\/$/, "") ??
    `${endpoint.replace(/\/$/, "")}/${bucket}`;

  return {
    endpoint,
    bucket,
    region,
    accessKeyId,
    secretAccessKey,
    publicUrlBase,
  };
}

export function getStorageProviderKind(): "local" | "s3" {
  const provider = process.env.STORAGE_PROVIDER?.toLowerCase();
  return provider === "s3" ? "s3" : "local";
}
