"use client";

import { Button } from "@/components/ui/button";

import { ProjectMediaPendingCleanup } from "./ProjectMediaPendingCleanup";

import type { MediaPickerAsset } from "./media-picker-upload";
import type {
  PlatformMediaRole,
  ProjectPlatformMediaPickerItem,
} from "@/lib/project-write/platform-media-types";

interface MediaPickerDialogProps {
  title: string;
  assets: MediaPickerAsset[];
  pendingAssets: ProjectPlatformMediaPickerItem[];
  loading: boolean;
  uploading: boolean;
  cleaningUpId: string | null;
  error: string | null;
  uploadRole: PlatformMediaRole;
  currentMediaId: string | null;
  platformSingletonRole: boolean;
  showPendingCleanup: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onClose: () => void;
  onSelect: (asset: MediaPickerAsset) => void;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCleanupPending: (mediaId: string) => void;
}

export function MediaPickerDialog({
  title,
  assets,
  pendingAssets,
  loading,
  uploading,
  cleaningUpId,
  error,
  uploadRole,
  currentMediaId,
  platformSingletonRole,
  showPendingCleanup,
  fileInputRef,
  onClose,
  onSelect,
  onUpload,
  onCleanupPending,
}: MediaPickerDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="media-picker-title"
        className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-lg border bg-background shadow-lg"
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 id="media-picker-title" className="text-lg font-semibold">
            {title}
          </h2>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={onUpload}
            />
            <Button
              type="button"
              variant="secondary"
              disabled={uploading || loading}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? "Uploading..." : "Upload new"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto p-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading media...</p>
          ) : null}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {!loading && !error && assets.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {platformSingletonRole
                ? `No ${uploadRole} image yet. Upload a new image to set the project ${uploadRole}.`
                : "No media yet. Upload an image to use it in this project."}
            </p>
          ) : null}
          {!loading && assets.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {assets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => onSelect(asset)}
                  className="overflow-hidden rounded-md border text-left transition hover:border-primary"
                >
                  <div className="aspect-video bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset.publicUrl}
                      alt={asset.altText ?? asset.filename}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <p className="truncate text-sm font-medium">{asset.filename}</p>
                    {asset.role ? (
                      <p className="text-xs text-muted-foreground">
                        {asset.role}
                        {currentMediaId === asset.id ? " (current)" : ""}
                      </p>
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          ) : null}

          {showPendingCleanup ? (
            <ProjectMediaPendingCleanup
              items={pendingAssets}
              cleaningUpId={cleaningUpId}
              onRemove={onCleanupPending}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
