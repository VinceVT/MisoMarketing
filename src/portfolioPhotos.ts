// GENERATED FILE — do not edit by hand.
// Rebuild with: npm run import-portfolio
// Source: scripts/portfolio-photos.json
//
// This list is empty until the photos are imported. The portfolio page renders
// an honest "gallery is being updated" message while it is, rather than a grid
// of broken images, so the page is safe to deploy in this state.

export type PortfolioPhoto = {
  slug: string;
  /** Describes the photo for screen readers. Edit alt text in
   *  scripts/portfolio-photos.json, not here — this file is regenerated. */
  alt: string;
  /** Intrinsic size of the largest derivative, used to reserve layout space. */
  width: number;
  height: number;
  /** Responsive WebP candidates for the grid. */
  srcSet: string;
  /** Single JPEG for browsers without WebP. */
  fallback: string;
  /** Larger copy the lightbox loads on demand. */
  full: string;
};

export const portfolioPhotos: PortfolioPhoto[] = [];
