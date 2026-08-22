import { cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const headingLevelVariants = cva("", {
  variants: {
    level: {
      1: "text-4xl font-bold tracking-tight text-[var(--heading-color)] md:text-5xl",
      2: "text-3xl font-bold text-[var(--heading-color)] md:text-4xl",
      3: "text-base font-semibold text-[var(--heading-color)]",
      4: "text-sm font-semibold text-[var(--heading-color)]",
      5: "text-sm font-medium text-[var(--heading-color)]",
      6: "text-xs font-medium text-[var(--heading-color)]",
    },
  },
  defaultVariants: {
    level: 2,
  },
});

const eyebrowClasses =
  "text-xs font-medium uppercase tracking-wider text-muted-foreground";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const headingTags: Record<
  HeadingLevel,
  "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
};

type HeadingProps = {
  level?: HeadingLevel;
  variant?: "default" | "eyebrow";
} & Omit<React.ComponentProps<"h2">, "color">;

function Heading({
  className,
  level = 2,
  variant = "default",
  ...props
}: HeadingProps) {
  if (variant === "eyebrow") {
    return (
      <p
        data-slot="heading"
        data-variant="eyebrow"
        className={cn(eyebrowClasses, className)}
        {...(props as React.ComponentProps<"p">)}
      />
    );
  }

  const Tag = headingTags[level];

  return (
    <Tag
      data-slot="heading"
      data-level={level}
      className={cn(headingLevelVariants({ level }), className)}
      {...props}
    />
  );
}

export { Heading, headingLevelVariants };
