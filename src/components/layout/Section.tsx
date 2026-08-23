import * as React from "react";

import { cn } from "@/lib/utils";

interface SectionProps extends React.ComponentProps<"section"> {
  /** Sets `aria-labelledby` when a section heading id is provided. */
  labelledBy?: string;
}

function Section({
  className,
  labelledBy,
  id,
  ...props
}: SectionProps) {
  return (
    <section
      data-slot="section"
      id={id}
      aria-labelledby={labelledBy}
      className={cn("scroll-mt-20 py-12 md:py-14", className)}
      {...props}
    />
  );
}

export { Section };
