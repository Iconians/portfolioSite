export const MEDIA_MAX_BYTES = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
] as const;

export type AllowedImageMimeType = (typeof ALLOWED_IMAGE_MIME_TYPES)[number];

export interface UploadValidationInput {
  mimeType: string;
  sizeBytes: number;
  filename: string;
}

export function validateMediaUpload(input: UploadValidationInput): void {
  if (!input.filename.trim()) {
    throw new Error("Filename is required");
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.includes(input.mimeType as AllowedImageMimeType)) {
    throw new Error("Invalid file type. Allowed: JPEG, PNG, WebP, GIF, SVG");
  }

  if (input.sizeBytes <= 0) {
    throw new Error("File is empty");
  }

  if (input.sizeBytes > MEDIA_MAX_BYTES) {
    throw new Error("File too large. Maximum size is 5MB");
  }
}
