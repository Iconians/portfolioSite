import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const textVariants = cva("", {
  variants: {
    variant: {
      body: "text-[0.9375rem] leading-7 text-muted-foreground",
      bodyLarge:
        "text-base leading-7 text-muted-foreground md:text-lg md:leading-8",
      description: "text-lg text-muted-foreground",
      muted: "text-sm text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

function Text({
  className,
  variant,
  ...props
}: React.ComponentProps<"p"> & VariantProps<typeof textVariants>) {
  return (
    <p
      data-slot="text"
      data-variant={variant ?? "body"}
      className={cn(textVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Text, textVariants };
