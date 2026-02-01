import { NextResponse } from "next/server";
import { getAllArticles } from "@/lib/data/articles";

export async function GET() {
  try {
    const articles = await getAllArticles(false); // Don't include content for list views
    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Failed to fetch articles:", error);

    // Return empty array instead of error to prevent frontend crashes
    // The frontend components handle empty arrays gracefully
    const msg = error instanceof Error ? error.message : "";
    if (
      msg.includes("Can't reach database") ||
      msg.includes("DATABASE_URL")
    ) {
      console.warn("Database unavailable, returning empty array:", msg);
      return NextResponse.json({ articles: [] });
    }

    return NextResponse.json(
      { error: "Failed to fetch articles", articles: [] },
      { status: 500 }
    );
  }
}
