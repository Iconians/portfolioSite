import { NextResponse } from "next/server";
import { getAllPortfolioItems } from "@/lib/data/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const portfolioItems = await getAllPortfolioItems();
    return NextResponse.json({ portfolioItems });
  } catch (error) {
    console.error("Failed to fetch portfolio items:", error);

    // Return empty array instead of error to prevent frontend crashes
    const msg = error instanceof Error ? error.message : String(error);
    if (
      msg.includes("Can't reach database") ||
      msg.includes("DATABASE_URL") ||
      (msg.includes("column") && (msg.includes("does not exist") || msg.includes("key_features") || msg.includes("project_type") || msg.includes("role") || msg.includes("highlights")))
    ) {
      if (msg.includes("column")) {
        console.warn("Portfolio schema may be outdated. Run: bunx prisma migrate deploy");
      }
      return NextResponse.json({ portfolioItems: [] });
    }

    return NextResponse.json(
      { error: "Failed to fetch portfolio items", portfolioItems: [] },
      { status: 500 }
    );
  }
}
