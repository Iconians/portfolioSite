import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";

import { sanitizeStorageKey } from "./sanitize-key";

import type {
  LocalStorageConfig,
  StorageProvider,
  StoredObject,
  UploadInput,
} from "./types";

function joinPublicUrl(base: string, key: string): string {
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  return `${normalizedBase}/${key}`;
}

export class LocalStorageProvider implements StorageProvider {
  readonly kind = "local" as const;

  constructor(private readonly config: LocalStorageConfig) {}

  async upload(input: UploadInput): Promise<StoredObject> {
    const key = sanitizeStorageKey(input.key);
    const filePath = path.join(this.config.rootDirectory, key);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, input.body);
    return {
      key,
      publicUrl: joinPublicUrl(this.config.publicUrlBase, key),
    };
  }

  async delete(key: string): Promise<void> {
    const safeKey = sanitizeStorageKey(key);
    const filePath = path.join(this.config.rootDirectory, safeKey);
    await unlink(filePath);
  }

  getPublicUrl(key: string): string {
    const safeKey = sanitizeStorageKey(key);
    return joinPublicUrl(this.config.publicUrlBase, safeKey);
  }
}
