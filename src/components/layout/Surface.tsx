import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const surfaceVariants = cva("rounded-xl border", {
  variants: {
    variant: {
      card: "border-border bg-card text-card-foreground shadow-sm",
      elevated:
        "border-border bg-card px-4 py-8 shadow-sm md:px-6 md:py-10",
      inner: "border-border bg-secondary text-secondary-foreground",
      panel: "border-border bg-secondary shadow-sm",
    },
    padding: {
      none: "",
      default: "p-5 md:p-6",
    },
  },
  defaultVariants: {
    variant: "card",
    padding: "none",
  },
});

function Surface({
  className,
  variant,
  padding,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof surfaceVariants>) {
  return (
    <div
      data-slot="surface"
      className={cn(surfaceVariants({ variant, padding }), className)}
      {...props}
    />
  );
}

export { Surface, surfaceVariants };
