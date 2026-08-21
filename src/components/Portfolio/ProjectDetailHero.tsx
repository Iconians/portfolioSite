import Image from "next/image";
import { ProjectActions } from "@/components/Portfolio/ProjectActions";
import { projectPageStyles } from "@/lib/portfolio/project-page-styles";
import type { PortfolioItem } from "@/lib/types/portfolio";

interface ProjectDetailHeroProps {
  project: PortfolioItem;
}

export function ProjectDetailHero({ project }: ProjectDetailHeroProps) {
  return (
    <header className="space-y-5 md:space-y-6">
      <div
        className={`${projectPageStyles.card} relative aspect-[16/9] overflow-hidden md:aspect-[21/9]`}
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
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--site-bg-color)]/70 to-transparent"
        />
      </div>
      <div className="space-y-4 md:space-y-5">
        <div className="space-y-2.5 md:space-y-3">
          {project.projectType === "engineering" ? (
            <p className={projectPageStyles.eyebrow}>Engineering platform</p>
          ) : null}
          <h1 className="text-3xl font-bold tracking-tight text-[var(--heading-color)] md:text-4xl lg:text-[2.625rem] lg:leading-tight">
            {project.caption}
          </h1>
          {project.subtitle?.trim() ? (
            <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
              {project.subtitle}
            </p>
          ) : null}
        </div>
        <ProjectActions project={project} />
      </div>
    </header>
  );
}
