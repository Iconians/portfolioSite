import * as React from "react";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface LoadingStateProps extends React.ComponentProps<"div"> {
  label?: string;
}

function LoadingState({
  className,
  label = "Loading…",
  ...props
}: LoadingStateProps) {
  return (
    <div
      data-slot="loading-state"
      role="status"
      className={cn(
        "flex items-center justify-center gap-2 text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      <Spinner />
      <span>{label}</span>
    </div>
  );
}

export { LoadingState };
