"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface UploadedAsset {
  id: string;
  filename: string;
  publicUrl: string;
  storageKey: string;
}

export function MediaUploadTestForm() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [asset, setAsset] = useState<UploadedAsset | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload(event: React.FormEvent) {
    event.preventDefault();
    if (!file) {
      setStatus("Choose an image first.");
      return;
    }

    setLoading(true);
    setStatus("");
    setAsset(null);

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

      setAsset(data.asset);
      setStatus("Upload succeeded.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleUpload} className="space-y-4 max-w-lg">
      <p className="text-sm text-muted-foreground">
        Uploads use the canonical portfolio project hero prefix:{" "}
        <code className="text-xs">portfolio/projects/heroes/</code>
      </p>
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
      />
      <Button type="submit" disabled={loading || !file}>
        {loading ? "Uploading..." : "Upload to media storage"}
      </Button>
      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
      {asset ? (
        <div className="space-y-2 rounded-md border p-4 text-sm">
          <p>
            <span className="font-medium">ID:</span> {asset.id}
          </p>
          <p>
            <span className="font-medium">Key:</span> {asset.storageKey}
          </p>
          <p>
            <span className="font-medium">URL:</span>{" "}
            <a
              href={asset.publicUrl}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              {asset.publicUrl}
            </a>
          </p>
        </div>
      ) : null}
    </form>
  );
}
