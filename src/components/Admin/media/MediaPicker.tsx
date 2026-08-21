"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { listMediaAssetsAction } from "@/lib/actions/media";

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
}

export function MediaPicker({
  onSelect,
  triggerLabel = "Choose from library",
}: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleOpen() {
    setOpen(true);
    setLoading(true);
    setError(null);

    const result = await listMediaAssetsAction();
    if (result.success) {
      setAssets(result.data);
    } else {
      setError(result.error);
      setAssets([]);
    }
    setLoading(false);
  }

  function handleSelect(asset: MediaAsset) {
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
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Upload failed");
      }

      const asset = data.asset as MediaAsset;
      setAssets((current) => [asset, ...current]);
      handleSelect(asset);
      toast.success("Image uploaded and selected");
    } catch (uploadError) {
      toast.error(
        uploadError instanceof Error ? uploadError.message : "Upload failed"
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <>
      <Button type="button" variant="outline" onClick={handleOpen}>
        {triggerLabel}
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="media-picker-title"
            className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-lg border bg-background shadow-lg"
          >
            <div className="flex items-center justify-between border-b p-4">
              <h2 id="media-picker-title" className="text-lg font-semibold">
                Media library
              </h2>
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={handleUpload}
                />
                <Button
                  type="button"
                  variant="secondary"
                  disabled={uploading || loading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? "Uploading..." : "Upload new"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Close
                </Button>
              </div>
            </div>

            <div className="overflow-y-auto p-4">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading media...</p>
              ) : null}
              {error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : null}
              {!loading && !error && assets.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No media yet. Upload an image to use it as a project hero.
                </p>
              ) : null}
              {!loading && assets.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {assets.map((asset) => (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => handleSelect(asset)}
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
                      </div>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
