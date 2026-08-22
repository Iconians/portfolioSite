import * as React from "react";

import { cn } from "@/lib/utils";

export type ContentWidthVariant = "narrow" | "article" | "wide" | "full";

const contentWidthClasses: Record<ContentWidthVariant, string> = {
  narrow: "mx-auto w-full max-w-2xl",
  article: "mx-auto w-full max-w-3xl",
  wide: "w-full",
  full: "w-full",
};

interface ContentWidthProps extends React.ComponentProps<"div"> {
  width?: ContentWidthVariant;
}

function ContentWidth({
  className,
  width = "wide",
  ...props
}: ContentWidthProps) {
  return (
    <div
      data-slot="content-width"
      className={cn(contentWidthClasses[width], className)}
      {...props}
    />
  );
}

export { ContentWidth, contentWidthClasses };
