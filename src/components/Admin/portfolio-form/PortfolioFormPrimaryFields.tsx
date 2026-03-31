import { ImageUpload } from "../ImageUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PortfolioFormSectionProps } from "./types";

interface PortfolioFormPrimaryFieldsProps extends PortfolioFormSectionProps {
  onImageUpload: (url: string) => void;
}

export function PortfolioFormPrimaryFields({
  register,
  errors,
  isPending,
  onImageUpload,
}: PortfolioFormPrimaryFieldsProps) {
  return (
    <>
      <div>
        <Label htmlFor="img">Image Path</Label>
        <div className="mt-2 flex gap-2">
          <Input
            id="img"
            {...register("img")}
            disabled={isPending}
            placeholder="/image.png"
            className="flex-1"
          />
          <ImageUpload onUpload={onImageUpload} />
        </div>
        {errors.img && <p className="mt-1 text-sm text-red-500">{errors.img.message}</p>}
      </div>

      <div>
        <Label htmlFor="caption">Caption</Label>
        <Input id="caption" {...register("caption")} disabled={isPending} />
        {errors.caption && (
          <p className="mt-1 text-sm text-red-500">{errors.caption.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="projectType">Project type (display order)</Label>
        <select
          id="projectType"
          {...register("projectType")}
          disabled={isPending}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">Not set (appears last)</option>
          <option value="saas">1. SaaS platform</option>
          <option value="client">2. Production client project</option>
          <option value="engineering">3. Engineering-heavy project</option>
          <option value="personal">4. Personal / experimental project</option>
        </select>
        <p className="mt-1 text-xs text-muted-foreground">
          Cards are ordered by this type on the homepage.
        </p>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          disabled={isPending}
          rows={4}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>
    </>
  );
}
