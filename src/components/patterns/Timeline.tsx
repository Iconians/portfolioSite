import * as React from "react";

import { cn } from "@/lib/utils";

interface TimelineProps extends React.ComponentProps<"ol"> {
  children: React.ReactNode;
}

function Timeline({ className, children, ...props }: TimelineProps) {
  return (
    <ol
      data-slot="timeline"
      className={cn("p-5 md:p-6", className)}
      {...props}
    >
      {children}
    </ol>
  );
}

export { Timeline };
