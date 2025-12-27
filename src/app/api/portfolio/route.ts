import { NextResponse } from "next/server";
import { getAllPortfolioItems } from "@/lib/data/portfolio";

export async function GET() {
  try {
    const portfolioItems = await getAllPortfolioItems();
    return NextResponse.json({ portfolioItems });
  } catch (error) {
    console.error("Failed to fetch portfolio items:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio items" },
      { status: 500 }
    );
  }
}
