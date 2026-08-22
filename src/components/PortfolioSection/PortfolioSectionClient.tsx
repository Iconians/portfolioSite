"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

import { Inline } from "@/components/layout/Stack";
import { ProjectCard } from "@/components/patterns/ProjectCard";
import {
  canViewProjectDetail,
  getProjectCardSummary,
  getProjectDetailHref,
  isValidProjectLink,
  uniqueCategories,
} from "@/lib/portfolio/public-project";

import type { PortfolioItem } from "@/lib/types/portfolio";
import type { ReactNode } from "react";

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
      className="grid grid-cols-1 gap-6 md:grid-cols-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {portfolioItems.map((item) => {
        const showDetailLink = canViewProjectDetail(item);
        const hasLiveSite = isValidProjectLink(item.url);
        const hasGithub = isValidProjectLink(item.github);

        const footerLinks: ReactNode[] = [];

        if (showDetailLink) {
          footerLinks.push(
            <Link
              key="detail"
              href={getProjectDetailHref(item.slug!)}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              View project
            </Link>
          );
        }

        if (showDetailLink && hasLiveSite) {
          footerLinks.push(
            <span key="sep-live" className="text-border">|</span>
          );
        }

        if (hasLiveSite) {
          footerLinks.push(
            <a
              key="live"
              href={item.url!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              Live site
            </a>
          );
        }

        if (hasLiveSite && hasGithub) {
          footerLinks.push(
            <span key="sep-github" className="text-border">|</span>
          );
        }

        if (hasGithub) {
          footerLinks.push(
            <a
              key="github"
              href={item.github!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <GithubIcon className="h-3.5 w-3.5 shrink-0" />
              Source code
            </a>
          );
        }

        return (
          <motion.div
            key={item.id}
            variants={cardVariants}
            whileHover={{ y: -5 }}
          >
            <ProjectCard
              imageUrl={item.img}
              imageAlt={item.caption}
              title={item.caption}
              description={getProjectCardSummary(item)}
              badges={uniqueCategories(item.category)}
              footer={<Inline gap="md">{footerLinks}</Inline>}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
