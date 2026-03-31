import type { Editor } from "@tiptap/react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import type { CreateArticleInput } from "@/lib/types/articles";

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
