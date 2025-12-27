import { getAllPosts } from "@/app/lib/mdx";
import { Navigation } from "@/app/Components/Nav/Navigation";
import BlogGrid from "../Components/blogWrapper/blogWrapper";

// Disable static generation for blogs page - uses animated components (BlogCard, Navigation)
// This prevents framer-motion evaluation during build
export const dynamic = "force-dynamic";

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
