import * as React from "react";

import { cn } from "@/lib/utils";

function Label({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="typography-label"
      className={cn(
        "text-xs font-medium uppercase tracking-wider text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export { Label };
