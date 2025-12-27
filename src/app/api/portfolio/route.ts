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
    if (
      error instanceof Error &&
      error.message.includes("Can't reach database")
    ) {
      console.warn("Database connection failed, returning empty array");
      return NextResponse.json({ portfolioItems: [] });
    }

    return NextResponse.json(
      { error: "Failed to fetch portfolio items", portfolioItems: [] },
      { status: 500 }
    );
  }
}
