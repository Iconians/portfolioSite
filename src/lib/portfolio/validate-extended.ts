import { validatePlatformShowcase } from "@/lib/portfolio/platform";
import type { PortfolioExtendedInput } from "@/lib/types/portfolio";
import { PortfolioExtendedFieldsSchema } from "@/lib/types/portfolio";

export function validatePortfolioExtendedInput(
  input: PortfolioExtendedInput
): PortfolioExtendedInput {
  const parsed = PortfolioExtendedFieldsSchema.parse(input);

  if (
    parsed.showPlatformSection !== undefined ||
    parsed.platformFeatures !== undefined
  ) {
    validatePlatformShowcase({
      showPlatformSection: parsed.showPlatformSection ?? false,
      platformFeatures: parsed.platformFeatures ?? [],
    });
  }

  return parsed;
}
