import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { sanitizeStorageKey } from "./sanitize-key";
import type {
  S3StorageConfig,
  SignedUploadInput,
  SignedUploadResult,
  StorageProvider,
  StoredObject,
  UploadInput,
} from "./types";

function joinPublicUrl(base: string, key: string): string {
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  return `${normalizedBase}/${key}`;
}

export class S3StorageProvider implements StorageProvider {
  readonly kind = "s3" as const;

  private readonly client: S3Client;

  constructor(private readonly config: S3StorageConfig) {
    this.client = new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      forcePathStyle: true,
      requestChecksumCalculation: "WHEN_REQUIRED",
    });
  }

  async upload(input: UploadInput): Promise<StoredObject> {
    const key = sanitizeStorageKey(input.key);
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        Body: input.body,
        ContentType: input.mimeType,
      })
    );
    return {
      key,
      publicUrl: this.getPublicUrl(key),
    };
  }

  async delete(key: string): Promise<void> {
    const safeKey = sanitizeStorageKey(key);
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.config.bucket,
        Key: safeKey,
      })
    );
  }

  getPublicUrl(key: string): string {
    const safeKey = sanitizeStorageKey(key);
    return joinPublicUrl(this.config.publicUrlBase, safeKey);
  }

  async getSignedUploadUrl(input: SignedUploadInput): Promise<SignedUploadResult> {
    const key = sanitizeStorageKey(input.key);
    const expiresIn = input.expiresInSeconds ?? 3600;
    const command = new PutObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
      ContentType: input.mimeType,
    });
    const url = await getSignedUrl(this.client, command, { expiresIn });
    return {
      url,
      method: "PUT",
      headers: { "Content-Type": input.mimeType },
    };
  }
}
