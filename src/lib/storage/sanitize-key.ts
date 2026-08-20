/** Normalize storage keys — no path traversal or absolute paths. */
export function sanitizeStorageKey(key: string): string {
  const normalized = key.replace(/\\/g, "/").replace(/^\/+/, "");
  const segments = normalized.split("/").filter((segment) => segment && segment !== "..");
  if (segments.length === 0) {
    throw new Error("Storage key is required");
  }
  return segments.join("/");
}
