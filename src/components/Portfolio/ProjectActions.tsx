import { ExternalLink, FileText } from "lucide-react";

import { Inline } from "@/components/layout/Stack";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { isValidProjectLink } from "@/lib/portfolio/public-project";
import { cn } from "@/lib/utils";

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

interface ProjectActionLink {
  href: string;
  label: string;
  icon: "live" | "github" | "docs";
}

interface ProjectActionsProps {
  project: PortfolioItem;
  variant?: "hero" | "inline";
  className?: string;
}

function buildProjectActions(project: PortfolioItem): ProjectActionLink[] {
  const actions: ProjectActionLink[] = [];

  const liveUrl = project.url;
  if (isValidProjectLink(liveUrl)) {
    actions.push({ href: liveUrl, label: "Live site", icon: "live" });
  }

  const githubUrl = project.github;
  if (isValidProjectLink(githubUrl)) {
    actions.push({ href: githubUrl, label: "Source code", icon: "github" });
  }

  const docsUrl = project.docs;
  if (isValidProjectLink(docsUrl)) {
    actions.push({ href: docsUrl, label: "Documentation", icon: "docs" });
  }

  return actions;
}

function ActionIcon({ icon }: { icon: ProjectActionLink["icon"] }) {
  if (icon === "github") {
    return <GithubIcon className="h-4 w-4 shrink-0" />;
  }

  if (icon === "docs") {
    return <FileText className="h-4 w-4 shrink-0" aria-hidden />;
  }

  return <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />;
}

export function ProjectActions({
  project,
  variant = "hero",
  className,
}: ProjectActionsProps) {
  const actions = buildProjectActions(project);

  if (actions.length === 0) {
    return null;
  }

  if (variant === "inline") {
    return (
      <Inline gap="sm" className={cn("gap-3", className)}>
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            external
            className="gap-2 text-sm text-muted-foreground no-underline hover:text-ds-accent-hover"
          >
            <ActionIcon icon={action.icon} />
            {action.label}
          </Link>
        ))}
      </Inline>
    );
  }

  return (
    <Inline gap="sm" className={cn("flex-wrap gap-2 sm:gap-3", className)}>
      {actions.map((action, index) => (
        <Button
          key={action.label}
          variant={index === 0 ? "default" : "outline"}
          size="sm"
          asChild
        >
          <a href={action.href} target="_blank" rel="noopener noreferrer">
            <ActionIcon icon={action.icon} />
            {action.label}
          </a>
        </Button>
      ))}
    </Inline>
  );
}

export function hasProjectActions(project: PortfolioItem): boolean {
  return buildProjectActions(project).length > 0;
}
