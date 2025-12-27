import Link from "next/link";
import { Navigation } from "@/app/Components/Nav/Navigation";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-16 max-w-7xl w-full">
        <div className="p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The blog post you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/blogs" className="text-primary hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </main>
    </div>
  );
}
