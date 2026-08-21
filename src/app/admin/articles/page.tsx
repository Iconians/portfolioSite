import Link from "next/link";

import { ArticleList } from "@/components/Admin/ArticleList";
import { PageHeader } from "@/components/Admin/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { getAllArticlesAdmin } from "@/lib/data/articles";

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
