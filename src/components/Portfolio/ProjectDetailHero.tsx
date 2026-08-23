import Image from "next/image";

import { Stack } from "@/components/layout/Stack";
import { Surface } from "@/components/layout/Surface";
import { ProjectActions } from "@/components/Portfolio/ProjectActions";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { getProjectTypeLabel } from "@/lib/portfolio/public-project";

import type { PortfolioItem } from "@/lib/types/portfolio";

interface ProjectDetailHeroProps {
  project: PortfolioItem;
}

export function ProjectDetailHero({ project }: ProjectDetailHeroProps) {
  const projectTypeLabel = getProjectTypeLabel(project.projectType);

  return (
    <header className="pb-4 md:pb-6">
      <Stack gap="lg" className="md:gap-8">
        <Surface
          variant="card"
          className="relative aspect-[16/9] overflow-hidden border-border/80 md:aspect-[21/9]"
        >
          <Image
            src={project.img}
            alt={project.caption}
            width={1400}
            height={600}
            priority
            className="h-full w-full object-cover"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background/80 to-transparent"
          />
        </Surface>

        <Stack gap="md" className="md:gap-5">
          <Stack gap="sm">
            {projectTypeLabel ? (
              <Heading variant="eyebrow">{projectTypeLabel}</Heading>
            ) : null}
            <Heading level={1} variant="display">
              {project.caption}
            </Heading>
            {project.subtitle?.trim() ? (
              <Text variant="description" className="max-w-2xl text-pretty">
                {project.subtitle}
              </Text>
            ) : null}
          </Stack>
          <ProjectActions project={project} />
        </Stack>
      </Stack>
    </header>
  );
}
