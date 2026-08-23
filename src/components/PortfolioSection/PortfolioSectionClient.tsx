"use client";

import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { useSyncExternalStore, useState } from "react";

import { Inline, Stack } from "@/components/layout/Stack";
import { ProjectCard } from "@/components/patterns/ProjectCard";
import { Heading } from "@/components/typography/Heading";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import {
  canViewProjectDetail,
  getProjectCardSummary,
  getProjectDetailHref,
  getProjectTypeLabel,
  isValidProjectLink,
  uniqueCategories,
} from "@/lib/portfolio/public-project";

import type { PortfolioItem } from "@/lib/types/portfolio";
import type { ReactNode } from "react";

function isProjectsMoreHash(): boolean {
  return window.location.hash === "#projects-more";
}

function subscribeToHash(onStoreChange: () => void) {
  window.addEventListener("hashchange", onStoreChange);
  return () => window.removeEventListener("hashchange", onStoreChange);
}

const externalLinkClass =
  "inline-flex items-center gap-1.5 text-sm text-muted-foreground no-underline transition-colors hover:text-ds-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm";

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
  featuredItems: PortfolioItem[];
  remainingItems: PortfolioItem[];
}

function ProjectCardGrid({ items }: { items: PortfolioItem[] }) {
  const reducedMotion = useReducedMotion();

  const cards = items.map((item) => {
        const slug = item.slug?.trim();
        const showDetailLink = canViewProjectDetail(item);
        const liveUrl = item.url;
        const githubUrl = item.github;
        const hasLiveSite = isValidProjectLink(liveUrl);
        const hasGithub = isValidProjectLink(githubUrl);
        const projectTypeLabel = getProjectTypeLabel(item.projectType);

        const footerLinks: ReactNode[] = [];

        if (showDetailLink && slug) {
          footerLinks.push(
            <Link
              key="detail"
              href={getProjectDetailHref(slug)}
              className="text-sm text-muted-foreground no-underline hover:text-ds-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              View project
            </Link>
          );
        }

        if (showDetailLink && slug && hasLiveSite) {
          footerLinks.push(
            <span key="sep-live" className="text-border">|</span>
          );
        }

        if (hasLiveSite) {
          footerLinks.push(
            <a
              key="live"
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={externalLinkClass}
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
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={externalLinkClass}
            >
              <GithubIcon className="h-3.5 w-3.5 shrink-0" />
              Source code
            </a>
          );
        }

        const card = (
          <ProjectCard
            imageUrl={item.img}
            imageAlt={item.caption}
            title={item.caption}
            description={getProjectCardSummary(item)}
            eyebrow={projectTypeLabel}
            badges={uniqueCategories(item.category)}
            footer={<Inline gap="md">{footerLinks}</Inline>}
          />
        );

        if (reducedMotion) {
          return <div key={item.id}>{card}</div>;
        }

        return (
          <motion.div
            key={item.id}
            variants={cardVariants}
            whileHover={{ y: -4 }}
          >
            {card}
          </motion.div>
        );
      });

  if (reducedMotion) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">{cards}</div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 gap-6 md:grid-cols-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {cards}
    </motion.div>
  );
}

export function PortfolioSectionClient({
  featuredItems,
  remainingItems,
}: PortfolioSectionClientProps) {
  const [expanded, setExpanded] = useState(false);
  const hashExpanded = useSyncExternalStore(
    subscribeToHash,
    isProjectsMoreHash,
    () => false
  );
  const showRemaining = expanded || hashExpanded;

  return (
    <Stack gap="lg">
      <ProjectCardGrid items={featuredItems} />

      {remainingItems.length > 0 && !showRemaining ? (
        <Inline className="justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setExpanded(true);
              window.location.hash = "projects-more";
            }}
          >
            View all projects
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Inline>
      ) : null}

      {remainingItems.length > 0 && showRemaining ? (
        <div id="projects-more" className="scroll-mt-20">
          <Heading level={3} className="mb-6 text-lg font-semibold">
            More from the portfolio
          </Heading>
          <ProjectCardGrid items={remainingItems} />
        </div>
      ) : null}
    </Stack>
  );
}
