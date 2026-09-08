import { describe, expect, test } from "bun:test";

import { resolveEditorMdxForSubmit } from "@/components/Admin/article-editor/resolve-editor-mdx";
import { serializeToMDX } from "@/components/Admin/mdxSerializer";
import {
  isMeaningfulArticleMdx,
  resolveArticleContentForUpdate,
} from "@/lib/articles/article-content";

const EXISTING_BODY = `<AnimatedParagraph>
  Preserved article body with real content.
</AnimatedParagraph>
`;

const STRUCTURAL_EMPTY_MDX = `<AnimatedParagraph>

</AnimatedParagraph>
`;

const EMPTY_TIPTAP_DOC = {
  type: "doc" as const,
  content: [{ type: "paragraph" }],
};

const MEANINGFUL_TIPTAP_DOC = {
  type: "doc" as const,
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text: "Updated article body." }],
    },
  ],
};

describe("isMeaningfulArticleMdx", () => {
  test("treats blank strings as non-meaningful", () => {
    expect(isMeaningfulArticleMdx("")).toBe(false);
    expect(isMeaningfulArticleMdx("   ")).toBe(false);
  });

  test("treats structural empty AnimatedParagraph as non-meaningful", () => {
    expect(isMeaningfulArticleMdx(STRUCTURAL_EMPTY_MDX)).toBe(false);
    expect(
      isMeaningfulArticleMdx(serializeToMDX(EMPTY_TIPTAP_DOC))
    ).toBe(false);
  });

  test("treats real article MDX as meaningful", () => {
    expect(isMeaningfulArticleMdx(EXISTING_BODY)).toBe(true);
    expect(
      isMeaningfulArticleMdx(
        "<AnimatedHeading level={2}>Section</AnimatedHeading>"
      )
    ).toBe(true);
  });

  test("treats fenced code blocks as meaningful", () => {
    expect(isMeaningfulArticleMdx("```ts\nconst value = 1;\n```")).toBe(true);
  });
});

describe("resolveArticleContentForUpdate", () => {
  test("omits content when incoming content is undefined", () => {
    expect(resolveArticleContentForUpdate(EXISTING_BODY, undefined)).toBe(
      undefined
    );
  });

  test("preserves existing content when incoming MDX is structural empty", () => {
    expect(
      resolveArticleContentForUpdate(EXISTING_BODY, STRUCTURAL_EMPTY_MDX)
    ).toBe(undefined);
  });

  test("updates when incoming MDX is meaningful", () => {
    const replacement = "<AnimatedParagraph>Replacement body.</AnimatedParagraph>";
    expect(resolveArticleContentForUpdate(EXISTING_BODY, replacement)).toBe(
      replacement
    );
  });

  test("allows structural empty when existing content is also empty", () => {
    expect(
      resolveArticleContentForUpdate(STRUCTURAL_EMPTY_MDX, STRUCTURAL_EMPTY_MDX)
    ).toBe(STRUCTURAL_EMPTY_MDX);
  });
});

describe("resolveEditorMdxForSubmit", () => {
  test("returns undefined for untouched existing-article editor", () => {
    expect(
      resolveEditorMdxForSubmit({
        editorDocument: EMPTY_TIPTAP_DOC,
        fallbackMdx: EXISTING_BODY,
        isEditingExisting: true,
      })
    ).toBe(undefined);
  });

  test("returns meaningful replacement content for existing article edits", () => {
    expect(
      resolveEditorMdxForSubmit({
        editorDocument: MEANINGFUL_TIPTAP_DOC,
        fallbackMdx: EXISTING_BODY,
        isEditingExisting: true,
      })
    ).toContain("Updated article body.");
  });

  test("requires meaningful content for new article creation", () => {
    expect(
      resolveEditorMdxForSubmit({
        editorDocument: EMPTY_TIPTAP_DOC,
        fallbackMdx: "",
        isEditingExisting: false,
      })
    ).toBe(serializeToMDX(EMPTY_TIPTAP_DOC));
  });

  test("uses fallback MDX for new article when editor is empty", () => {
    expect(
      resolveEditorMdxForSubmit({
        editorDocument: EMPTY_TIPTAP_DOC,
        fallbackMdx: EXISTING_BODY,
        isEditingExisting: false,
      })
    ).toBe(EXISTING_BODY);
  });
});

describe("article update preservation contract", () => {
  test("metadata-only payload omits content field", () => {
    const updatePayload = {
      title: "Updated title",
      featured: true,
      status: "published" as const,
      tags: ["Next.js"],
      coverMediaId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    };

    expect("content" in updatePayload).toBe(false);
    expect(
      resolveArticleContentForUpdate(EXISTING_BODY, undefined)
    ).toBe(undefined);
  });

  test("structural-empty update does not clear existing meaningful body", () => {
    expect(
      resolveArticleContentForUpdate(EXISTING_BODY, STRUCTURAL_EMPTY_MDX)
    ).toBe(undefined);
    expect(
      resolveArticleContentForUpdate(EXISTING_BODY, "")
    ).toBe(undefined);
  });
});
