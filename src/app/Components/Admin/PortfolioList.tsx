"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/app/Components/ui/card";
import { Button } from "@/app/Components/ui/button";
import { Badge } from "@/app/Components/ui/badge";
import { deletePortfolioAction } from "@/lib/actions/portfolio";
import { toast } from "sonner";
import type { PortfolioItem } from "@/lib/types/portfolio";

interface PortfolioListProps {
  portfolio: PortfolioItem[];
}

export function PortfolioList({
  portfolio: initialPortfolio,
}: PortfolioListProps) {
  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio item?"))
      return;

    startTransition(async () => {
      const result = await deletePortfolioAction(id);
      if (result.success) {
        setPortfolio((prev) => prev.filter((p) => p.id !== id));
        toast.success("Portfolio item deleted");
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {portfolio.map((item) => (
        <Card key={item.id} className="p-6">
          <div className="relative aspect-video mb-4 rounded overflow-hidden">
            <Image
              src={item.img}
              alt={item.caption}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex items-start justify-between mb-2">
            <Link
              href={`/admin/portfolio/${item.id}`}
              className="text-xl font-semibold hover:underline"
            >
              {item.caption}
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {item.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {item.category.map((cat, idx) => (
              <Badge key={idx} variant="secondary">
                {cat}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/portfolio/${item.id}`}>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(item.id)}
              disabled={isPending}
            >
              Delete
            </Button>
          </div>
        </Card>
      ))}
      {portfolio.length === 0 && (
        <Card className="p-12 text-center col-span-2">
          <p className="text-muted-foreground">
            No portfolio items yet. Create your first item!
          </p>
        </Card>
      )}
    </div>
  );
}
