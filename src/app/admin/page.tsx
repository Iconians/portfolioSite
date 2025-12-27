import { getAllArticlesAdmin } from "@/lib/data/articles";
import { getAllReviews } from "@/lib/data/reviews";
import { getAllPortfolioItems } from "@/lib/data/portfolio";
import { Card } from "@/app/Components/ui/card";
import Link from "next/link";

export default async function AdminDashboard() {
  const [articles, reviews, portfolio] = await Promise.all([
    getAllArticlesAdmin(),
    getAllReviews(),
    getAllPortfolioItems(),
  ]);

  const publishedArticles = articles.filter((a) => a.status === "published");
  const draftArticles = articles.filter((a) => a.status === "draft");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Articles</h2>
          <p className="text-3xl font-bold">{articles.length}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {publishedArticles.length} published, {draftArticles.length} drafts
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Reviews</h2>
          <p className="text-3xl font-bold">{reviews.length}</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Portfolio Items</h2>
          <p className="text-3xl font-bold">{portfolio.length}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/articles">
          <Card className="p-6 hover:bg-accent transition-colors cursor-pointer">
            <h3 className="font-semibold mb-2">Manage Articles</h3>
            <p className="text-sm text-muted-foreground">
              Create, edit, and publish articles
            </p>
          </Card>
        </Link>

        <Link href="/admin/reviews">
          <Card className="p-6 hover:bg-accent transition-colors cursor-pointer">
            <h3 className="font-semibold mb-2">Manage Reviews</h3>
            <p className="text-sm text-muted-foreground">
              Add and edit client reviews
            </p>
          </Card>
        </Link>

        <Link href="/admin/portfolio">
          <Card className="p-6 hover:bg-accent transition-colors cursor-pointer">
            <h3 className="font-semibold mb-2">Manage Portfolio</h3>
            <p className="text-sm text-muted-foreground">
              Update portfolio items
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
