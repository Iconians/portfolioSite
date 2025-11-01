import Link from "next/link";
import { getAllPosts } from "@/app/lib/mdx";
import BlogCard from "../BlogCard.tsx/BlogCard";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export default async function FeaturedArticles() {
  const allPosts = await getAllPosts();
  // Filter posts where featured is true, limit to 3
  const featuredPosts = allPosts
    .filter((post) => post.frontMatter.featured === true)
    .slice(0, 3);

  if (featuredPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Featured Articles
        </h2>
        <p className="text-muted-foreground text-lg">
          Latest articles on algorithms, data structures, and web development
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {featuredPosts.map((post) => (
          <Link key={post.slug} href={`/blogs/${post.slug}`}>
            <BlogCard
              title={post.frontMatter.title}
              description={post.frontMatter.description}
              date={post.frontMatter.date}
            />
          </Link>
        ))}
      </div>
      <div className="text-center">
        <Button variant="outline" asChild>
          <Link href="/blogs">
            View All Articles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
