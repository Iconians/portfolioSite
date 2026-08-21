import { NextResponse } from "next/server";

import { getAllPortfolioItems } from "@/lib/data/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const portfolioItems = await getAllPortfolioItems();
    return NextResponse.json({ portfolioItems });
  } catch (error) {
    console.error("Failed to fetch portfolio items:", error);

    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes("Can't reach database") || msg.includes("DATABASE_URL")) {
      return NextResponse.json({ portfolioItems: [] });
    }

    return NextResponse.json(
      { error: "Failed to fetch portfolio items", portfolioItems: [] },
      { status: 500 }
    );
  }
}
