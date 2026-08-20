"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { MediaStorageFolder } from "@/lib/media/storage-paths";

interface UploadedAsset {
  id: string;
  filename: string;
  publicUrl: string;
  storageKey: string;
}

const FOLDER_OPTIONS: { value: MediaStorageFolder; label: string }[] = [
  { value: "portfolio-project", label: "Portfolio project image" },
  { value: "portfolio-profile", label: "Portfolio profile image" },
  { value: "general", label: "General media" },
];

export function MediaUploadTestForm() {
  const [file, setFile] = useState<File | null>(null);
  const [folder, setFolder] = useState<MediaStorageFolder>("portfolio-project");
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
      formData.append("folder", folder);
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
      <div className="space-y-2">
        <label htmlFor="media-folder" className="text-sm font-medium">
          Storage folder
        </label>
        <select
          id="media-folder"
          value={folder}
          onChange={(event) =>
            setFolder(event.target.value as MediaStorageFolder)
          }
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          {FOLDER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <input
        type="file"
        accept="image/*"
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
