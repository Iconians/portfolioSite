"use client";

import CodeBlock from "@tiptap/extension-code-block";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  createArticleAction,
  updateArticleAction,
  publishArticleAction,
} from "@/lib/actions/articles";
import { serializeArticleMdx } from "@/lib/articles/mdx-serialize";

import { ArticleEditorActions } from "./article-editor/ArticleEditorActions";
import { ArticleEditorContent } from "./article-editor/ArticleEditorContent";
import { ArticleEditorCover } from "./article-editor/ArticleEditorCover";
import { ArticleEditorFields } from "./article-editor/ArticleEditorFields";
import { serializeToMDX } from "./mdxSerializer";

import type { ArticleEditorFormData } from "./article-editor/types";
import type { Article, CreateArticleInput } from "@/lib/types/articles";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";


interface ArticleEditorProps {
  initialArticle?: Article;
}

export function ArticleEditor({ initialArticle }: ArticleEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mdxContent, setMdxContent] = useState(
    () => initialArticle?.content ?? ""
  );
  const [preview, setPreview] = useState<MDXRemoteSerializeResult | null>(null);
  const [coverMediaId, setCoverMediaId] = useState<string | null>(
    () => initialArticle?.coverMediaId ?? null
  );
  const [coverImageUrl, setCoverImageUrl] = useState(
    () => initialArticle?.coverMedia?.publicUrl ?? ""
  );
  const [coverImageAlt, setCoverImageAlt] = useState(
    () => initialArticle?.coverMedia?.altText ?? ""
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ArticleEditorFormData>({
    defaultValues: {
      title: initialArticle?.title || "",
      slug: initialArticle?.slug || "",
      description: initialArticle?.description || undefined,
      tags: initialArticle?.tags?.join(", ") || "",
      featured: initialArticle?.featured || false,
      status:
        (initialArticle?.status as "draft" | "published" | "archived") ||
        "draft",
      date: initialArticle?.date || new Date(),
      content: initialArticle?.content || "",
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Exclude CodeBlock from StarterKit to avoid duplicate
      }),
      CodeBlock,
    ],
    content: "",
    immediatelyRender: false, // Required for SSR/Next.js to avoid hydration mismatches
    onUpdate: ({ editor }) => {
      // Convert TipTap content to MDX with animated components
      const mdx = serializeToMDX(editor.getJSON());
      setMdxContent(mdx);
    },
  });

  const handlePreview = async () => {
    const currentMdx = editor ? serializeToMDX(editor.getJSON()) : mdxContent;
    if (!currentMdx) {
      toast.error("No content to preview");
      return;
    }
    const serialized = await serializeArticleMdx(currentMdx);
    setPreview(serialized);
  };

  const onSubmit = (data: ArticleEditorFormData) => {
    // Get MDX content from editor if available, otherwise use stored mdxContent
    // For existing articles, use the original content if editor is empty
    let currentMdx = "";
    if (editor) {
      const editorContent = editor.getJSON();
      if (
        editorContent &&
        editorContent.content &&
        editorContent.content.length > 0
      ) {
        currentMdx = serializeToMDX(editorContent);
      }
    }

    // Fallback to stored mdxContent or initial article content
    if (!currentMdx) {
      currentMdx = mdxContent || initialArticle?.content || "";
    }

    if (!currentMdx.trim()) {
      toast.error("Article content is required");
      return;
    }

    startTransition(async () => {
      // Convert tags string to array
      const tagsArray = data.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const articleData: CreateArticleInput = {
        ...data,
        tags: tagsArray,
        content: currentMdx,
        date: initialArticle?.date || new Date(),
        coverMediaId,
      };

      const result = initialArticle
        ? await updateArticleAction(initialArticle.id, articleData)
        : await createArticleAction(articleData);

      if (result.success) {
        toast.success(initialArticle ? "Article updated" : "Article created");
        router.push("/admin/articles");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  const handlePublish = async () => {
    if (!initialArticle) {
      toast.error("Save the article first");
      return;
    }

    startTransition(async () => {
      const result = await publishArticleAction(initialArticle.id);
      if (result.success) {
        toast.success("Article published");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <ArticleEditorFields register={register} errors={errors} isPending={isPending} />
      <ArticleEditorCover
        coverImageUrl={coverImageUrl}
        coverImageAlt={coverImageAlt}
        isPending={isPending}
        onSelectCover={(asset) => {
          setCoverMediaId(asset.id);
          setCoverImageUrl(asset.publicUrl);
          setCoverImageAlt(asset.altText ?? "");
        }}
        onClearCover={() => {
          setCoverMediaId(null);
          setCoverImageUrl("");
          setCoverImageAlt("");
        }}
      />
      <ArticleEditorContent
        editor={editor}
        preview={preview}
        onRefreshPreview={handlePreview}
        initialContent={initialArticle?.content}
      />
      <ArticleEditorActions
        isPending={isPending}
        isEditing={Boolean(initialArticle)}
        canPublish={Boolean(initialArticle && initialArticle.status !== "published")}
        onPublish={handlePublish}
      />
    </form>
  );
}
