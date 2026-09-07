"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { MediaPicker } from "@/components/Admin/media/MediaPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  deleteProjectPlatformMediaAction,
  reorderProjectGalleryMediaAction,
  updateProjectPlatformMediaAction,
} from "@/lib/actions/portfolio-media";
import { applyGalleryDirectionalReorder } from "@/lib/portfolio/gallery-order";
import { shouldDisableGalleryReorder } from "@/lib/project-write/platform-media-reorder-policy";

import type { PortfolioGalleryItem } from "@/lib/types/portfolio";

interface GalleryEditorProps {
  items: PortfolioGalleryItem[];
  onChange: (items: PortfolioGalleryItem[]) => void;
  disabled?: boolean;
  writeSource?: "database" | "platform-api";
  portfolioId?: string;
}

export function GalleryEditor({
  items,
  onChange,
  disabled = false,
  writeSource = "database",
  portfolioId,
}: GalleryEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [isReordering, setIsReordering] = useState(false);
  const usePlatformMedia = writeSource === "platform-api" && Boolean(portfolioId);
  const disableReorder = shouldDisableGalleryReorder(writeSource) || !usePlatformMedia;

  function addItem(asset: { id: string; publicUrl: string; altText: string | null }) {
    onChange([
      ...items,
      {
        mediaId: asset.id,
        url: asset.publicUrl,
        alt: asset.altText ?? undefined,
      },
    ]);
  }

  function updateItem(index: number, patch: Partial<PortfolioGalleryItem>) {
    const nextItems = items.map((item, itemIndex) =>
      itemIndex === index ? { ...item, ...patch } : item
    );
    onChange(nextItems);

    if (usePlatformMedia && portfolioId && items[index]?.mediaId) {
      const mediaId = items[index].mediaId;
      startTransition(async () => {
        const result = await updateProjectPlatformMediaAction(portfolioId, mediaId, {
          altText: patch.alt ?? null,
          caption: patch.caption ?? null,
        });
        if (!result.success) {
          toast.error(result.error ?? "Failed to update gallery image metadata");
        }
      });
    }
  }

  function removeItem(index: number) {
    const item = items[index];
    const mediaId = item?.mediaId;
    if (usePlatformMedia && portfolioId && mediaId) {
      startTransition(async () => {
        const result = await deleteProjectPlatformMediaAction(portfolioId, mediaId);
        if (result.success) {
          onChange(items.filter((_, itemIndex) => itemIndex !== index));
        } else {
          toast.error(result.error ?? "Failed to remove gallery image");
        }
      });
      return;
    }

    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  }

  async function handleReorder(mediaId: string | undefined, direction: "up" | "down") {
    if (!mediaId || !usePlatformMedia || !portfolioId || isReordering || disableReorder) {
      return;
    }

    const previous = items;
    const optimistic = applyGalleryDirectionalReorder(items, mediaId, direction);
    if (!optimistic) {
      return;
    }

    setIsReordering(true);
    onChange(optimistic);

    const result = await reorderProjectGalleryMediaAction(
      portfolioId,
      mediaId,
      direction
    );

    setIsReordering(false);

    if (result.success) {
      onChange(result.data);
      return;
    }

    onChange(previous);
    toast.error(result.error);
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Gallery images</Label>
        <p className="mt-1 text-xs text-muted-foreground">
          Platform-managed gallery media. Add images from the media library; captions and alt
          text are optional.
          {usePlatformMedia
            ? " Reorder uses gallery-role Platform media IDs only."
            : null}
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No gallery images yet.</p>
      ) : null}

      {items.map((item, index) => (
        <div key={`${item.mediaId ?? item.url}-${index}`} className="space-y-3 rounded-md border p-3">
          <div className="rounded-md border bg-muted/30 p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.url}
              alt={item.alt ?? `Gallery image ${index + 1}`}
              className="max-h-40 rounded object-contain"
            />
          </div>
          {item.mediaId ? (
            <p className="text-xs text-muted-foreground">Gallery media ID: {item.mediaId}</p>
          ) : null}
          <Input
            value={item.alt ?? ""}
            disabled={disabled || isPending || isReordering}
            placeholder="Alt text"
            onChange={(event) => updateItem(index, { alt: event.target.value })}
          />
          <Input
            value={item.caption ?? ""}
            disabled={disabled || isPending || isReordering}
            placeholder="Caption"
            onChange={(event) => updateItem(index, { caption: event.target.value })}
          />
          <div className="flex flex-wrap gap-2">
            {!disableReorder && item.mediaId ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  disabled={disabled || isPending || isReordering || index === 0}
                  onClick={() => handleReorder(item.mediaId, "up")}
                >
                  Move up
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={
                    disabled || isPending || isReordering || index === items.length - 1
                  }
                  onClick={() => handleReorder(item.mediaId, "down")}
                >
                  Move down
                </Button>
              </>
            ) : null}
            <Button
              type="button"
              variant="outline"
              disabled={disabled || isPending || isReordering}
              onClick={() => removeItem(index)}
            >
              Remove image
            </Button>
          </div>
        </div>
      ))}

      <MediaPicker
        triggerLabel="Add gallery image"
        writeSource={writeSource}
        portfolioId={portfolioId}
        uploadRole="gallery"
        onSelect={(asset) => addItem(asset)}
      />
    </div>
  );
}
