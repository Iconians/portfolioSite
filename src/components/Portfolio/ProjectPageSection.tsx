import { ContentWidth } from "@/components/layout/ContentWidth";
import { Section } from "@/components/layout/Section";
import { Surface } from "@/components/layout/Surface";
import { projectPageStyles } from "@/lib/portfolio/project-page-styles";
import { cn } from "@/lib/utils";

import type { ContentWidthVariant } from "@/components/layout/ContentWidth";
import type { ReactNode } from "react";

interface ProjectPageSectionProps {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  width?: ContentWidthVariant;
  align?: "start" | "center";
  surface?: boolean;
}

export function ProjectPageSection({
  id,
  title,
  description,
  children,
  className,
  contentClassName,
  width = "wide",
  align = "start",
  surface = false,
}: ProjectPageSectionProps) {
  const headingId = id ? `${id}-heading` : undefined;

  const header = (
    <div
      className={cn(
        projectPageStyles.sectionHeaderGap,
        "space-y-2",
        align === "center" && "mx-auto"
      )}
    >
      <h2 id={headingId} className={projectPageStyles.sectionTitle}>
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            projectPageStyles.sectionDescription,
            align === "center" && "mx-auto max-w-2xl"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );

  const body = <div className={contentClassName}>{children}</div>;

  const sectionContent = surface ? (
    <Surface variant="elevated">
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
