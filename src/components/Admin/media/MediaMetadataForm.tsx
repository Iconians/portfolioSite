"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateMediaMetadataAction } from "@/lib/actions/media";

import type { MediaAsset } from "@/lib/types/media";

interface MediaMetadataFormProps {
  asset: MediaAsset;
  onSaved: () => void;
  onCancel: () => void;
}

export function MediaMetadataForm({
  asset,
  onSaved,
  onCancel,
}: MediaMetadataFormProps) {
  const [altText, setAltText] = useState(asset.altText ?? "");
  const [caption, setCaption] = useState(asset.caption ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await updateMediaMetadataAction(asset.id, {
        altText: altText.trim() || null,
        caption: caption.trim() || null,
      });
      if (result.success) {
        toast.success("Media metadata saved");
        onSaved();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`alt-${asset.id}`}>Alt text</Label>
        <Input
          id={`alt-${asset.id}`}
          value={altText}
          onChange={(event) => setAltText(event.target.value)}
          placeholder="Describe the image for accessibility"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`caption-${asset.id}`}>Caption</Label>
        <Textarea
          id={`caption-${asset.id}`}
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          placeholder="Optional caption"
          rows={3}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save metadata"}
        </Button>
      </div>
    </form>
  );
}
