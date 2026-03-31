import { Button } from "@/components/ui/button";

interface ArticleEditorActionsProps {
  isPending: boolean;
  isEditing: boolean;
  canPublish: boolean;
  onPublish: () => void;
}

export function ArticleEditorActions({
  isPending,
  isEditing,
  canPublish,
  onPublish,
}: ArticleEditorActionsProps) {
  return (
    <div className="flex gap-2">
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : isEditing ? "Update Article" : "Create Article"}
      </Button>
      {canPublish && (
        <Button
          type="button"
          onClick={onPublish}
          disabled={isPending}
          variant="outline"
        >
          Publish
        </Button>
      )}
    </div>
  );
}
