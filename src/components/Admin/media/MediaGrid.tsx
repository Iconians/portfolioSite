"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  formatDimensions,
  formatFileSize,
} from "@/components/Admin/media/media-format";
import { MediaMetadataForm } from "@/components/Admin/media/MediaMetadataForm";
import { ConfirmDialog } from "@/components/Admin/shared/ConfirmDialog";
import { EmptyState } from "@/components/Admin/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { deleteMediaAction } from "@/lib/actions/media";

import type { MediaAsset } from "@/lib/types/media";


interface MediaGridProps {
  assets: MediaAsset[];
}

export function MediaGrid({ assets }: MediaGridProps) {
  const router = useRouter();
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSaved() {
    setEditingAsset(null);
    router.refresh();
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) {
      return;
    }
    const targetId = deleteTarget.id;
    startTransition(async () => {
      const result = await deleteMediaAction(targetId);
      if (result.success) {
        toast.success("Media deleted");
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  if (assets.length === 0) {
    return (
      <EmptyState
        title="No media yet"
        description="Upload an image to get started with the media library."
      />
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => (
          <Card key={asset.id} className="overflow-hidden">
            <div className="aspect-video bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.publicUrl}
                alt={asset.altText ?? asset.filename}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-3 p-4">
              <div>
                <p className="font-medium truncate">{asset.filename}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {asset.storageKey}
                </p>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>{formatFileSize(asset.sizeBytes)}</p>
                <p>{formatDimensions(asset.width, asset.height)}</p>
                <p>{new Date(asset.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingAsset(asset)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteTarget(asset)}
                  disabled={isPending}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {editingAsset ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit media metadata</h2>
            <MediaMetadataForm
              asset={editingAsset}
              onSaved={handleSaved}
              onCancel={() => setEditingAsset(null)}
            />
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete media asset?"
        description={
          deleteTarget
            ? `This will remove "${deleteTarget.filename}" from storage and the media library. Portfolio projects using this image will block deletion.`
            : ""
        }
        confirmLabel="Delete"
        loading={isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
