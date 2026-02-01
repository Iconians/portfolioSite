import { NextRequest, NextResponse } from "next/server";
import { searchArticles } from "@/lib/data/articles";
import { z } from "zod";

const SearchSchema = z.object({
  q: z.string().min(1).max(100),
});

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q") || "";

  try {
    const validated = SearchSchema.parse({ q: query });
    const articles = await searchArticles(validated.q);
    return NextResponse.json({ articles });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "";
    if (msg.includes("Can't reach database") || msg.includes("DATABASE_URL")) {
      return NextResponse.json({ articles: [] });
    }
    return NextResponse.json(
      { error: msg || "Search failed" },
      { status: 400 }
    );
  }
}
