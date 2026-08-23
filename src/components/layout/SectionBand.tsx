import * as React from "react";

import { cn } from "@/lib/utils";

export type SectionBandTone = "canvas" | "surfaceAlt" | "footer";

const toneClasses: Record<SectionBandTone, string> = {
  canvas: "bg-background",
  surfaceAlt: "bg-surface-alt",
  footer: "bg-footer",
};

type SectionBandProps = React.ComponentProps<"div"> & {
  tone: SectionBandTone;
};

function SectionBand({ tone, className, ...props }: SectionBandProps) {
  return (
    <div
      data-slot="section-band"
      data-tone={tone}
      className={cn("w-full", toneClasses[tone], className)}
      {...props}
    />
  );
}

export { SectionBand };
