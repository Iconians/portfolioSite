import { cn } from "@/lib/utils";

/** Article body prose — replaces legacy `BLOG_ARTICLE_CLASS` inline string. */
export const BLOG_PROSE_CLASS = cn(
  "leading-relaxed text-foreground",
  "[&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline",
  "[&_p]:mb-4 [&_p]:text-muted-foreground",
  "[&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-foreground",
  "[&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground",
  "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ul]:text-muted-foreground",
  "[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_ol]:text-muted-foreground",
  "[&_li]:leading-relaxed",
  "[&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-card [&_pre]:p-4",
  "[&_code]:text-sm",
  "[&_:not(pre)>code]:rounded [&_:not(pre)>code]:bg-muted [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5",
  "[&_blockquote]:mb-4 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground",
  "[&_img]:my-6 [&_img]:rounded-lg [&_img]:border [&_img]:border-border"
);
