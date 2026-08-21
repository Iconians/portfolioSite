interface ProjectStorySectionProps {
  title: string;
  content: string;
}

function StoryParagraphs({ content }: { content: string }) {
  const paragraphs = content.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);

  if (paragraphs.length <= 1) {
    return (
      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
        {content}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="text-muted-foreground leading-relaxed">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export function ProjectStorySection({ title, content }: ProjectStorySectionProps) {
  return (
    <article className="space-y-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      <StoryParagraphs content={content} />
    </article>
  );
}
