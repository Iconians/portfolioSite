import Image from "next/image";
import type { PortfolioItem } from "@/lib/types/portfolio";

interface ProjectDetailHeroProps {
  project: PortfolioItem;
}

export function ProjectDetailHero({ project }: ProjectDetailHeroProps) {
  return (
    <section className="space-y-6">
      <div className="relative aspect-[21/9] overflow-hidden rounded-xl bg-muted">
        <Image
          src={project.img}
          alt={project.caption}
          width={1400}
          height={600}
          priority
          className="h-full w-full object-cover"
        />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {project.caption}
        </h1>
        {project.subtitle?.trim() && (
          <p className="text-lg text-muted-foreground">{project.subtitle}</p>
        )}
      </div>
    </section>
  );
}
