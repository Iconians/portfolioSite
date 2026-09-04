import "server-only";

import { AdminProjectLoadError } from "./admin-project-load-error";
import * as mediaClient from "./platform-api-admin-media-client";
import {
  mapPlatformMediaRecordToPickerSelection,
  mapPresignResponseForBrowser,
} from "./platform-media-mapper";
import { resolvePlatformCaseStudyWriteContext } from "./platform-parent-context";

import type { PlatformApiAdminMediaListItem } from "./platform-admin-types";
import type {
  PlatformAdminMediaRecord,
  PlatformMediaPresignRequest,
  PlatformMediaPresignClientPayload,
  PlatformMediaRegisterRequest,
  PlatformMediaRole,
  PlatformMediaUpdateRequest,
} from "./platform-media-types";

async function assertMediaBelongsToCaseStudy(
  context: Awaited<ReturnType<typeof resolvePlatformCaseStudyWriteContext>>,
  mediaId: string
): Promise<PlatformApiAdminMediaListItem> {
  const media = await context.client.listMedia({
    caseStudyId: context.platformCaseStudyId,
  });
  const owned = media.items.find((item) => item.id === mediaId);
  if (!owned) {
    throw new AdminProjectLoadError("Platform media not found for this project");
  }
  return owned;
}

export async function presignProjectMediaViaPlatform(
  portfolioLocalId: string,
  payload: PlatformMediaPresignRequest
): Promise<PlatformMediaPresignClientPayload> {
  const context = await resolvePlatformCaseStudyWriteContext(portfolioLocalId);
  const presign = await mediaClient.presignCaseStudyMedia(
    context.client,
    context.platformCaseStudyId,
    payload
  );
  return mapPresignResponseForBrowser(presign);
}

export async function registerProjectMediaViaPlatform(
  portfolioLocalId: string,
  payload: PlatformMediaRegisterRequest
): Promise<PlatformAdminMediaRecord> {
  const context = await resolvePlatformCaseStudyWriteContext(portfolioLocalId);
  return mediaClient.registerCaseStudyMedia(
    context.client,
    context.platformCaseStudyId,
    payload
  );
}

export async function listProjectMediaViaPlatform(
  portfolioLocalId: string,
  options?: { role?: PlatformMediaRole }
) {
  const context = await resolvePlatformCaseStudyWriteContext(portfolioLocalId);
  const response = await context.client.listMedia({
    caseStudyId: context.platformCaseStudyId,
    role: options?.role,
  });
  return response.items.map(mapPlatformMediaRecordToPickerSelection);
}

export async function updateProjectMediaViaPlatform(
  portfolioLocalId: string,
  mediaId: string,
  payload: PlatformMediaUpdateRequest
): Promise<PlatformAdminMediaRecord> {
  const context = await resolvePlatformCaseStudyWriteContext(portfolioLocalId);
  await assertMediaBelongsToCaseStudy(context, mediaId);
  return mediaClient.updateCaseStudyMedia(context.client, mediaId, payload);
}

export async function deleteProjectMediaViaPlatform(
  portfolioLocalId: string,
  mediaId: string
): Promise<void> {
  const context = await resolvePlatformCaseStudyWriteContext(portfolioLocalId);
  await assertMediaBelongsToCaseStudy(context, mediaId);
  await mediaClient.deleteCaseStudyMedia(context.client, mediaId);
}
