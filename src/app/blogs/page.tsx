import { Navigation } from "@/components/Nav/Navigation";
import BlogGrid from "@/components/blogWrapper/blogWrapper";
import { getAllPosts } from "@/lib/mdx";

export default async function BlogIndex() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen w-full bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-16 max-w-7xl w-full">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Here are some of my Articles
          </h2>
        </div>
        <BlogGrid posts={posts} />
      </main>
    </div>
  );
}
