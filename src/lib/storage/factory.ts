import {
  getStorageProviderKind,
  loadLocalStorageConfig,
  loadS3StorageConfig,
} from "./config";
import { LocalStorageProvider } from "./local.provider";
import { S3StorageProvider } from "./s3.provider";

import type { StorageProvider } from "./types";

export function getStorageProvider(): StorageProvider {
  const kind = getStorageProviderKind();
  if (kind === "s3") {
    return new S3StorageProvider(loadS3StorageConfig());
  }
  return new LocalStorageProvider(loadLocalStorageConfig());
}
