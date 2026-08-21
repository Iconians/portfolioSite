export const PLATFORM_FEATURE_CATALOG = [
  "Media library & persisted uploads",
  "Swappable storage (local / S3-compatible)",
  "Sectioned project editor",
  "Engineering story fields",
  "Project metrics",
  "Project evolution timeline",
  "Platform showcase section",
  "Slug-based project routing",
  "Admin shell & auth hardening",
  "SEO & Open Graph metadata",
  "Gallery & hero media picker",
] as const;

export type PlatformCatalogFeature = (typeof PLATFORM_FEATURE_CATALOG)[number];

const catalogKeySet = new Set(
  PLATFORM_FEATURE_CATALOG.map((feature) => feature.toLowerCase())
);

export function isCatalogPlatformFeature(feature: string): boolean {
  return catalogKeySet.has(feature.trim().toLowerCase());
}

export function partitionPlatformFeatures(features: string[]): {
  catalogSelections: string[];
  customFeatures: string[];
} {
  const catalogSelections: string[] = [];
  const customFeatures: string[] = [];

  for (const feature of features) {
    const trimmed = feature.trim();
    if (!trimmed) {
      continue;
    }

    if (isCatalogPlatformFeature(trimmed)) {
      const catalogMatch = PLATFORM_FEATURE_CATALOG.find(
        (entry) => entry.toLowerCase() === trimmed.toLowerCase()
      );
      if (catalogMatch && !catalogSelections.includes(catalogMatch)) {
        catalogSelections.push(catalogMatch);
      }
      continue;
    }

    if (!customFeatures.some((entry) => entry.toLowerCase() === trimmed.toLowerCase())) {
      customFeatures.push(trimmed);
    }
  }

  return { catalogSelections, customFeatures };
}
