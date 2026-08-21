import { ExternalLink, FileText } from "lucide-react";
import { isValidProjectLink } from "@/lib/portfolio/public-project";
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

interface ProjectLinksProps {
  project: PortfolioItem;
}

export function ProjectLinks({ project }: ProjectLinksProps) {
  const hasLiveSite = isValidProjectLink(project.url);
  const hasGithub = isValidProjectLink(project.github);
  const hasDocs = isValidProjectLink(project.docs);

  if (!hasLiveSite && !hasGithub && !hasDocs) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-semibold">Links</h2>
      <div className="flex flex-wrap items-center gap-4">
        {hasLiveSite && (
          <a
            href={project.url!}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            Live site
          </a>
        )}
        {hasGithub && (
          <a
            href={project.github!}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <GithubIcon className="h-4 w-4 shrink-0" />
            Source code
          </a>
        )}
        {hasDocs && (
          <a
            href={project.docs!}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <FileText className="h-4 w-4 shrink-0" />
            Documentation
          </a>
        )}
      </div>
    </section>
  );
}
