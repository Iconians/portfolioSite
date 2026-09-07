"use client";

import { FormField } from "@/components/Admin/shared/FormField";
import { FormSection } from "@/components/Admin/shared/FormSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { ProjectEditorSectionProps } from "./types";

function CheckboxField({
  id,
  label,
  checked,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        className="h-4 w-4 rounded border border-input"
        onChange={(event) => onChange(event.target.checked)}
      />
      <Label htmlFor={id} className="font-normal">
        {label}
      </Label>
    </div>
  );
}

export function PresentationSection({
  register,
  errors,
  isPending,
  setValue,
  watch,
}: ProjectEditorSectionProps) {
  const devlaunchIsVisible = watch("devlaunchIsVisible");
  const devlaunchIsFeatured = watch("devlaunchIsFeatured");
  const engineeringPortfolioIsVisible = watch("engineeringPortfolioIsVisible");
  const engineeringPortfolioIsFeatured = watch("engineeringPortfolioIsFeatured");

  return (
    <div className="space-y-6">
      <FormSection
        title="DevLaunch public site"
        description="Controls how this case study appears on devlaunchsystems.com."
        className="border-blue-200/60 bg-blue-50/30 dark:border-blue-900/40 dark:bg-blue-950/20"
      >
        <div className="space-y-3">
          <CheckboxField
            id="devlaunchIsVisible"
            label="Visible on DevLaunch"
            checked={devlaunchIsVisible}
            disabled={isPending}
            onChange={(checked) =>
              setValue("devlaunchIsVisible", checked, { shouldDirty: true })
            }
          />
          <CheckboxField
            id="devlaunchIsFeatured"
            label="Featured on DevLaunch"
            checked={devlaunchIsFeatured}
            disabled={isPending}
            onChange={(checked) =>
              setValue("devlaunchIsFeatured", checked, { shouldDirty: true })
            }
          />
        </div>

        <FormField label="Display order on DevLaunch" error={errors.devlaunchSortOrder?.message}>
          <Input
            type="number"
            min={0}
            max={9999}
            disabled={isPending}
            {...register("devlaunchSortOrder", { valueAsNumber: true })}
          />
        </FormField>

        <FormField label="Badge" error={errors.badge?.message}>
          <Input disabled={isPending} placeholder="e.g. SaaS" {...register("badge")} />
        </FormField>

        <FormField label="Best for" error={errors.bestFor?.message}>
          <Input
            disabled={isPending}
            placeholder="e.g. Growing teams needing custom workflows"
            {...register("bestFor")}
          />
        </FormField>

        <FormField label="Business context note" error={errors.businessContextNote?.message}>
          <Textarea
            disabled={isPending}
            rows={3}
            placeholder="Additional business-facing context"
            {...register("businessContextNote")}
          />
        </FormField>

        <FormField label="Business outcome" error={errors.businessOutcome?.message}>
          <Textarea
            disabled={isPending}
            rows={3}
            placeholder="Primary business outcome"
            {...register("businessOutcome")}
          />
        </FormField>

        <FormField label="Results narrative" error={errors.resultsNarrative?.message}>
          <Textarea
            disabled={isPending}
            rows={4}
            placeholder="Narrative summary of measurable results"
            {...register("resultsNarrative")}
          />
        </FormField>

        <FormField
          label="Business summary override"
          error={errors.businessSummaryOverride?.message}
        >
          <Textarea
            disabled={isPending}
            rows={3}
            placeholder="Overrides shared summary for DevLaunch business audience"
            {...register("businessSummaryOverride")}
          />
        </FormField>

        <FormField
          label="Business problem override"
          error={errors.businessProblemOverride?.message}
        >
          <Textarea
            disabled={isPending}
            rows={3}
            placeholder="Overrides shared problem for DevLaunch business audience"
            {...register("businessProblemOverride")}
          />
        </FormField>

        <FormField
          label="Business solution override"
          error={errors.businessSolutionOverride?.message}
        >
          <Textarea
            disabled={isPending}
            rows={3}
            placeholder="Overrides shared solution for DevLaunch business audience"
            {...register("businessSolutionOverride")}
          />
        </FormField>
      </FormSection>

      <FormSection
        title="Engineering Portfolio"
        description="Controls how this project appears on the engineering portfolio site."
        className="border-emerald-200/60 bg-emerald-50/30 dark:border-emerald-900/40 dark:bg-emerald-950/20"
      >
        <div className="space-y-3">
          <CheckboxField
            id="engineeringPortfolioIsVisible"
            label="Visible on Engineering Portfolio"
            checked={engineeringPortfolioIsVisible}
            disabled={isPending}
            onChange={(checked) =>
              setValue("engineeringPortfolioIsVisible", checked, { shouldDirty: true })
            }
          />
          <CheckboxField
            id="engineeringPortfolioIsFeatured"
            label="Featured on Engineering Portfolio"
            checked={engineeringPortfolioIsFeatured}
            disabled={isPending}
            onChange={(checked) =>
              setValue("engineeringPortfolioIsFeatured", checked, { shouldDirty: true })
            }
          />
        </div>

        <FormField
          label="Display order on Engineering Portfolio"
          error={errors.engineeringPortfolioSortOrder?.message}
        >
          <Input
            type="number"
            min={0}
            max={9999}
            disabled={isPending}
            {...register("engineeringPortfolioSortOrder", { valueAsNumber: true })}
          />
        </FormField>

        <FormField
          label="Engineering summary override"
          error={errors.engineeringSummaryOverride?.message}
        >
          <Textarea
            disabled={isPending}
            rows={4}
            placeholder="Overrides shared summary for the engineering portfolio audience"
            {...register("engineeringSummaryOverride")}
          />
        </FormField>
      </FormSection>
    </div>
  );
}
