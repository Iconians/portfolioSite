"use client";

import { useEffect, useState } from "react";
import { PortfolioSectionClient } from "./PortfolioSectionClient";
import type { PortfolioItem } from "@/lib/types/portfolio";

export default function PortfolioSection() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        const response = await fetch("/api/portfolio", { cache: "no-store" });
        const data = await response.json().catch(() => ({}));
        const items = data.portfolioItems ?? [];
        if (!response.ok) {
          console.warn(
            "Portfolio API error:",
            data.error ?? response.statusText,
          );
        }
        setPortfolioItems(Array.isArray(items) ? items : []);
      } catch (error) {
        console.error("Failed to load portfolio items:", error);
        setPortfolioItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioItems();
  }, []);

  if (isLoading) {
    return (
      <section id="projects" className="py-16 scroll-mt-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Selected works</h2>
        <p className="text-muted-foreground mb-12 text-lg">
          A selection of SaaS platforms, production client work, and
          engineering-focused projects.
        </p>
        <div className="text-center py-8">Loading projects...</div>
      </section>
    );
  }

  if (!portfolioItems || portfolioItems.length === 0) {
    return null;
  }

  return (
    <section id="projects" className="py-16 scroll-mt-20">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Selected works</h2>
      <p className="text-muted-foreground mb-12 text-lg">
        A selection of SaaS platforms, production client work, and
        engineering-focused projects.
      </p>
      <PortfolioSectionClient portfolioItems={portfolioItems} />
    </section>
  );
}
