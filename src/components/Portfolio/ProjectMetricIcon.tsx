import { createElement } from "react";

import { getMetricIcon } from "@/lib/portfolio/metric-icons";

export function ProjectMetricIcon({ label }: { label: string }) {
  return createElement(getMetricIcon(label), {
    className: "h-4 w-4",
    "aria-hidden": true,
  });
}
