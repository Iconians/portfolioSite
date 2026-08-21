import { FormField } from "@/components/Admin/shared/FormField";
import { FormSection } from "@/components/Admin/shared/FormSection";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  LIFECYCLE_STATUSES,
  PUBLISH_STATUSES,
} from "@/lib/types/portfolio";
import type { ProjectEditorSectionProps } from "./types";

const selectClassName =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export function OverviewSection({
  register,
  errors,
  isPending,
}: ProjectEditorSectionProps) {
  return (
    <FormSection
      title="Overview"
      description="Core project identity, status, and homepage card copy."
    >
      <FormField label="Title" error={errors.caption?.message}>
        <Input id="caption" {...register("caption")} disabled={isPending} />
      </FormField>

      <FormField label="Subtitle" error={errors.subtitle?.message}>
        <Input id="subtitle" {...register("subtitle")} disabled={isPending} />
      </FormField>

      <FormField label="Summary" error={errors.summary?.message}>
        <Textarea
          id="summary"
          {...register("summary")}
          disabled={isPending}
          rows={3}
        />
      </FormField>

      <FormField
        label="Card description"
        description="Shown on homepage project cards."
        error={errors.description?.message}
      >
        <Textarea
          id="description"
          {...register("description")}
          disabled={isPending}
          rows={4}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Lifecycle status" error={errors.lifecycleStatus?.message}>
          <select
            id="lifecycleStatus"
            {...register("lifecycleStatus")}
            disabled={isPending}
            className={selectClassName}
          >
            {LIFECYCLE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Publish status" error={errors.publishStatus?.message}>
          <select
            id="publishStatus"
            {...register("publishStatus")}
            disabled={isPending}
            className={selectClassName}
          >
            {PUBLISH_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField
        label="Project type"
        description="Controls homepage card ordering."
        error={errors.projectType?.message}
      >
        <select
          id="projectType"
          {...register("projectType")}
          disabled={isPending}
          className={selectClassName}
        >
          <option value="">Not set (appears last)</option>
          <option value="saas">1. SaaS platform</option>
          <option value="client">2. Production client project</option>
          <option value="engineering">3. Engineering-heavy project</option>
          <option value="personal">4. Personal / experimental project</option>
        </select>
      </FormField>

      <div className="grid gap-4 sm:grid-cols-3">
        <FormField label="Sort order" error={errors.sortOrder?.message}>
          <Input
            id="sortOrder"
            type="number"
            min={0}
            {...register("sortOrder", { valueAsNumber: true })}
            disabled={isPending}
          />
        </FormField>

        <FormField label="Start date" error={errors.startDate?.message}>
          <Input
            id="startDate"
            type="date"
            {...register("startDate")}
            disabled={isPending}
          />
        </FormField>

        <FormField label="End date" error={errors.endDate?.message}>
          <Input
            id="endDate"
            type="date"
            {...register("endDate")}
            disabled={isPending}
          />
        </FormField>
      </div>

      <FormField
        label="Slug"
        description="Leave blank to auto-generate from title."
        error={errors.slug?.message}
      >
        <Input id="slug" {...register("slug")} disabled={isPending} />
      </FormField>
    </FormSection>
  );
}
