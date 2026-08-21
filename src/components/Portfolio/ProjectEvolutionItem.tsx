import { projectPageStyles } from "@/lib/portfolio/project-page-styles";
import type { ProjectVersion } from "@/lib/types/portfolio";

interface ProjectEvolutionItemProps {
  version: ProjectVersion;
  isLast: boolean;
}

function renderDescription(description: string) {
  const lines = description
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const bulletLines = lines.filter((line) => /^[-*•]\s+/.test(line));

  if (bulletLines.length >= 2) {
    return (
      <ul className="space-y-1.5">
        {bulletLines.map((line) => (
          <li
            key={line}
            className={`${projectPageStyles.body} list-inside list-disc marker:text-primary/70`}
          >
            {line.replace(/^[-*•]\s+/, "")}
          </li>
        ))}
      </ul>
    );
  }

  return <p className={`${projectPageStyles.body} whitespace-pre-line`}>{description}</p>;
}

export function ProjectEvolutionItem({
  version,
  isLast,
}: ProjectEvolutionItemProps) {
  const description = version.description?.trim();

  return (
    <li className="relative pb-7 pl-10 last:pb-0">
      {!isLast ? (
        <span
          aria-hidden="true"
          className="absolute left-[11px] top-[1.125rem] h-[calc(100%-1.125rem)] w-px bg-[var(--blog-card-border)]"
        />
      ) : null}
      <span
        aria-hidden="true"
        className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--blog-card-border)] bg-card"
      >
        <span className="h-2 w-2 rounded-full bg-primary" />
      </span>
      <div className="space-y-1.5">
        <p className={projectPageStyles.eyebrow}>{version.year}</p>
        <p className="text-xs font-medium text-muted-foreground">{version.version}</p>
        <h3 className="text-base font-semibold tracking-tight text-foreground md:text-[1.0625rem]">
          {version.title}
        </h3>
        {description ? renderDescription(description) : null}
      </div>
    </li>
  );
}
