"use client";

import { useState, useEffect } from "react";
import { Input } from "@/app/Components/ui/input";
import { useDebounce } from "@/lib/hooks/useDebounce";
import type { Article } from "@/lib/types/articles";
import Link from "next/link";
import { Card } from "@/app/Components/ui/card";

export function ArticleSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const abortController = new AbortController();

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search/articles?q=${encodeURIComponent(debouncedQuery)}`,
          { signal: abortController.signal }
        );

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const data = await response.json();

        // Only update state if request wasn't aborted
        if (!abortController.signal.aborted) {
          setResults(data.articles || []);
        }
      } catch (error) {
        // Ignore abort errors (expected when component unmounts or query changes)
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Search error:", error);
          setResults([]);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchResults();

    // Cleanup: abort request if component unmounts or query changes
    return () => {
      abortController.abort();
    };
  }, [debouncedQuery]);

  return (
    <div className="relative">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search articles..."
        className="w-full"
      />
      {query && (
        <div className="absolute z-10 w-full mt-2 bg-background border rounded-lg shadow-lg max-h-96 overflow-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((article) => (
                <Link key={article.id} href={`/blogs/${article.slug}`}>
                  <Card className="p-4 mb-2 hover:bg-accent transition-colors cursor-pointer">
                    <h3 className="font-semibold">{article.title}</h3>
                    {article.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {article.description}
                      </p>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
