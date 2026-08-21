export const MEDIA_MAX_BYTES = 5 * 1024 * 1024;

/** Explicit image allowlist for Phase 2 portfolio media uploads. SVG deferred. */
export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export type AllowedImageMimeType = (typeof ALLOWED_IMAGE_MIME_TYPES)[number];

const MIME_TO_EXTENSIONS: Record<AllowedImageMimeType, readonly string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
};

export interface UploadValidationInput {
  mimeType: string;
  sizeBytes: number;
  filename: string;
}

function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot <= 0) {
    return "";
  }
  return filename.slice(lastDot).toLowerCase();
}

export function validateMediaUpload(input: UploadValidationInput): void {
  if (!input.filename.trim()) {
    throw new Error("Filename is required");
  }

  if (
    !ALLOWED_IMAGE_MIME_TYPES.includes(input.mimeType as AllowedImageMimeType)
  ) {
    throw new Error("Invalid file type. Allowed: JPEG, PNG, WebP, GIF");
  }

  const extension = getFileExtension(input.filename);
  const allowedExtensions =
    MIME_TO_EXTENSIONS[input.mimeType as AllowedImageMimeType];
  if (extension && !allowedExtensions.includes(extension)) {
    throw new Error("Filename extension does not match file type");
  }

  if (input.sizeBytes <= 0) {
    throw new Error("File is empty");
  }

  if (input.sizeBytes > MEDIA_MAX_BYTES) {
    throw new Error("File too large. Maximum size is 5MB");
  }
}
