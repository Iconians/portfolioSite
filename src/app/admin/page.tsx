import Link from "next/link";

import { PageHeader } from "@/components/Admin/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { getAllArticlesAdmin } from "@/lib/data/articles";
import { getAllPortfolioItems } from "@/lib/data/portfolio";
import { getAllReviewsAdmin } from "@/lib/data/reviews";


export default async function AdminDashboard() {
  const [articles, reviews, portfolio] = await Promise.all([
    getAllArticlesAdmin(),
    getAllReviewsAdmin(),
    getAllPortfolioItems(),
  ]);

  const publishedArticles = articles.filter((a) => a.status === "published");
  const draftArticles = articles.filter((a) => a.status === "draft");

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of portfolio content and quick links to admin sections."
      />

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="p-6">
          <h2 className="mb-2 text-xl font-semibold">Articles</h2>
          <p className="text-3xl font-bold">{articles.length}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {publishedArticles.length} published, {draftArticles.length} drafts
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="mb-2 text-xl font-semibold">Reviews</h2>
          <p className="text-3xl font-bold">{reviews.length}</p>
        </Card>

        <Card className="p-6">
          <h2 className="mb-2 text-xl font-semibold">Portfolio Items</h2>
          <p className="text-3xl font-bold">{portfolio.length}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link href="/admin/portfolio">
          <Card className="cursor-pointer p-6 transition-colors hover:bg-accent">
            <h3 className="mb-2 font-semibold">Manage Portfolio</h3>
            <p className="text-sm text-muted-foreground">
              Update projects and engineering case studies
            </p>
          </Card>
        </Link>

        <Link href="/admin/media">
          <Card className="cursor-pointer p-6 transition-colors hover:bg-accent">
            <h3 className="mb-2 font-semibold">Manage Media</h3>
            <p className="text-sm text-muted-foreground">
              Upload and organize project images
            </p>
          </Card>
        </Link>

        <Link href="/admin/articles">
          <Card className="cursor-pointer p-6 transition-colors hover:bg-accent">
            <h3 className="mb-2 font-semibold">Manage Articles</h3>
            <p className="text-sm text-muted-foreground">
              Create, edit, and publish articles
            </p>
          </Card>
        </Link>

        <Link href="/admin/reviews">
          <Card className="cursor-pointer p-6 transition-colors hover:bg-accent">
            <h3 className="mb-2 font-semibold">Manage Reviews</h3>
            <p className="text-sm text-muted-foreground">
              Add and edit client reviews
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
