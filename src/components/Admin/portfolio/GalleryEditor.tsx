"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { MediaPicker } from "@/components/Admin/media/MediaPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  deleteProjectPlatformMediaAction,
  updateProjectPlatformMediaAction,
} from "@/lib/actions/portfolio-media";
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
  const usePlatformMedia = writeSource === "platform-api" && Boolean(portfolioId);
  const disableReorder = shouldDisableGalleryReorder(writeSource);

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

  return (
    <div className="space-y-4">
      <div>
        <Label>Gallery images</Label>
        <p className="mt-1 text-xs text-muted-foreground">
          Add images from the media library. Captions and alt text are optional.
          {disableReorder
            ? " Gallery reorder is unavailable in platform-api mode until Platform exposes an atomic reorder contract."
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
          <Input
            value={item.alt ?? ""}
            disabled={disabled || isPending}
            placeholder="Alt text"
            onChange={(event) => updateItem(index, { alt: event.target.value })}
          />
          <Input
            value={item.caption ?? ""}
            disabled={disabled || isPending}
            placeholder="Caption"
            onChange={(event) => updateItem(index, { caption: event.target.value })}
          />
          <Button
            type="button"
            variant="outline"
            disabled={disabled || isPending}
            onClick={() => removeItem(index)}
          >
            Remove image
          </Button>
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
