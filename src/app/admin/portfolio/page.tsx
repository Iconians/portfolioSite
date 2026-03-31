import { getAllPortfolioItems } from "@/lib/data/portfolio";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PortfolioList } from "@/components/Admin/PortfolioList";

export default async function PortfolioPage() {
  let portfolio: Awaited<ReturnType<typeof getAllPortfolioItems>> = [];
  let dbError: string | null = null;

  try {
    portfolio = await getAllPortfolioItems();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("DATABASE_URL") || msg.includes("Can't reach database")) {
      dbError =
        "Database is not configured. Add DATABASE_URL in Vercel → Project → Settings → Environment Variables, then redeploy.";
    } else {
      dbError = msg || "Failed to load portfolio items.";
    }
  }

  return (
    <div>
      {dbError && (
        <div className="mb-6 rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          {dbError}
        </div>
      )}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Portfolio Items</h1>
        <Link href="/admin/portfolio/new">
          <Button>Create Portfolio Item</Button>
        </Link>
      </div>

      <PortfolioList portfolio={portfolio} />
    </div>
  );
}
