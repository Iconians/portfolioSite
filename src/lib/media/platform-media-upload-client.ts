import type { PlatformMediaPresignClientPayload } from "@/lib/project-write/platform-media-types";

export class PlatformMediaBrowserUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlatformMediaBrowserUploadError";
  }
}

export async function putFileToPresignedUrl(input: {
  presign: PlatformMediaPresignClientPayload;
  file: File;
}): Promise<void> {
  const headers = new Headers(input.presign.uploadHeaders);
  const response = await fetch(input.presign.uploadUrl, {
    method: "PUT",
    headers,
    body: input.file,
  });

  if (!response.ok) {
    throw new PlatformMediaBrowserUploadError(
      `Direct upload failed with status ${response.status}`
    );
  }
}

export function toPresignClientPayload(
  presign: {
    upload_url: string;
    upload_headers: Record<string, string>;
    storage_key: string;
    public_url: string;
    expires_in: number;
  }
): PlatformMediaPresignClientPayload {
  return {
    uploadUrl: presign.upload_url,
    uploadHeaders: presign.upload_headers,
    storageKey: presign.storage_key,
    publicUrl: presign.public_url,
    expiresIn: presign.expires_in,
  };
}
