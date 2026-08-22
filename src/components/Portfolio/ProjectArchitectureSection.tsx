import { Surface } from "@/components/layout/Surface";
import { StoryParagraphs } from "@/components/Portfolio/ProjectStorySection";
import { Heading } from "@/components/typography/Heading";
import { Label } from "@/components/typography/Label";
import { Text } from "@/components/typography/Text";
import { parseArchitectureLayers } from "@/lib/portfolio/architecture-layers";

interface ProjectArchitectureSectionProps {
  content: string;
}

export function ProjectArchitectureSection({ content }: ProjectArchitectureSectionProps) {
  const layers = parseArchitectureLayers(content);

  return (
    <Surface variant="panel" padding="default" className="space-y-5 md:space-y-6">
      <header className="space-y-1">
        <Label>System design</Label>
        <Heading level={3} className="text-lg md:text-xl">
          Architecture
        </Heading>
      </header>

      <div className="space-y-5">
        {layers ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {layers.map((layer) => (
              <Surface
                key={layer.name}
                variant="card"
                padding="default"
                className="space-y-3"
              >
                <Label>{layer.name}</Label>
                <ul className="space-y-1.5">
                  {layer.items.map((item) => (
                    <li key={item}>
                      <Text>{item}</Text>
                    </li>
                  ))}
                </ul>
              </Surface>
            ))}
          </div>
        ) : (
          <StoryParagraphs content={content} />
        )}
      </div>
    </Surface>
  );
}
