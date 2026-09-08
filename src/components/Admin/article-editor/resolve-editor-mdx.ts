import { serializeToMDX } from "@/components/Admin/mdxSerializer";
import { isMeaningfulArticleMdx } from "@/lib/articles/article-content";

interface TipTapDocument {
  type: "doc";
  content?: Array<{ type: string; content?: unknown[] }>;
}

/**
 * Serialize TipTap document to MDX only when it contains meaningful body content.
 * Returns undefined for untouched/empty editors so updates preserve existing content.
 */
export function resolveEditorMdxForSubmit(input: {
  editorDocument: TipTapDocument | null | undefined;
  fallbackMdx?: string;
  isEditingExisting: boolean;
}): string | undefined {
  const editorMdx =
    input.editorDocument && input.editorDocument.content
      ? serializeToMDX(input.editorDocument)
      : "";

  if (isMeaningfulArticleMdx(editorMdx)) {
    return editorMdx;
  }

  if (input.isEditingExisting) {
    return undefined;
  }

  if (isMeaningfulArticleMdx(input.fallbackMdx)) {
    return input.fallbackMdx;
  }

  return editorMdx || input.fallbackMdx || "";
}
