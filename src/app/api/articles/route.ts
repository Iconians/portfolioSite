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
    if (
      error instanceof Error &&
      error.message.includes("Can't reach database")
    ) {
      console.warn("Database connection failed, returning empty array");
      return NextResponse.json({ articles: [] });
    }

    return NextResponse.json(
      { error: "Failed to fetch articles", articles: [] },
      { status: 500 }
    );
  }
}
