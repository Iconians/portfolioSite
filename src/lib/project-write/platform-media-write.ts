import "server-only";

import { AdminProjectLoadError } from "./admin-project-load-error";
import * as mediaClient from "./platform-api-admin-media-client";
import { buildChildReorderOrderedIds } from "./platform-child-reorder-order";
import {
  isConfirmedPlatformAdminMedia,
  mapPlatformAdminMediaToEditorFields,
  mapPlatformMediaRecordToPickerSelection,
  mapPresignResponseForBrowser,
} from "./platform-media-mapper";
import { resolvePlatformCaseStudyWriteContext } from "./platform-parent-context";

import type { PlatformApiAdminMediaListItem } from "./platform-admin-types";
import type { ChildReorderDirection } from "./platform-child-reorder-order";
import type {
  PlatformAdminMediaRecord,
  PlatformMediaPresignRequest,
  PlatformMediaPresignClientPayload,
  PlatformMediaRegisterRequest,
  PlatformMediaRole,
  PlatformMediaUpdateRequest,
  ProjectPlatformMediaPickerItem,
} from "./platform-media-types";
import type { PortfolioGalleryItem } from "@/lib/types/portfolio";

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

async function listProjectMediaPickerItemsViaPlatform(
  portfolioLocalId: string,
  options?: { role?: PlatformMediaRole }
): Promise<ProjectPlatformMediaPickerItem[]> {
  const context = await resolvePlatformCaseStudyWriteContext(portfolioLocalId);
  const response = await context.client.listMedia({
    caseStudyId: context.platformCaseStudyId,
    role: options?.role,
  });
  return response.items.map(mapPlatformMediaRecordToPickerSelection);
}

export async function listConfirmedProjectMediaViaPlatform(
  portfolioLocalId: string,
  options?: { role?: PlatformMediaRole }
): Promise<ProjectPlatformMediaPickerItem[]> {
  const items = await listProjectMediaPickerItemsViaPlatform(
    portfolioLocalId,
    options
  );
  return items.filter((item) =>
    isConfirmedPlatformAdminMedia({ upload_status: item.uploadStatus })
  );
}

export async function listPendingProjectMediaViaPlatform(
  portfolioLocalId: string,
  options?: { role?: PlatformMediaRole }
): Promise<ProjectPlatformMediaPickerItem[]> {
  const items = await listProjectMediaPickerItemsViaPlatform(
    portfolioLocalId,
    options
  );
  return items.filter(
    (item) => !isConfirmedPlatformAdminMedia({ upload_status: item.uploadStatus })
  );
}

export async function listProjectMediaViaPlatform(
  portfolioLocalId: string,
  options?: { role?: PlatformMediaRole }
) {
  return listConfirmedProjectMediaViaPlatform(portfolioLocalId, options);
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

export async function cleanupPendingProjectMediaViaPlatform(
  portfolioLocalId: string,
  mediaId: string
): Promise<void> {
  const context = await resolvePlatformCaseStudyWriteContext(portfolioLocalId);
  const owned = await assertMediaBelongsToCaseStudy(context, mediaId);
  if (isConfirmedPlatformAdminMedia(owned)) {
    throw new AdminProjectLoadError(
      "Only pending failed upload records can be cleaned up. Replacing a confirmed hero uses upload replacement."
    );
  }
  await mediaClient.deleteCaseStudyMedia(context.client, mediaId);
}

async function listGalleryItemsViaPlatform(
  context: Awaited<ReturnType<typeof resolvePlatformCaseStudyWriteContext>>
): Promise<PortfolioGalleryItem[]> {
  const response = await context.client.listMedia({
    caseStudyId: context.platformCaseStudyId,
    role: "gallery",
  });
  return mapPlatformAdminMediaToEditorFields(response.items).gallery;
}

export async function reorderProjectGalleryMediaViaPlatform(
  portfolioLocalId: string,
  mediaId: string,
  direction: ChildReorderDirection
): Promise<PortfolioGalleryItem[]> {
  const context = await resolvePlatformCaseStudyWriteContext(portfolioLocalId);
  const currentGallery = await listGalleryItemsViaPlatform(context);
  const galleryIds = currentGallery
    .map((item) => item.mediaId)
    .filter((id): id is string => Boolean(id));

  const orderedIds = buildChildReorderOrderedIds(galleryIds, mediaId, direction);
  if (!orderedIds) {
    return currentGallery;
  }

  await mediaClient.reorderGalleryCaseStudyMedia(
    context.client,
    context.platformCaseStudyId,
    { ordered_ids: orderedIds }
  );

  return listGalleryItemsViaPlatform(context);
}
