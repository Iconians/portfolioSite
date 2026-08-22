import { Stack } from "@/components/layout/Stack";
import { Surface } from "@/components/layout/Surface";
import { Heading } from "@/components/typography/Heading";
import { Label } from "@/components/typography/Label";
import { Text } from "@/components/typography/Text";
import { cn } from "@/lib/utils";

interface StoryParagraphsProps {
  content: string;
}

export function StoryParagraphs({ content }: StoryParagraphsProps) {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length <= 1) {
    return <Text className="whitespace-pre-line">{content}</Text>;
  }

  return (
    <Stack gap="sm" className="gap-3">
      {paragraphs.map((paragraph) => (
        <Text key={paragraph}>{paragraph}</Text>
      ))}
    </Stack>
  );
}

interface ProjectStorySectionProps {
  title: string;
  content: string;
  variant?: "accent" | "card";
  className?: string;
}

export function ProjectStorySection({
  title,
  content,
  variant = "accent",
  className,
}: ProjectStorySectionProps) {
  if (variant === "card") {
    return (
      <Surface
        variant="elevated"
        padding="default"
        className={cn("flex h-full flex-col gap-3", className)}
      >
        <Heading level={3}>{title}</Heading>
        <StoryParagraphs content={content} />
      </Surface>
    );
  }

  return (
    <article
      className={cn("space-y-3 border-l-2 border-border/50 pl-4 md:pl-5", className)}
    >
      <Heading level={3}>{title}</Heading>
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
    <Surface variant="panel" padding="default" className="space-y-3">
      <Label>{title}</Label>
      <StoryParagraphs content={content} />
    </Surface>
  );
}
