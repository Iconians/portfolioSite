import { MediaPicker } from "@/components/Admin/media/MediaPicker";
import { FormField } from "@/components/Admin/shared/FormField";
import { FormSection } from "@/components/Admin/shared/FormSection";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { ProjectEditorSectionProps } from "./types";

interface LinksSeoSectionProps extends ProjectEditorSectionProps {
  ogImageUrl: string;
  onSelectOg: (asset: { id: string; publicUrl: string }) => void;
}

export function LinksSeoSection({
  register,
  errors,
  isPending,
  ogImageUrl,
  onSelectOg,
}: LinksSeoSectionProps) {
  return (
    <FormSection
      title="Links & SEO"
      description="External links and search/social metadata."
    >
      <FormField label="Project URL" error={errors.url?.message}>
        <Input
          id="url"
          {...register("url")}
          disabled={isPending}
          placeholder="https://example.com or #"
        />
      </FormField>

      <FormField label="GitHub URL" error={errors.github?.message}>
        <Input
          id="github"
          {...register("github")}
          disabled={isPending}
          placeholder="https://github.com/user/repo"
        />
      </FormField>

      <FormField label="Documentation URL" error={errors.docs?.message}>
        <Input
          id="docs"
          {...register("docs")}
          disabled={isPending}
          placeholder="https://docs.example.com"
        />
      </FormField>

      <FormField label="SEO title" error={errors.seoTitle?.message}>
        <Input id="seoTitle" {...register("seoTitle")} disabled={isPending} />
      </FormField>

      <FormField label="SEO description" error={errors.seoDescription?.message}>
        <Textarea
          id="seoDescription"
          {...register("seoDescription")}
          disabled={isPending}
          rows={3}
        />
      </FormField>

      <FormField label="Open Graph image">
        <div className="space-y-3">
          {ogImageUrl ? (
            <div className="rounded-md border p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ogImageUrl}
                alt="Selected OG image"
                className="max-h-40 rounded object-contain"
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Optional social share image. Defaults to hero when unset.
            </p>
          )}
          <MediaPicker
            triggerLabel="Choose OG image"
            onSelect={(asset) =>
              onSelectOg({ id: asset.id, publicUrl: asset.publicUrl })
            }
          />
        </div>
      </FormField>
    </FormSection>
  );
}
