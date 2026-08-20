/** R2 key prefixes inside the bucket (engineering-platform-assets/...) */
export const MEDIA_STORAGE_FOLDERS = {
  "portfolio-project": "portfolio/project-images",
  "portfolio-profile": "portfolio",
  general: "media",
} as const;

export type MediaStorageFolder = keyof typeof MEDIA_STORAGE_FOLDERS;

export const DEFAULT_MEDIA_STORAGE_FOLDER: MediaStorageFolder = "general";

export function isMediaStorageFolder(value: string): value is MediaStorageFolder {
  return value in MEDIA_STORAGE_FOLDERS;
}

export function resolveMediaStorageFolder(
  value: string | null | undefined
): MediaStorageFolder {
  if (value && isMediaStorageFolder(value)) {
    return value;
  }
  return DEFAULT_MEDIA_STORAGE_FOLDER;
}

export function buildStorageKey(
  filename: string,
  folder: MediaStorageFolder = DEFAULT_MEDIA_STORAGE_FOLDER
): string {
  const prefix = MEDIA_STORAGE_FOLDERS[folder];
  const timestamp = Date.now();
  const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `${prefix}/${timestamp}-${sanitizedName}`;
}
