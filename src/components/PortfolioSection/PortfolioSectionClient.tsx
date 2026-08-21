"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import {
  canViewProjectDetail,
  getProjectCardSummary,
  getProjectDetailHref,
  isValidProjectLink,
  uniqueCategories,
} from "@/lib/portfolio/public-project";
import type { PortfolioItem } from "@/lib/types/portfolio";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.22 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300 },
  },
};

interface PortfolioSectionClientProps {
  portfolioItems: PortfolioItem[];
}

export function PortfolioSectionClient({
  portfolioItems,
}: PortfolioSectionClientProps) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {portfolioItems.map((item) => {
        const showDetailLink = canViewProjectDetail(item);
        const hasLiveSite = isValidProjectLink(item.url);
        const hasGithub = isValidProjectLink(item.github);

        return (
          <motion.div
            key={item.id}
            variants={cardVariants}
            whileHover={{ y: -5 }}
          >
            <Card className="overflow-hidden group h-full flex flex-col">
              <div className="relative aspect-video overflow-hidden bg-muted">
                <Image
                  width={600}
                  height={400}
                  src={item.img}
                  alt={item.caption}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{item.caption}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 flex flex-col">
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {getProjectCardSummary(item)}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {uniqueCategories(item.category).map((cat) => (
                    <Badge key={cat} variant="secondary">
                      {cat}
                    </Badge>
                  ))}
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-3 border-t border-border">
                  {showDetailLink && (
                    <Link
                      href={getProjectDetailHref(item.slug!)}
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      View project
                    </Link>
                  )}
                  {showDetailLink && hasLiveSite && (
                    <span className="text-border">|</span>
                  )}
                  {hasLiveSite && (
                    <a
                      href={item.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                      Live site
                    </a>
                  )}
                  {hasLiveSite && hasGithub && (
                    <span className="text-border">|</span>
                  )}
                  {hasGithub && (
                    <a
                      href={item.github!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <GithubIcon className="h-3.5 w-3.5 shrink-0" />
                      Source code
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
