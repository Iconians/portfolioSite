"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlock from "@tiptap/extension-code-block";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import AnimatedParagraph from "@/app/Components/Animations/AnimatedParagraphs";
import AnimatedHeading from "@/app/Components/Animations/AnimateHeading";
import AnimatedList, {
  AnimatedListItem,
} from "@/app/Components/Animations/AnimatedList";
import { AnimatedCode } from "@/app/Components/Animations/AnimatedCode";
import AnimatedWrapper from "@/app/Components/Animations/AnimatedWrapper";
import { serializeToMDX } from "./mdxSerializer";
import {
  createArticleAction,
  updateArticleAction,
  publishArticleAction,
} from "@/lib/actions/articles";
import { Button } from "@/app/Components/ui/button";
import { Input } from "@/app/Components/ui/input";
import { Label } from "@/app/Components/ui/label";
import { Textarea } from "@/app/Components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Article } from "@/lib/types/articles";
import { type CreateArticleInput } from "@/lib/types/articles";

interface ArticleEditorProps {
  initialArticle?: Article;
}

export function ArticleEditor({ initialArticle }: ArticleEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mdxContent, setMdxContent] = useState("");
  const [preview, setPreview] = useState<MDXRemoteSerializeResult | null>(null);

  type FormData = Omit<CreateArticleInput, "tags"> & {
    tags: string; // Accept as string for input, convert to array on submit
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
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

  useEffect(() => {
    if (initialArticle?.content && editor) {
      // For existing articles, set the MDX content directly
      // The editor will be used for new content, existing content is stored as MDX
      setMdxContent(initialArticle.content);
      // Try to parse MDX and set in editor (simplified - full parser would be better)
      // For now, editor starts empty and user can edit the MDX directly or use editor for new content
    }
  }, [initialArticle, editor]);

  const handlePreview = async () => {
    const currentMdx = editor ? serializeToMDX(editor.getJSON()) : mdxContent;
    if (!currentMdx) {
      toast.error("No content to preview");
      return;
    }
    const serialized = await serialize(currentMdx);
    setPreview(serialized);
  };

  const onSubmit = (data: FormData) => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            {...register("title")}
            disabled={isPending}
            className={`mt-2 ${errors.title ? "border-red-500" : ""}`}
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
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
            <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="flex items-center gap-4 mt-6">
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
            className="px-3 py-2 border rounded-md"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 h-[600px]">
        <div className="flex flex-col border rounded p-4">
          <Label className="mb-2">Content Editor (Rich Text)</Label>
          <div className="flex-1 border rounded p-4 overflow-auto min-h-0 bg-background">
            {editor && <EditorContent editor={editor} />}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Tip: Use the editor to create new content. For existing articles,
            content is stored as MDX.
          </p>
        </div>
        <div className="flex flex-col border rounded p-4">
          <div className="flex items-center justify-between mb-2">
            <Label>Preview</Label>
            <Button onClick={handlePreview} size="sm" variant="outline">
              Refresh Preview
            </Button>
          </div>
          <div className="flex-1 overflow-auto min-h-0">
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
              <p className="text-muted-foreground text-sm">
                Click &quot;Refresh Preview&quot; to see rendered content
              </p>
            )}
          </div>
        </div>
      </div>

      {initialArticle?.content && (
        <div className="mt-4 p-4 bg-muted rounded">
          <Label className="mb-2">Current MDX Content (for reference)</Label>
          <pre className="text-xs overflow-auto max-h-40 bg-background p-2 rounded">
            {initialArticle.content.substring(0, 500)}...
          </pre>
        </div>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Saving..."
            : initialArticle
            ? "Update Article"
            : "Create Article"}
        </Button>
        {initialArticle && initialArticle.status !== "published" && (
          <Button
            type="button"
            onClick={handlePublish}
            disabled={isPending}
            variant="outline"
          >
            Publish
          </Button>
        )}
      </div>
    </form>
  );
}
