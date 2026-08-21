export function normalizePlatformFeatures(features: string[]): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const feature of features) {
    const trimmed = feature.trim();
    if (!trimmed) {
      continue;
    }

    const key = trimmed.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    normalized.push(trimmed);
  }

  return normalized;
}

export function validatePlatformShowcase(input: {
  showPlatformSection: boolean;
  platformFeatures: string[];
}): { showPlatformSection: boolean; platformFeatures: string[] } {
  const platformFeatures = normalizePlatformFeatures(input.platformFeatures);

  if (!input.showPlatformSection) {
    return {
      showPlatformSection: false,
      platformFeatures,
    };
  }

  if (platformFeatures.length === 0) {
    throw new Error(
      "Platform showcase requires at least one feature when enabled"
    );
  }

  return {
    showPlatformSection: true,
    platformFeatures,
  };
}
