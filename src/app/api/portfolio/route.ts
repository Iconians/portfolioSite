import { NextResponse } from "next/server";
import { getAllPortfolioItems } from "@/lib/data/portfolio";

export async function GET() {
  try {
    const portfolioItems = await getAllPortfolioItems();
    return NextResponse.json({ portfolioItems });
  } catch (error) {
    console.error("Failed to fetch portfolio items:", error);

    // Return empty array instead of error to prevent frontend crashes
    // The frontend components handle empty arrays gracefully
    const msg = error instanceof Error ? error.message : "";
    if (
      msg.includes("Can't reach database") ||
      msg.includes("DATABASE_URL")
    ) {
      console.warn("Database unavailable, returning empty array:", msg);
      return NextResponse.json({ portfolioItems: [] });
    }

    return NextResponse.json(
      { error: "Failed to fetch portfolio items", portfolioItems: [] },
      { status: 500 }
    );
  }
}
