import {
  projectPageStyles,
  projectSectionWidthClasses,
  type ProjectSectionWidth,
} from "@/lib/portfolio/project-page-styles";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ProjectPageSectionProps {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  width?: ProjectSectionWidth;
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

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn(projectPageStyles.sectionGap, className)}
    >
      <div
        className={cn(
          projectSectionWidthClasses[width],
          surface && projectPageStyles.sectionElevated,
          align === "center" && "text-center"
        )}
      >
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
        <div className={contentClassName}>{children}</div>
      </div>
    </section>
  );
}
