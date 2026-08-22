import { TimelineItem } from "@/components/patterns/TimelineItem";
import { Text } from "@/components/typography/Text";

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
            className="list-inside list-disc text-[0.9375rem] leading-7 text-muted-foreground marker:text-primary/70"
          >
            {line.replace(/^[-*•]\s+/, "")}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Text className="whitespace-pre-line">{description}</Text>
  );
}

export function ProjectEvolutionItem({
  version,
  isLast,
}: ProjectEvolutionItemProps) {
  const description = version.description?.trim();

  return (
    <TimelineItem
      eyebrow={String(version.year)}
      meta={version.version}
      title={version.title}
      isLast={isLast}
    >
      {description ? renderDescription(description) : null}
    </TimelineItem>
  );
}
