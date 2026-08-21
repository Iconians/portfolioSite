import path from "path";

import type { LocalStorageConfig, S3StorageConfig } from "./types";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
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
  const endpoint = requireEnv("S3_ENDPOINT");
  const bucket = requireEnv("S3_BUCKET");
  const region = requireEnv("S3_REGION");
  const accessKeyId = requireEnv("S3_ACCESS_KEY_ID");
  const secretAccessKey = requireEnv("S3_SECRET_ACCESS_KEY");
  const publicUrlBase = requireEnv("S3_PUBLIC_URL_BASE").replace(/\/$/, "");

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
