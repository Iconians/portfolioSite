/**
 * Presentation contract for engineering screenshot galleries (Phase 7).
 * Domain layers map portfolio/media records to this shape before passing to patterns.
 */
export interface GalleryImage {
  url: string;
  /** Required for accessibility — callers must supply descriptive alt text. */
  alt: string;
  caption?: string;
}
