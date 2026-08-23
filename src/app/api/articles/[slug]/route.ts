import { NextResponse } from "next/server";

import { serializeArticleMdx } from "@/lib/articles/mdx-serialize";
import { getArticleBySlug } from "@/lib/data/articles";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article || !article.content) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const mdxSource = await serializeArticleMdx(article.content);

    return NextResponse.json({
      article: {
        frontMatter: {
          title: article.title,
          description: article.description || "",
          date: article.date.toISOString().split("T")[0],
          featured: article.featured,
          tags: article.tags,
        },
        mdxSource,
      },
    });
  } catch (error) {
    console.error("Failed to fetch article:", error);
    const msg = error instanceof Error ? error.message : "";
    if (msg.includes("Can't reach database") || msg.includes("DATABASE_URL")) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}
