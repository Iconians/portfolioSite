"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function MediaLibraryUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setLoading(true);
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
      toast.success("Image uploaded");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setLoading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
      >
        {loading ? "Uploading..." : "Upload image"}
      </Button>
    </div>
  );
}
