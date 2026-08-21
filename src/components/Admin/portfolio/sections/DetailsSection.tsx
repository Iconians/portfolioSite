import { FormField } from "@/components/Admin/shared/FormField";
import { FormSection } from "@/components/Admin/shared/FormSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { ProjectEditorSectionProps } from "./types";
import type { UseFieldArrayRemove } from "react-hook-form";

interface DetailsSectionProps extends ProjectEditorSectionProps {
  categoryFields: { id: string }[];
  appendCategory: (value: string) => void;
  removeCategory: UseFieldArrayRemove;
}

export function DetailsSection({
  register,
  errors,
  isPending,
  categoryFields,
  appendCategory,
  removeCategory,
}: DetailsSectionProps) {
  return (
    <FormSection
      title="Details"
      description="Categories and legacy homepage card metadata."
    >
      <FormField label="Categories" error={errors.category?.message}>
        <div className="space-y-2">
          {categoryFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...register(`category.${index}`)}
                disabled={isPending}
              />
              <Button
                type="button"
                variant="outline"
                disabled={isPending || categoryFields.length === 1}
                onClick={() => removeCategory(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => appendCategory("")}
          >
            Add category
          </Button>
        </div>
      </FormField>

      <FormField
        label="Key features (legacy)"
        description="One line, separate items with • (bullet)."
      >
        <Input
          id="keyFeatures"
          {...register("keyFeatures")}
          disabled={isPending}
          placeholder="Member signups • Event scheduling • Stripe payments"
        />
      </FormField>

      <FormField
        label="Tech highlights (legacy)"
        description="One line, separate items with • (bullet)."
      >
        <Input
          id="highlights"
          {...register("highlights")}
          disabled={isPending}
          placeholder="REST API design • PostgreSQL schema • SSR pages"
        />
      </FormField>

      <FormField label="Role (legacy)">
        <Textarea
          id="role"
          {...register("role")}
          disabled={isPending}
          rows={2}
          placeholder="Full-stack development and SaaS architecture"
        />
      </FormField>
    </FormSection>
  );
}
