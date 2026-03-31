import type { UseFieldArrayRemove } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PortfolioFormData } from "./types";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

interface PortfolioFormCategoriesProps {
  register: UseFormRegister<PortfolioFormData>;
  errors: FieldErrors<PortfolioFormData>;
  fields: { id: string }[];
  append: (value: string) => void;
  remove: UseFieldArrayRemove;
  isPending: boolean;
}

export function PortfolioFormCategories({
  register,
  errors,
  fields,
  append,
  remove,
  isPending,
}: PortfolioFormCategoriesProps) {
  return (
    <div>
      <Label>Categories</Label>
      {fields.map((field, index) => (
        <div key={field.id} className="mt-2 flex gap-2">
          <Input {...register(`category.${index}`)} disabled={isPending} />
          <Button
            type="button"
            variant="outline"
            onClick={() => remove(index)}
            disabled={isPending || fields.length === 1}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => append("")}
        disabled={isPending}
        className="mt-2"
      >
        Add Category
      </Button>
      {errors.category && (
        <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
      )}
    </div>
  );
}
