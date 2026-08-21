import { Badge } from "@/components/ui/badge";
import { uniqueCategories } from "@/lib/portfolio/public-project";
import { ProjectPageSection } from "./ProjectPageSection";

interface ProjectTechnologiesProps {
  categories: string[];
}

export function ProjectTechnologies({ categories }: ProjectTechnologiesProps) {
  const technologies = uniqueCategories(categories);

  if (technologies.length === 0) {
    return null;
  }

  return (
    <ProjectPageSection id="technologies" title="Technologies">
      <div className="flex flex-wrap gap-2">
        {technologies.map((category) => (
          <Badge key={category} variant="secondary" className="px-3 py-1 text-sm">
            {category}
          </Badge>
        ))}
      </div>
    </ProjectPageSection>
  );
}
