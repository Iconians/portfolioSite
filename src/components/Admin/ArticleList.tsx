"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { deleteArticleAction } from "@/lib/actions/articles";


import type { Article } from "@/lib/types/articles";

interface ArticleListProps {
  articles: Article[];
}

function articleStatusVariant(
  status: string,
): "default" | "secondary" | "outline" {
  if (status === "published") {return "default";}
  if (status === "draft") {return "secondary";}
  return "outline";
}

export function ArticleList({ articles: initialArticles }: ArticleListProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) {return;}

    startTransition(async () => {
      const result = await deleteArticleAction(id);
      if (result.success) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
        toast.success("Article deleted");
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <Card key={article.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Link
                  href={`/admin/articles/${article.id}`}
                  className="text-xl font-semibold hover:underline"
                >
                  {article.title}
                </Link>
                <Badge variant={articleStatusVariant(article.status)}>
                  {article.status}
                </Badge>
                {article.featured && <Badge variant="outline">Featured</Badge>}
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {article.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Slug: {article.slug}</span>
                <span>
                  Created: {new Date(article.createdAt).toLocaleDateString()}
                </span>
                {article.publishedAt && (
                  <span>
                    Published:{" "}
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/articles/${article.id}`}>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </Link>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(article.id)}
                disabled={isPending}
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
      {articles.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            No articles yet. Create your first article!
          </p>
        </Card>
      )}
    </div>
  );
}
