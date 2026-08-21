import { projectPageStyles } from "@/lib/portfolio/project-page-styles";
import { cn } from "@/lib/utils";

interface ProjectStorySectionProps {
  title: string;
  content: string;
  variant?: "accent" | "card";
  className?: string;
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

export function ProjectStorySection({
  title,
  content,
  variant = "accent",
  className,
}: ProjectStorySectionProps) {
  if (variant === "card") {
    return (
      <article
        className={cn(
          projectPageStyles.cardElevated,
          projectPageStyles.cardPadding,
          "flex h-full flex-col space-y-3",
          className
        )}
      >
        <h3 className={projectPageStyles.subsectionTitle}>{title}</h3>
        <StoryParagraphs content={content} />
      </article>
    );
  }

  return (
    <article className={cn("space-y-3 border-l-2 border-border/50 pl-4 md:pl-5", className)}>
      <h3 className={projectPageStyles.subsectionTitle}>{title}</h3>
      <StoryParagraphs content={content} />
    </article>
  );
}

export function ProjectStoryCallout({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <article
      className={cn(
        projectPageStyles.panelHighlight,
        projectPageStyles.cardPadding,
        "space-y-3"
      )}
    >
      <p className={projectPageStyles.eyebrow}>{title}</p>
      <StoryParagraphs content={content} />
    </article>
  );
}
