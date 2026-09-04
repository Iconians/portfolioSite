import { PlatformApiAdminMalformedResponseError } from "./errors";

import type { PlatformApiAdminRequestTransport } from "./platform-api-admin-request";
import type {
  PlatformAdminMediaRecord,
  PlatformMediaPresignRequest,
  PlatformMediaPresignResponse,
  PlatformMediaRegisterRequest,
  PlatformMediaUpdateRequest,
} from "./platform-media-types";

type MediaTransport = Pick<PlatformApiAdminRequestTransport, "requestJson">;

export async function presignCaseStudyMedia(
  transport: MediaTransport,
  caseStudyId: string,
  payload: PlatformMediaPresignRequest
): Promise<PlatformMediaPresignResponse> {
  const data = await transport.requestJson<PlatformMediaPresignResponse>(
    `/case-studies/${encodeURIComponent(caseStudyId)}/media/presign`,
    {
      method: "POST",
      body: payload,
      operation: "presignCaseStudyMedia",
    }
  );

  if (!data?.upload_url || !data.storage_key) {
    throw new PlatformApiAdminMalformedResponseError(
      "Platform API admin media presign response missing upload_url or storage_key"
    );
  }

  return data;
}

export async function registerCaseStudyMedia(
  transport: MediaTransport,
  caseStudyId: string,
  payload: PlatformMediaRegisterRequest
): Promise<PlatformAdminMediaRecord> {
  const data = await transport.requestJson<PlatformAdminMediaRecord>(
    `/case-studies/${encodeURIComponent(caseStudyId)}/media`,
    {
      method: "POST",
      body: payload,
      operation: "registerCaseStudyMedia",
    }
  );

  if (!data?.id) {
    throw new PlatformApiAdminMalformedResponseError(
      "Platform API admin media register response missing id"
    );
  }

  return data;
}

export async function updateCaseStudyMedia(
  transport: MediaTransport,
  mediaId: string,
  payload: PlatformMediaUpdateRequest
): Promise<PlatformAdminMediaRecord> {
  const data = await transport.requestJson<PlatformAdminMediaRecord>(
    `/media/${encodeURIComponent(mediaId)}`,
    {
      method: "PATCH",
      body: payload,
      operation: "updateCaseStudyMedia",
    }
  );

  if (!data?.id) {
    throw new PlatformApiAdminMalformedResponseError(
      "Platform API admin media update response missing id"
    );
  }

  return data;
}

export async function deleteCaseStudyMedia(
  transport: MediaTransport,
  mediaId: string
): Promise<void> {
  await transport.requestJson(`/media/${encodeURIComponent(mediaId)}`, {
    method: "DELETE",
    operation: "deleteCaseStudyMedia",
  });
}
