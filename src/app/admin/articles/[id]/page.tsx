import { getAllArticlesAdmin } from "@/lib/data/articles";
import { notFound } from "next/navigation";
import { ArticleEditor } from "@/app/Components/Admin/ArticleEditor";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const articles = await getAllArticlesAdmin();
  const article = articles.find((a) => a.id === id);

  if (!article) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Article</h1>
      <ArticleEditor initialArticle={article} />
    </div>
  );
}
