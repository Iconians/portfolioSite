"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { listMediaAssetsAction } from "@/lib/actions/media";
import {
  cleanupPendingProjectPlatformMediaAction,
  listProjectPendingPlatformMediaAction,
  listProjectPlatformMediaAction,
} from "@/lib/actions/portfolio-media";
import {
  canSelectExistingMediaForRole,
  isExistingSingletonSelectionNoOp,
  isSingletonRole,
  PLATFORM_MEDIA_ROLE_IMMUTABLE_MESSAGE,
  PLATFORM_SINGLETON_REPLACEMENT_MESSAGE,
  platformMediaListRoleFilter,
} from "@/lib/project-write/platform-media-policy";

import {
  reportMediaUploadFailure,
  uploadDatabaseMediaFile,
  uploadPlatformProjectMediaFile,
  type MediaPickerAsset,
} from "./media-picker-upload";
import { MediaPickerDialog } from "./MediaPickerDialog";

import type {
  PlatformMediaRole,
  ProjectPlatformMediaPickerItem,
} from "@/lib/project-write/platform-media-types";
import type { MediaAsset } from "@/lib/types/media";


export interface MediaPickerSelection {
  id: string;
  publicUrl: string;
  filename: string;
  altText: string | null;
}

interface MediaPickerProps {
  onSelect: (asset: MediaPickerSelection) => void;
  triggerLabel?: string;
  writeSource?: "database" | "platform-api";
  portfolioId?: string;
  uploadRole?: PlatformMediaRole;
  currentMediaId?: string | null;
}

type PickerAsset = MediaPickerAsset;

export function MediaPicker({
  onSelect,
  triggerLabel = "Choose from library",
  writeSource = "database",
  portfolioId,
  uploadRole = "gallery",
  currentMediaId = null,
}: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<PickerAsset[]>([]);
  const [pendingAssets, setPendingAssets] = useState<ProjectPlatformMediaPickerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cleaningUpId, setCleaningUpId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const usePlatformProjectMedia =
    writeSource === "platform-api" && Boolean(portfolioId);

  async function handleOpen() {
    setOpen(true);
    setLoading(true);
    setError(null);

    if (usePlatformProjectMedia && portfolioId) {
      const role = platformMediaListRoleFilter(uploadRole);
      const [confirmedResult, pendingResult] = await Promise.all([
        listProjectPlatformMediaAction(portfolioId, { role }),
        listProjectPendingPlatformMediaAction(portfolioId, { role }),
      ]);

      if (confirmedResult.success) {
        setAssets(confirmedResult.data);
      } else {
        setError(confirmedResult.error);
        setAssets([]);
      }

      if (pendingResult.success) {
        setPendingAssets(pendingResult.data);
      } else {
        setPendingAssets([]);
        if (confirmedResult.success) {
          setError(pendingResult.error);
        }
      }
    } else {
      setPendingAssets([]);
      const result = await listMediaAssetsAction();
      if (result.success) {
        setAssets(
          result.data.map((asset: MediaAsset) => ({
            id: asset.id,
            publicUrl: asset.publicUrl,
            filename: asset.filename,
            altText: asset.altText,
          }))
        );
      } else {
        setError(result.error);
        setAssets([]);
      }
    }

    setLoading(false);
  }

  async function handleCleanupPending(mediaId: string) {
    if (!usePlatformProjectMedia || !portfolioId) {
      return;
    }

    setCleaningUpId(mediaId);
    const result = await cleanupPendingProjectPlatformMediaAction(
      portfolioId,
      mediaId
    );
    setCleaningUpId(null);

    if (result.success) {
      setPendingAssets((current) => current.filter((item) => item.id !== mediaId));
      toast.success("Removed failed upload record");
      return;
    }

    toast.error(result.error ?? "Failed to remove pending upload record");
  }

  function handleSelect(asset: PickerAsset) {
    if (
      usePlatformProjectMedia &&
      asset.role &&
      !canSelectExistingMediaForRole(uploadRole, asset.role)
    ) {
      toast.error(PLATFORM_MEDIA_ROLE_IMMUTABLE_MESSAGE);
      return;
    }

    if (
      usePlatformProjectMedia &&
      asset.role &&
      isExistingSingletonSelectionNoOp({
        uploadRole,
        existingRole: asset.role,
        selectedMediaId: asset.id,
        currentMediaId,
      })
    ) {
      setOpen(false);
      return;
    }

    onSelect({
      id: asset.id,
      publicUrl: asset.publicUrl,
      filename: asset.filename,
      altText: asset.altText,
    });
    setOpen(false);
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    try {
      const asset =
        usePlatformProjectMedia && portfolioId
          ? await uploadPlatformProjectMediaFile({
              file,
              portfolioId,
              uploadRole,
            })
          : await uploadDatabaseMediaFile(file);

      setAssets((current) => [asset, ...current]);
      handleSelect(asset);
      toast.success("Image uploaded and selected");
    } catch (uploadError) {
      reportMediaUploadFailure(uploadError);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  const platformSingletonRole = usePlatformProjectMedia && isSingletonRole(uploadRole);
  const resolvedTriggerLabel =
    triggerLabel ??
    (platformSingletonRole ? `Upload ${uploadRole} replacement` : "Choose from library");

  return (
    <>
      <Button type="button" variant="outline" onClick={handleOpen}>
        {resolvedTriggerLabel}
      </Button>

      {platformSingletonRole ? (
        <p className="text-xs text-muted-foreground">{PLATFORM_SINGLETON_REPLACEMENT_MESSAGE}</p>
      ) : null}

      {open ? (
        <MediaPickerDialog
          title={usePlatformProjectMedia ? "Project media" : "Media library"}
          assets={assets}
          pendingAssets={pendingAssets}
          loading={loading}
          uploading={uploading}
          cleaningUpId={cleaningUpId}
          error={error}
          uploadRole={uploadRole}
          currentMediaId={currentMediaId}
          platformSingletonRole={Boolean(platformSingletonRole)}
          showPendingCleanup={usePlatformProjectMedia}
          fileInputRef={fileInputRef}
          onClose={() => setOpen(false)}
          onSelect={handleSelect}
          onUpload={handleUpload}
          onCleanupPending={handleCleanupPending}
        />
      ) : null}
    </>
  );
}
