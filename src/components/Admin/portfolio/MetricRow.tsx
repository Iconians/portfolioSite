"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/Admin/shared/ConfirmDialog";
import { FormField } from "@/components/Admin/shared/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updatePortfolioMetricAction } from "@/lib/actions/portfolio-metrics";

import type { PortfolioMetric } from "@/lib/types/portfolio";


interface MetricRowProps {
  metric: PortfolioMetric;
  isFirst: boolean;
  isLast: boolean;
  onUpdated: (metric: PortfolioMetric) => void;
  onDelete: (metricId: string) => Promise<void>;
  onReorder: (
    metricId: string,
    direction: "up" | "down"
  ) => Promise<PortfolioMetric[] | null>;
}

export function MetricRow({
  metric,
  isFirst,
  isLast,
  onUpdated,
  onDelete,
  onReorder,
}: MetricRowProps) {
  const [label, setLabel] = useState(metric.label);
  const [value, setValue] = useState(metric.value);
  const [description, setDescription] = useState(metric.description ?? "");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const result = await updatePortfolioMetricAction(metric.id, {
        label,
        value,
        description: description.trim() ? description : undefined,
      });

      if (result.success) {
        onUpdated(result.data);
        toast.success("Metric updated");
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await onDelete(metric.id);
      setConfirmOpen(false);
    });
  }

  function handleReorder(direction: "up" | "down") {
    startTransition(async () => {
      await onReorder(metric.id, direction);
    });
  }

  return (
    <>
      <div className="space-y-3 rounded-md border p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Label">
            <Input
              value={label}
              disabled={isPending}
              onChange={(event) => setLabel(event.target.value)}
            />
          </FormField>
          <FormField label="Value">
            <Input
              value={value}
              disabled={isPending}
              onChange={(event) => setValue(event.target.value)}
            />
          </FormField>
        </div>

        <FormField label="Description">
          <Textarea
            value={description}
            disabled={isPending}
            rows={2}
            onChange={(event) => setDescription(event.target.value)}
          />
        </FormField>

        <div className="flex flex-wrap gap-2">
          <Button type="button" disabled={isPending} onClick={handleSave}>
            {isPending ? "Saving..." : "Save metric"}
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
        title="Delete metric"
        description={`Remove "${metric.label}" from this project?`}
        confirmLabel="Delete metric"
        loading={isPending}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
