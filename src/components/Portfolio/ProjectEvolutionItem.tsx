import type { ProjectVersion } from "@/lib/types/portfolio";

interface ProjectEvolutionItemProps {
  version: ProjectVersion;
  isLast: boolean;
}

export function ProjectEvolutionItem({
  version,
  isLast,
}: ProjectEvolutionItemProps) {
  return (
    <li className="relative pb-8 pl-8 last:pb-0">
      {!isLast ? (
        <span
          aria-hidden="true"
          className="absolute left-[7px] top-2 h-full w-px bg-border"
        />
      ) : null}
      <span
        aria-hidden="true"
        className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-primary bg-background"
      />
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {version.year} · {version.version}
        </p>
        <h3 className="text-base font-semibold text-foreground">{version.title}</h3>
        {version.description ? (
          <p className="text-sm text-muted-foreground">{version.description}</p>
        ) : null}
      </div>
    </li>
  );
}
