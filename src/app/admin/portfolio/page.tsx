import { getAllPortfolioItems } from "@/lib/data/portfolio";
import Link from "next/link";
import { Button } from "@/app/Components/ui/button";
import { PortfolioList } from "@/app/Components/Admin/PortfolioList";

export default async function PortfolioPage() {
  const portfolio = await getAllPortfolioItems();

  return (
    <div>
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
