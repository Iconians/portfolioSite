"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/**
 * @deprecated Use MediaPicker with /api/media/upload for portfolio and admin media workflows.
 */
interface ImageUploadProps {
  onUpload: (url: string) => void;
}

export function ImageUpload({ onUpload }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.ok && data.asset?.publicUrl) {
        onUpload(data.asset.publicUrl);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleUpload}
        disabled={uploading}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        id="image-upload"
      />
      <Button
        type="button"
        variant="outline"
        disabled={uploading}
        asChild
        className="pointer-events-none"
      >
        <label htmlFor="image-upload" className="cursor-pointer">
          {uploading ? "Uploading..." : "Upload Image"}
        </label>
      </Button>
    </div>
  );
}
