import { ContentWidth } from "@/components/layout/ContentWidth";
import { Section } from "@/components/layout/Section";
import { Surface } from "@/components/layout/Surface";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { cn } from "@/lib/utils";

import type { ContentWidthVariant } from "@/components/layout/ContentWidth";
import type { ReactNode } from "react";

interface ProjectPageSectionProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  width?: ContentWidthVariant;
  align?: "start" | "center";
  surface?: boolean;
}

export function ProjectPageSection({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  contentClassName,
  headerClassName,
  width = "wide",
  align = "start",
  surface = false,
}: ProjectPageSectionProps) {
  const headingId = id ? `${id}-heading` : undefined;

  const header = (
    <div
      className={cn(
        "mb-6 space-y-2 md:mb-8",
        align === "center" && "mx-auto",
        headerClassName
      )}
    >
      {eyebrow ? <Heading variant="eyebrow">{eyebrow}</Heading> : null}
      <Heading level={2} id={headingId}>
        {title}
      </Heading>
      {description ? (
        <Text
          variant="description"
          className={cn(align === "center" && "mx-auto max-w-2xl text-pretty")}
        >
          {description}
        </Text>
      ) : null}
    </div>
  );

  const body = <div className={contentClassName}>{children}</div>;

  const sectionContent = surface ? (
    <Surface variant="elevated" padding="default">
      {header}
      {body}
    </Surface>
  ) : (
    <>
      {header}
      {body}
    </>
  );

  return (
    <Section id={id} labelledBy={headingId} className={className}>
      <ContentWidth
        width={width}
        className={align === "center" ? "text-center" : undefined}
      >
        {sectionContent}
      </ContentWidth>
    </Section>
  );
}
