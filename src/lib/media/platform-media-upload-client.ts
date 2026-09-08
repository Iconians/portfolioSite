import type { PlatformMediaPresignClientPayload } from "@/lib/project-write/platform-media-types";

export const PLATFORM_MEDIA_BROWSER_UPLOAD_FAILURE_MESSAGE =
  "Direct upload to storage failed. Verify R2 connectivity and CORS before retrying; repeated retries can leave pending upload records.";

export class PlatformMediaBrowserUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlatformMediaBrowserUploadError";
  }
}

export function formatPlatformMediaBrowserUploadError(error: unknown): Error {
  if (error instanceof PlatformMediaBrowserUploadError) {
    return error;
  }

  if (error instanceof TypeError) {
    const message = error.message.trim().toLowerCase();
    if (message.includes("failed to fetch") || message.includes("networkerror")) {
      return new PlatformMediaBrowserUploadError(
        PLATFORM_MEDIA_BROWSER_UPLOAD_FAILURE_MESSAGE
      );
    }
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error("Upload failed");
}

export async function putFileToPresignedUrl(input: {
  presign: PlatformMediaPresignClientPayload;
  file: File;
}): Promise<void> {
  const headers = new Headers(input.presign.uploadHeaders);

  try {
    const response = await fetch(input.presign.uploadUrl, {
      method: "PUT",
      headers,
      body: input.file,
    });

    if (!response.ok) {
      throw new PlatformMediaBrowserUploadError(
        `Direct upload to storage failed with status ${response.status}. Verify R2 connectivity and CORS before retrying.`
      );
    }
  } catch (error) {
    throw formatPlatformMediaBrowserUploadError(error);
  }
}

export function toPresignClientPayload(
  presign: {
    media_id: string;
    upload_url: string;
    upload_headers: Record<string, string>;
    storage_key: string;
    public_url: string;
    expires_in: number;
  }
): PlatformMediaPresignClientPayload {
  return {
    mediaId: presign.media_id,
    uploadUrl: presign.upload_url,
    uploadHeaders: presign.upload_headers,
    storageKey: presign.storage_key,
    publicUrl: presign.public_url,
    expiresIn: presign.expires_in,
  };
}
