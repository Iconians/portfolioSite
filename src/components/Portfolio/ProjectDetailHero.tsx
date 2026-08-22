import Image from "next/image";

import { Stack } from "@/components/layout/Stack";
import { Surface } from "@/components/layout/Surface";
import { ProjectActions } from "@/components/Portfolio/ProjectActions";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";

import type { PortfolioItem } from "@/lib/types/portfolio";

interface ProjectDetailHeroProps {
  project: PortfolioItem;
}

export function ProjectDetailHero({ project }: ProjectDetailHeroProps) {
  return (
    <header>
      <Stack gap="lg" className="md:gap-6">
        <Surface
          variant="card"
          className="relative aspect-[16/9] overflow-hidden md:aspect-[21/9]"
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
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background/70 to-transparent"
          />
        </Surface>

        <Stack gap="md" className="md:gap-5">
          <Stack gap="sm" className="md:gap-3">
            {project.projectType === "engineering" ? (
              <Heading variant="eyebrow">Engineering platform</Heading>
            ) : null}
            <Heading
              level={1}
              className="text-3xl md:text-4xl lg:text-[2.625rem] lg:leading-tight"
            >
              {project.caption}
            </Heading>
            {project.subtitle?.trim() ? (
              <Text variant="bodyLarge" className="max-w-2xl">
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
