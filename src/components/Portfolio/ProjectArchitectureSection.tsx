import { parseArchitectureLayers } from "@/lib/portfolio/architecture-layers";
import { projectPageStyles } from "@/lib/portfolio/project-page-styles";
import { cn } from "@/lib/utils";

interface ProjectArchitectureSectionProps {
  content: string;
}

function StoryParagraphs({ content }: { content: string }) {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length <= 1) {
    return (
      <p className={cn(projectPageStyles.body, "whitespace-pre-line")}>{content}</p>
    );
  }

  return (
    <div className="space-y-3">
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className={projectPageStyles.body}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export function ProjectArchitectureSection({ content }: ProjectArchitectureSectionProps) {
  const layers = parseArchitectureLayers(content);

  return (
    <article
      className={cn(
        projectPageStyles.panelHighlight,
        projectPageStyles.cardPadding,
        "space-y-5 md:space-y-6"
      )}
    >
      <header className="space-y-1">
        <p className={projectPageStyles.eyebrow}>System design</p>
        <h3 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
          Architecture
        </h3>
      </header>

      <div className="space-y-5">
        {layers ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {layers.map((layer) => (
              <div
                key={layer.name}
                className={`${projectPageStyles.card} ${projectPageStyles.cardPadding} space-y-3`}
              >
                <p className={projectPageStyles.eyebrow}>{layer.name}</p>
                <ul className="space-y-1.5">
                  {layer.items.map((item) => (
                    <li key={item} className={projectPageStyles.body}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <StoryParagraphs content={content} />
        )}
      </div>
    </article>
  );
}
