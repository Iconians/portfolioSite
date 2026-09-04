import Link from "next/link";

import { PageHeader } from "@/components/Admin/layout/PageHeader";
import { PortfolioList } from "@/components/Admin/PortfolioList";
import { Button } from "@/components/ui/button";
import { getAllPortfolioItems } from "@/lib/data/portfolio";
import { rewritePortfolioItemDisplayMedia } from "@/lib/portfolio/display-media-url";
import { getProjectWriteSource } from "@/lib/project-write/config";

export default async function PortfolioPage() {
  let portfolio: Awaited<ReturnType<typeof getAllPortfolioItems>> = [];
  let dbError: string | null = null;

  try {
    portfolio = (await getAllPortfolioItems()).map(rewritePortfolioItemDisplayMedia);
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
      {dbError ? (
        <div className="mb-6 rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          {dbError}
        </div>
      ) : null}

      <PageHeader
        title="Portfolio"
        description="Manage projects and engineering case studies"
        actions={
          getProjectWriteSource() === "platform-api" ? undefined : (
            <Link href="/admin/portfolio/new">
              <Button>Add Project</Button>
            </Link>
          )
        }
      />

      <PortfolioList
        portfolio={portfolio}
        disableDelete={getProjectWriteSource() === "platform-api"}
        enablePlatformArchive={getProjectWriteSource() === "platform-api"}
      />
    </div>
  );
}
