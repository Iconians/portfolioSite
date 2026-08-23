import { cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const headingLevelVariants = cva("", {
  variants: {
    level: {
      1: "text-4xl font-bold tracking-tight text-foreground md:text-5xl",
      2: "text-3xl font-bold text-foreground md:text-4xl",
      3: "text-base font-semibold text-foreground",
      4: "text-sm font-semibold text-foreground",
      5: "text-sm font-medium text-foreground",
      6: "text-xs font-medium text-foreground",
    },
  },
  defaultVariants: {
    level: 2,
  },
});

const eyebrowClasses =
  "text-xs font-medium uppercase tracking-wider text-ds-accent";

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
  variant?: "default" | "eyebrow" | "display";
} & Omit<React.ComponentProps<"h2">, "color">;

const displayClasses =
  "text-4xl font-bold tracking-tight text-balance text-foreground md:text-5xl lg:text-[2.75rem] lg:leading-[1.15]";

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
      data-variant={variant === "display" ? "display" : undefined}
      className={cn(
        variant === "display" ? displayClasses : headingLevelVariants({ level }),
        className
      )}
      {...props}
    />
  );
}

export { Heading, headingLevelVariants };
