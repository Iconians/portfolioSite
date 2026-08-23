import * as React from "react";

import { cn } from "@/lib/utils";

function Caption({
  className,
  ...props
}: React.ComponentProps<"figcaption">) {
  return (
    <figcaption
      data-slot="caption"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export { Caption };
