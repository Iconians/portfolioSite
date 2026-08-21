import { Badge } from "@/components/ui/badge";
import { uniqueCategories } from "@/lib/portfolio/public-project";

interface ProjectTechnologiesProps {
  categories: string[];
}

export function ProjectTechnologies({ categories }: ProjectTechnologiesProps) {
  const technologies = uniqueCategories(categories);

  if (technologies.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-semibold">Technologies</h2>
      <div className="flex flex-wrap gap-2">
        {technologies.map((category) => (
          <Badge key={category} variant="secondary">
            {category}
          </Badge>
        ))}
      </div>
    </section>
  );
}
