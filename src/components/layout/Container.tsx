import * as React from "react";

import { cn } from "@/lib/utils";

type ContainerProps = React.ComponentProps<"div"> & {
  as?: "div" | "main";
};

function Container({
  as: Component = "div",
  className,
  ...props
}: ContainerProps) {
  return (
    <Component
      data-slot="container"
      className={cn("container mx-auto w-full max-w-7xl px-4", className)}
      {...props}
    />
  );
}

export { Container };
