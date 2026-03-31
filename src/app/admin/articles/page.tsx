import { getAllArticlesAdmin } from "@/lib/data/articles";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { deleteArticleAction } from "@/lib/actions/articles";
import { ArticleList } from "@/components/Admin/ArticleList";

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
