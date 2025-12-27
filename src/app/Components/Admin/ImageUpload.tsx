"use client";

import { useState } from "react";
import { Button } from "@/app/Components/ui/button";
import { toast } from "sonner";

interface ImageUploadProps {
  onUpload: (url: string) => void;
}

export function ImageUpload({ onUpload }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        onUpload(data.url);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
