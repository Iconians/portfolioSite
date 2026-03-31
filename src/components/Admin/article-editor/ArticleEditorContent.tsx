import { EditorContent } from "@tiptap/react";
import { MDXRemote } from "next-mdx-remote";
import AnimatedParagraph from "@/components/Animations/AnimatedParagraphs";
import AnimatedHeading from "@/components/Animations/AnimateHeading";
import AnimatedList, {
  AnimatedListItem,
} from "@/components/Animations/AnimatedList";
import { AnimatedCode } from "@/components/Animations/AnimatedCode";
import AnimatedWrapper from "@/components/Animations/AnimatedWrapper";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { ArticleEditorContentProps } from "./types";

export function ArticleEditorContent({
  editor,
  preview,
  onRefreshPreview,
  initialContent,
}: ArticleEditorContentProps) {
  return (
    <>
      <div className="grid h-[600px] grid-cols-2 gap-4">
        <div className="flex flex-col rounded border p-4">
          <Label className="mb-2">Content Editor (Rich Text)</Label>
          <div className="min-h-0 flex-1 overflow-auto rounded border bg-background p-4">
            {editor && <EditorContent editor={editor} />}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Tip: Use the editor to create new content. For existing articles,
            content is stored as MDX.
          </p>
        </div>
        <div className="flex flex-col rounded border p-4">
          <div className="mb-2 flex items-center justify-between">
            <Label>Preview</Label>
            <Button onClick={onRefreshPreview} size="sm" variant="outline">
              Refresh Preview
            </Button>
          </div>
          <div className="min-h-0 flex-1 overflow-auto">
            {preview ? (
              <MDXRemote
                {...preview}
                components={{
                  AnimatedParagraph,
                  AnimatedHeading,
                  AnimatedList,
                  AnimatedListItem,
                  AnimatedCode,
                  AnimatedWrapper,
                }}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Click &quot;Refresh Preview&quot; to see rendered content
              </p>
            )}
          </div>
        </div>
      </div>

      {initialContent && (
        <div className="mt-4 rounded bg-muted p-4">
          <Label className="mb-2">Current MDX Content (for reference)</Label>
          <pre className="max-h-40 overflow-auto rounded bg-background p-2 text-xs">
            {initialContent.substring(0, 500)}...
          </pre>
        </div>
      )}
    </>
  );
}
