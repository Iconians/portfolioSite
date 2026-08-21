import { Button } from "@/components/ui/button";

interface ArticleEditorActionsProps {
  isPending: boolean;
  isEditing: boolean;
  canPublish: boolean;
  onPublish: () => void;
}

function articleSubmitLabel(isPending: boolean, isEditing: boolean): string {
  if (isPending) {return "Saving...";}
  if (isEditing) {return "Update Article";}
  return "Create Article";
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
        {articleSubmitLabel(isPending, isEditing)}
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
