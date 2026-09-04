"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { MetricRow } from "@/components/Admin/portfolio/MetricRow";
import { EmptyState } from "@/components/Admin/shared/EmptyState";
import { FormField } from "@/components/Admin/shared/FormField";
import { FormSection } from "@/components/Admin/shared/FormSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createPortfolioMetricAction,
  deletePortfolioMetricAction,
  reorderPortfolioMetricAction,
} from "@/lib/actions/portfolio-metrics";

import type { PortfolioMetric } from "@/lib/types/portfolio";


interface MetricEditorProps {
  portfolioId?: string;
  initialMetrics?: PortfolioMetric[];
  disableReorder?: boolean;
}

export function MetricEditor({
  portfolioId,
  initialMetrics = [],
  disableReorder = false,
}: MetricEditorProps) {
  const [metrics, setMetrics] = useState(initialMetrics);
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();

  if (!portfolioId) {
    return (
      <EmptyState
        title="Save the project first"
        description="Create the project, then return to this tab to add metrics."
      />
    );
  }

  const projectId = portfolioId;

  function handleAddMetric() {
    startTransition(async () => {
      const result = await createPortfolioMetricAction(projectId, {
        label,
        value,
        description: description.trim() ? description : undefined,
      });

      if (result.success) {
        setMetrics((current) => [...current, result.data]);
        setLabel("");
        setValue("");
        setDescription("");
        toast.success("Metric added");
      } else {
        toast.error(result.error);
      }
    });
  }

  async function handleReorder(metricId: string, direction: "up" | "down") {
    const result = await reorderPortfolioMetricAction(
      metricId,
      projectId,
      direction
    );

    if (result.success) {
      setMetrics(result.data);
      return result.data;
    }

    toast.error(result.error);
    return null;
  }

  async function handleDelete(metricId: string) {
    const result = await deletePortfolioMetricAction(metricId, projectId);
    if (result.success) {
      setMetrics((current) => current.filter((metric) => metric.id !== metricId));
      toast.success("Metric deleted");
      return;
    }

    toast.error(result.error);
  }

  return (
    <div className="space-y-6">
      <FormSection
        title="Project metrics"
        description="Quantitative highlights shown on project detail pages in a later release."
      >
        {metrics.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No metrics yet. Add your first stat below.
          </p>
        ) : (
          <div className="space-y-4">
            {metrics.map((metric, index) => (
              <MetricRow
                key={metric.id}
                portfolioId={projectId}
                metric={metric}
                disableReorder={disableReorder}
                isFirst={index === 0}
                isLast={index === metrics.length - 1}
                onUpdated={(updated) =>
                  setMetrics((current) =>
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
        title="Add metric"
        description="Label and value are required. Description is optional."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Label">
            <Input
              value={label}
              disabled={isPending}
              placeholder="Projects shipped"
              onChange={(event) => setLabel(event.target.value)}
            />
          </FormField>
          <FormField label="Value">
            <Input
              value={value}
              disabled={isPending}
              placeholder="12"
              onChange={(event) => setValue(event.target.value)}
            />
          </FormField>
        </div>
        <FormField label="Description">
          <Textarea
            value={description}
            disabled={isPending}
            rows={2}
            placeholder="Optional context for this metric"
            onChange={(event) => setDescription(event.target.value)}
          />
        </FormField>
        <Button
          type="button"
          disabled={isPending || !label.trim() || !value.trim()}
          onClick={handleAddMetric}
        >
          {isPending ? "Adding..." : "Add metric"}
        </Button>
      </FormSection>
    </div>
  );
}
