import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const stackVariants = cva("flex flex-col", {
  variants: {
    gap: {
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
    },
  },
  defaultVariants: {
    gap: "md",
  },
});

function Stack({
  className,
  gap,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof stackVariants>) {
  return (
    <div
      data-slot="stack"
      className={cn(stackVariants({ gap }), className)}
      {...props}
    />
  );
}

const inlineVariants = cva("flex flex-row flex-wrap items-center", {
  variants: {
    gap: {
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
    },
  },
  defaultVariants: {
    gap: "md",
  },
});

function Inline({
  className,
  gap,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inlineVariants>) {
  return (
    <div
      data-slot="inline"
      className={cn(inlineVariants({ gap }), className)}
      {...props}
    />
  );
}

export { Inline, Stack };
