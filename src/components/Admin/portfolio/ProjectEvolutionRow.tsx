"use client";

import { useState, useTransition } from "react";
import { FormField } from "@/components/Admin/shared/FormField";
import { ConfirmDialog } from "@/components/Admin/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateProjectVersionAction } from "@/lib/actions/portfolio-versions";
import type { ProjectVersion } from "@/lib/types/portfolio";
import { toast } from "sonner";

interface ProjectEvolutionRowProps {
  version: ProjectVersion;
  isFirst: boolean;
  isLast: boolean;
  onUpdated: (version: ProjectVersion) => void;
  onDelete: (versionId: string) => Promise<void>;
  onReorder: (
    versionId: string,
    direction: "up" | "down"
  ) => Promise<ProjectVersion[] | null>;
}

export function ProjectEvolutionRow({
  version,
  isFirst,
  isLast,
  onUpdated,
  onDelete,
  onReorder,
}: ProjectEvolutionRowProps) {
  const [year, setYear] = useState(String(version.year));
  const [versionLabel, setVersionLabel] = useState(version.version);
  const [title, setTitle] = useState(version.title);
  const [description, setDescription] = useState(version.description ?? "");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    const parsedYear = Number.parseInt(year, 10);
    if (Number.isNaN(parsedYear)) {
      toast.error("Year must be a valid number");
      return;
    }

    startTransition(async () => {
      const result = await updateProjectVersionAction(version.id, {
        year: parsedYear,
        version: versionLabel,
        title,
        description: description.trim() ? description : undefined,
      });

      if (result.success) {
        onUpdated(result.data);
        toast.success("Version updated");
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await onDelete(version.id);
      setConfirmOpen(false);
    });
  }

  function handleReorder(direction: "up" | "down") {
    startTransition(async () => {
      await onReorder(version.id, direction);
    });
  }

  return (
    <>
      <div className="space-y-3 rounded-md border p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <FormField label="Year">
            <Input
              type="number"
              min={1900}
              max={2100}
              value={year}
              disabled={isPending}
              onChange={(event) => setYear(event.target.value)}
            />
          </FormField>
          <FormField label="Version">
            <Input
              value={versionLabel}
              disabled={isPending}
              placeholder="v1.0"
              onChange={(event) => setVersionLabel(event.target.value)}
            />
          </FormField>
          <FormField label="Title">
            <Input
              value={title}
              disabled={isPending}
              onChange={(event) => setTitle(event.target.value)}
            />
          </FormField>
        </div>

        <FormField label="Description">
          <Textarea
            value={description}
            disabled={isPending}
            rows={3}
            onChange={(event) => setDescription(event.target.value)}
          />
        </FormField>

        <div className="flex flex-wrap gap-2">
          <Button type="button" disabled={isPending} onClick={handleSave}>
            {isPending ? "Saving..." : "Save version"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isPending || isFirst}
            onClick={() => handleReorder("up")}
          >
            Move up
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isPending || isLast}
            onClick={() => handleReorder("down")}
          >
            Move down
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={() => setConfirmOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete version"
        description={`Remove "${version.title}" from this project's evolution?`}
        confirmLabel="Delete version"
        loading={isPending}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
