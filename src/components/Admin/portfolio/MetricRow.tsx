"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/Admin/shared/ConfirmDialog";
import { FormField } from "@/components/Admin/shared/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updatePortfolioMetricAction } from "@/lib/actions/portfolio-metrics";

import type { PortfolioMetric } from "@/lib/types/portfolio";


interface MetricRowProps {
  portfolioId: string;
  metric: PortfolioMetric;
  isFirst: boolean;
  isLast: boolean;
  disableReorder?: boolean;
  onUpdated: (metric: PortfolioMetric) => void;
  onDelete: (metricId: string) => Promise<void>;
  onReorder: (
    metricId: string,
    direction: "up" | "down"
  ) => Promise<PortfolioMetric[] | null>;
}

export function MetricRow({
  portfolioId,
  metric,
  isFirst,
  isLast,
  disableReorder = false,
  onUpdated,
  onDelete,
  onReorder,
}: MetricRowProps) {
  const [label, setLabel] = useState(metric.label);
  const [value, setValue] = useState(metric.value);
  const [description, setDescription] = useState(metric.description ?? "");
  const [showOnBusiness, setShowOnBusiness] = useState(metric.showOnBusiness);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const result = await updatePortfolioMetricAction(metric.id, {
        label,
        value,
        description: description.trim() ? description : undefined,
        showOnBusiness,
      }, portfolioId);

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

        <div className="flex items-center gap-3">
          <input
            id={`showOnBusiness-${metric.id}`}
            type="checkbox"
            checked={showOnBusiness}
            disabled={isPending}
            className="h-4 w-4 rounded border border-input"
            onChange={(event) => setShowOnBusiness(event.target.checked)}
          />
          <Label htmlFor={`showOnBusiness-${metric.id}`} className="font-normal">
            Show on DevLaunch business projection
          </Label>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" disabled={isPending} onClick={handleSave}>
            {isPending ? "Saving..." : "Save metric"}
          </Button>
          {!disableReorder ? (
            <>
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
            </>
          ) : null}
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
