"use client";

import { Button } from "@/components/ui/button";

import type { ProjectPlatformMediaPickerItem } from "@/lib/project-write/platform-media-types";

interface ProjectMediaPendingCleanupProps {
  items: ProjectPlatformMediaPickerItem[];
  cleaningUpId: string | null;
  onRemove: (mediaId: string) => void;
}

export function ProjectMediaPendingCleanup({
  items,
  cleaningUpId,
  onRemove,
}: ProjectMediaPendingCleanupProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-3 rounded-md border border-dashed p-4">
      <div>
        <h3 className="text-sm font-medium">Failed upload cleanup</h3>
        <p className="text-xs text-muted-foreground">
          Pending records from interrupted uploads. Remove them here; this does
          not clear a confirmed hero.
        </p>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{item.filename}</p>
              <p className="text-xs text-muted-foreground">
                {item.role} · {item.uploadStatus}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={cleaningUpId === item.id}
              onClick={() => onRemove(item.id)}
            >
              {cleaningUpId === item.id ? "Removing..." : "Remove"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
