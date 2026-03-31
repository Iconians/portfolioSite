import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ArticleEditorFieldsProps } from "./types";

export function ArticleEditorFields({
  register,
  errors,
  isPending,
}: ArticleEditorFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            {...register("title")}
            disabled={isPending}
            className={`mt-2 ${errors.title ? "border-red-500" : ""}`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            {...register("slug")}
            disabled={isPending}
            className={`mt-2 ${errors.slug ? "border-red-500" : ""}`}
          />
          {errors.slug && (
            <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          disabled={isPending}
          rows={3}
          className="mt-2"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            {...register("tags")}
            disabled={isPending}
            placeholder="tag1, tag2, tag3"
            className="mt-2"
          />
        </div>
        <div className="mt-6 flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("featured")}
              disabled={isPending}
            />
            <span>Featured</span>
          </label>
          <select
            {...register("status")}
            disabled={isPending}
            className="rounded-md border px-3 py-2"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
    </>
  );
}
