import { FormField } from "@/components/Admin/shared/FormField";
import { FormSection } from "@/components/Admin/shared/FormSection";
import { MediaPicker } from "@/components/Admin/media/MediaPicker";
import { Button } from "@/components/ui/button";

interface ArticleEditorCoverProps {
  coverImageUrl: string;
  coverImageAlt?: string;
  isPending: boolean;
  onSelectCover: (asset: { id: string; publicUrl: string; altText: string | null }) => void;
  onClearCover: () => void;
}

export function ArticleEditorCover({
  coverImageUrl,
  coverImageAlt,
  isPending,
  onSelectCover,
  onClearCover,
}: ArticleEditorCoverProps) {
  return (
    <FormSection
      title="Cover image"
      description="Optional cover image for blog cards and article headers."
    >
      <FormField label="Cover media">
        <div className="space-y-3">
          {coverImageUrl ? (
            <div className="rounded-md border p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImageUrl}
                alt={coverImageAlt || "Selected article cover"}
                className="max-h-48 rounded object-contain"
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Choose an image from the media library or upload a new one.
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <MediaPicker
              triggerLabel="Choose cover image"
              onSelect={(asset) => onSelectCover(asset)}
            />
            {coverImageUrl ? (
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={onClearCover}
              >
                Remove cover
              </Button>
            ) : null}
          </div>
        </div>
      </FormField>
    </FormSection>
  );
}
