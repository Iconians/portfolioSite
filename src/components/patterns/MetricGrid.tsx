import * as React from "react";

import { cn } from "@/lib/utils";

interface MetricGridProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
}

function MetricGrid({ className, children, ...props }: MetricGridProps) {
  return (
    <div
      data-slot="metric-grid"
      className={cn(
        "grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { MetricGrid };
