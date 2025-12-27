import { getAllArticlesAdmin } from "@/lib/data/articles";
import Link from "next/link";
import { Button } from "@/app/Components/ui/button";
import { Card } from "@/app/Components/ui/card";
import { Badge } from "@/app/Components/ui/badge";
import { deleteArticleAction } from "@/lib/actions/articles";
import { ArticleList } from "@/app/Components/Admin/ArticleList";

export default async function ArticlesPage() {
  const articles = await getAllArticlesAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Articles</h1>
        <Link href="/admin/articles/new">
          <Button>Create Article</Button>
        </Link>
      </div>

      <ArticleList articles={articles} />
    </div>
  );
}
