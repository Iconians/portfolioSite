import { normalizePlatformFeatures } from "@/lib/portfolio/platform";
import { cn } from "@/lib/utils";

interface PlatformShowcaseProps {
  features: string[];
  title?: string;
  className?: string;
}

export function PlatformShowcase({
  features,
  title = "Built with this platform",
  className,
}: PlatformShowcaseProps) {
  const normalizedFeatures = normalizePlatformFeatures(features);

  if (normalizedFeatures.length === 0) {
    return null;
  }

  return (
    <section className={cn("rounded-lg border bg-card p-6", className)}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {normalizedFeatures.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <span aria-hidden="true" className="mt-0.5 text-primary">
              ✓
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
