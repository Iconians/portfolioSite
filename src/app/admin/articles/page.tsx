import { getAllArticlesAdmin } from "@/lib/data/articles";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArticleList } from "@/components/Admin/ArticleList";
import { PageHeader } from "@/components/Admin/layout/PageHeader";

export default async function ArticlesPage() {
  const articles = await getAllArticlesAdmin();

  return (
    <div>
      <PageHeader
        title="Articles"
        description="Create, edit, publish, and manage blog articles."
        actions={
          <Link href="/admin/articles/new">
            <Button>Create Article</Button>
          </Link>
        }
      />

      <ArticleList articles={articles} />
    </div>
  );
}
