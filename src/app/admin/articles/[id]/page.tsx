import { getArticleByIdAdmin } from "@/lib/data/articles";
import { notFound } from "next/navigation";
import { ArticleEditor } from "@/components/Admin/ArticleEditor";
import { PageHeader } from "@/components/Admin/layout/PageHeader";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleByIdAdmin(id);

  if (!article) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        title="Edit Article"
        description="Update article content, metadata, and publish status."
        breadcrumbs={[
          { label: "Articles", href: "/admin/articles" },
          { label: "Edit" },
          { label: article.title },
        ]}
      />
      <ArticleEditor initialArticle={article} />
    </div>
  );
}
