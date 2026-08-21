"use client";

import { MediaPicker } from "@/components/Admin/media/MediaPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { PortfolioGalleryItem } from "@/lib/types/portfolio";

interface GalleryEditorProps {
  items: PortfolioGalleryItem[];
  onChange: (items: PortfolioGalleryItem[]) => void;
  disabled?: boolean;
}

export function GalleryEditor({
  items,
  onChange,
  disabled = false,
}: GalleryEditorProps) {
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
    onChange(
      items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      )
    );
  }

  function removeItem(index: number) {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Gallery images</Label>
        <p className="mt-1 text-xs text-muted-foreground">
          Add images from the media library. Captions and alt text are optional.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No gallery images yet.</p>
      ) : null}

      {items.map((item, index) => (
        <div key={`${item.url}-${index}`} className="space-y-3 rounded-md border p-3">
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
            disabled={disabled}
            placeholder="Alt text"
            onChange={(event) => updateItem(index, { alt: event.target.value })}
          />
          <Input
            value={item.caption ?? ""}
            disabled={disabled}
            placeholder="Caption"
            onChange={(event) =>
              updateItem(index, { caption: event.target.value })
            }
          />
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={() => removeItem(index)}
          >
            Remove image
          </Button>
        </div>
      ))}

      <MediaPicker
        triggerLabel="Add gallery image"
        onSelect={(asset) => addItem(asset)}
      />
    </div>
  );
}
