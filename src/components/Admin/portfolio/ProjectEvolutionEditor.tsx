"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { ProjectEvolutionRow } from "@/components/Admin/portfolio/ProjectEvolutionRow";
import { EmptyState } from "@/components/Admin/shared/EmptyState";
import { FormField } from "@/components/Admin/shared/FormField";
import { FormSection } from "@/components/Admin/shared/FormSection";
import { ProjectEvolution } from "@/components/Portfolio/ProjectEvolution";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createProjectVersionAction,
  deleteProjectVersionAction,
  reorderProjectVersionAction,
} from "@/lib/actions/portfolio-versions";

import type { ProjectVersion } from "@/lib/types/portfolio";


interface ProjectEvolutionEditorProps {
  portfolioId?: string;
  initialVersions?: ProjectVersion[];
  disableReorder?: boolean;
}

export function ProjectEvolutionEditor({
  portfolioId,
  initialVersions = [],
  disableReorder = false,
}: ProjectEvolutionEditorProps) {
  const [versions, setVersions] = useState(initialVersions);
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [versionLabel, setVersionLabel] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();

  if (!portfolioId) {
    return (
      <EmptyState
        title="Save the project first"
        description="Create the project, then return to this tab to add evolution milestones."
      />
    );
  }

  const projectId = portfolioId;

  function handleAddVersion() {
    const parsedYear = Number.parseInt(year, 10);
    if (Number.isNaN(parsedYear)) {
      toast.error("Year must be a valid number");
      return;
    }

    startTransition(async () => {
      const result = await createProjectVersionAction(projectId, {
        year: parsedYear,
        version: versionLabel,
        title,
        description: description.trim() ? description : undefined,
      });

      if (result.success) {
        setVersions((current) => [...current, result.data]);
        setVersionLabel("");
        setTitle("");
        setDescription("");
        toast.success("Version added");
      } else {
        toast.error(result.error);
      }
    });
  }

  async function handleReorder(versionId: string, direction: "up" | "down") {
    const result = await reorderProjectVersionAction(
      versionId,
      projectId,
      direction
    );

    if (result.success) {
      setVersions(result.data);
      return result.data;
    }

    toast.error(result.error);
    return null;
  }

  async function handleDelete(versionId: string) {
    const result = await deleteProjectVersionAction(versionId, projectId);
    if (result.success) {
      setVersions((current) => current.filter((version) => version.id !== versionId));
      toast.success("Version deleted");
      return;
    }

    toast.error(result.error);
  }

  return (
    <div className="space-y-6">
      <FormSection
        title="Evolution milestones"
        description="Version history for this project. Reorder entries to control timeline sequence."
      >
        {versions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No evolution milestones yet. Add your first version below.
          </p>
        ) : (
          <div className="space-y-4">
            {versions.map((version, index) => (
              <ProjectEvolutionRow
                key={version.id}
                portfolioId={projectId}
                version={version}
                disableReorder={disableReorder}
                isFirst={index === 0}
                isLast={index === versions.length - 1}
                onUpdated={(updated) =>
                  setVersions((current) =>
                    current.map((entry) =>
                      entry.id === updated.id ? updated : entry
                    )
                  )
                }
                onDelete={handleDelete}
                onReorder={handleReorder}
              />
            ))}
          </div>
        )}
      </FormSection>

      <FormSection
        title="Add milestone"
        description="Year, version label, and title are required."
      >
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
              placeholder="Initial release"
              onChange={(event) => setTitle(event.target.value)}
            />
          </FormField>
        </div>
        <FormField label="Description">
          <Textarea
            value={description}
            disabled={isPending}
            rows={3}
            placeholder="What changed in this milestone?"
            onChange={(event) => setDescription(event.target.value)}
          />
        </FormField>
        <Button
          type="button"
          disabled={isPending || !versionLabel.trim() || !title.trim()}
          onClick={handleAddVersion}
        >
          {isPending ? "Adding..." : "Add milestone"}
        </Button>
      </FormSection>

      {versions.length > 0 ? (
        <FormSection
          title="Timeline preview"
          description="Preview of the public evolution timeline using the current milestone order."
        >
          <ProjectEvolution versions={versions} />
        </FormSection>
      ) : null}
    </div>
  );
}
