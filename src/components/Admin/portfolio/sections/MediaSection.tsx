import { FormField } from "@/components/Admin/shared/FormField";
import { FormSection } from "@/components/Admin/shared/FormSection";
import { MediaPicker } from "@/components/Admin/media/MediaPicker";
import { GalleryEditor } from "@/components/Admin/portfolio/GalleryEditor";
import type { ProjectEditorSectionProps } from "./types";

interface MediaSectionProps extends ProjectEditorSectionProps {
  heroImageUrl: string;
  onSelectHero: (asset: { id: string; publicUrl: string }) => void;
}

export function MediaSection({
  register,
  errors,
  isPending,
  heroImageUrl,
  onSelectHero,
  setValue,
  watch,
}: MediaSectionProps) {
  const gallery = watch("gallery");

  return (
    <FormSection
      title="Media"
      description="Hero image and optional gallery for project detail pages."
    >
      <FormField label="Hero image" error={errors.img?.message}>
        <div className="space-y-3">
          {heroImageUrl ? (
            <div className="rounded-md border p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImageUrl}
                alt="Selected project hero"
                className="max-h-48 rounded object-contain"
              />
              <p className="mt-2 truncate text-xs text-muted-foreground">
                {heroImageUrl}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Choose an image from the media library or upload a new one.
            </p>
          )}
          <MediaPicker
            onSelect={(asset) =>
              onSelectHero({ id: asset.id, publicUrl: asset.publicUrl })
            }
          />
          <input type="hidden" {...register("img")} />
        </div>
      </FormField>

      <GalleryEditor
        items={gallery}
        disabled={isPending}
        onChange={(items) =>
          setValue("gallery", items, { shouldDirty: true, shouldValidate: true })
        }
      />
    </FormSection>
  );
}
