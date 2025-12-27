import { NextResponse } from "next/server";
import { getArticleBySlug } from "@/lib/data/articles";
import { serialize } from "next-mdx-remote/serialize";

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

    // Serialize MDX content
    const mdxSource = await serialize(article.content, {
      parseFrontmatter: false,
      mdxOptions: {
        development: false,
      },
    });

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
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}
