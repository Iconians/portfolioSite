import type { CreateArticleInput } from "@/lib/types/articles";
import type { Editor } from "@tiptap/react";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

export type ArticleEditorFormData = Omit<CreateArticleInput, "tags"> & {
  tags: string;
};

export interface ArticleEditorFieldsProps {
  register: UseFormRegister<ArticleEditorFormData>;
  errors: FieldErrors<ArticleEditorFormData>;
  isPending: boolean;
}

export interface ArticleEditorContentProps {
  editor: Editor | null;
  preview: MDXRemoteSerializeResult | null;
  onRefreshPreview: () => void;
  initialContent?: string;
}
