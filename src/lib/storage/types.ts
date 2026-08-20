export interface UploadInput {
  key: string;
  body: Buffer;
  mimeType: string;
}

export interface StoredObject {
  key: string;
  publicUrl: string;
}

export interface SignedUploadInput {
  key: string;
  mimeType: string;
  expiresInSeconds?: number;
}

export interface SignedUploadResult {
  url: string;
  method: string;
  headers?: Record<string, string>;
}

export interface StorageProvider {
  readonly kind: "local" | "s3";
  upload(input: UploadInput): Promise<StoredObject>;
  delete(key: string): Promise<void>;
  getPublicUrl(key: string): string;
  getSignedUploadUrl?(input: SignedUploadInput): Promise<SignedUploadResult>;
}

export interface LocalStorageConfig {
  rootDirectory: string;
  publicUrlBase: string;
}

export interface S3StorageConfig {
  endpoint: string;
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  publicUrlBase: string;
}
