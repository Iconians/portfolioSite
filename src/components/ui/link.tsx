import { ExternalLinkIcon } from "lucide-react";
import NextLink from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";

type LinkProps = React.ComponentProps<typeof NextLink> & {
  external?: boolean;
};

function Link({
  className,
  external,
  children,
  href,
  ...props
}: LinkProps) {
  const isExternal =
    external ??
    (typeof href === "string" &&
      (href.startsWith("http://") || href.startsWith("https://")));

  if (isExternal) {
    return (
      <a
        data-slot="link"
        href={typeof href === "string" ? href : undefined}
        className={cn(
          "text-primary inline-flex items-center gap-1 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
          className
        )}
        target="_blank"
        rel="noopener noreferrer"
        {...(props as React.ComponentProps<"a">)}
      >
        {children}
        <ExternalLinkIcon className="size-3.5 shrink-0" aria-hidden />
        <span className="sr-only">(opens in new tab)</span>
      </a>
    );
  }

  return (
    <NextLink
      data-slot="link"
      href={href}
      className={cn(
        "text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
        className
      )}
      {...props}
    >
      {children}
    </NextLink>
  );
}

export { Link };
