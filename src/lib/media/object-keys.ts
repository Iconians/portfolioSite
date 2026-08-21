import { sanitizeMediaFilename } from "@/lib/media/sanitize-filename";

export const MEDIA_OBJECT_DOMAINS = ["portfolio"] as const;
export type MediaObjectDomain = (typeof MEDIA_OBJECT_DOMAINS)[number];

export const PORTFOLIO_MEDIA_OBJECT_TYPES = ["project-hero"] as const;
export type PortfolioMediaObjectType =
  (typeof PORTFOLIO_MEDIA_OBJECT_TYPES)[number];

export type MediaObjectType = PortfolioMediaObjectType;

export interface MediaObjectKeyDescriptor {
  domain: MediaObjectDomain;
  type: MediaObjectType;
}

export interface CreateMediaObjectKeyInput extends MediaObjectKeyDescriptor {
  filename: string;
}

const MEDIA_OBJECT_PREFIXES: Record<
  `${MediaObjectDomain}:${MediaObjectType}`,
  string
> = {
  "portfolio:project-hero": "portfolio/projects/heroes",
};

export const DEFAULT_MEDIA_OBJECT_KEY_DESCRIPTOR: MediaObjectKeyDescriptor = {
  domain: "portfolio",
  type: "project-hero",
};

export function getMediaObjectPrefix(
  input: MediaObjectKeyDescriptor
): string {
  const prefix = MEDIA_OBJECT_PREFIXES[`${input.domain}:${input.type}`];
  if (!prefix) {
    throw new Error(`Unsupported media object type: ${input.domain}/${input.type}`);
  }
  return prefix;
}

export function createMediaObjectKey(input: CreateMediaObjectKeyInput): string {
  const prefix = getMediaObjectPrefix(input);
  const safeFilename = sanitizeMediaFilename(input.filename);
  const timestamp = Date.now();
  return `${prefix}/${timestamp}-${safeFilename}`;
}

export function isAllowedMediaObjectKey(key: string): boolean {
  return Object.values(MEDIA_OBJECT_PREFIXES).some((prefix) =>
    key.startsWith(`${prefix}/`)
  );
}
