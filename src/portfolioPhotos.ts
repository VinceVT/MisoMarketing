// GENERATED FILE — do not edit by hand.
// Rebuild with: npm run import-portfolio
// Source: scripts/portfolio-photos.json

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

export const portfolioPhotos: PortfolioPhoto[] = [
  {
    slug: "photo-1",
    alt: "Toasted garlic bread slices beside a tray of herb oil, chopped parsley and minced garlic, with a dish of pickled vegetables behind",
    width: 1333,
    height: 2000,
    srcSet: "/portfolio/photo-1-640.webp 640w, /portfolio/photo-1-1024.webp 1024w",
    fallback: "/portfolio/photo-1-1024.jpg",
    full: "/portfolio/photo-1-1333.webp",
  },
  {
    slug: "photo-2",
    alt: "Grilled bulgogi beef and shredded scallions piled over rice cakes in a spicy red broth, with a second hot pot in the background",
    width: 1333,
    height: 2000,
    srcSet: "/portfolio/photo-2-640.webp 640w, /portfolio/photo-2-1024.webp 1024w",
    fallback: "/portfolio/photo-2-1024.jpg",
    full: "/portfolio/photo-2-1333.webp",
  },
  {
    slug: "photo-3",
    alt: "Soju poured from a bottle into a chilled shot glass at a dinner table",
    width: 1333,
    height: 2000,
    srcSet: "/portfolio/photo-3-640.webp 640w, /portfolio/photo-3-1024.webp 1024w",
    fallback: "/portfolio/photo-3-1024.jpg",
    full: "/portfolio/photo-3-1333.webp",
  },
  {
    slug: "photo-4",
    alt: "Salmon and yellowtail sashimi arranged on shredded daikon in a bamboo serving box",
    width: 1333,
    height: 2000,
    srcSet: "/portfolio/photo-4-640.webp 640w, /portfolio/photo-4-1024.webp 1024w",
    fallback: "/portfolio/photo-4-1024.jpg",
    full: "/portfolio/photo-4-1333.webp",
  },
  {
    slug: "photo-5",
    alt: "A bowl of beef noodle soup with braised brisket, bok choy and scallions, served with cold side dishes",
    width: 1333,
    height: 2000,
    srcSet: "/portfolio/photo-5-640.webp 640w, /portfolio/photo-5-1024.webp 1024w",
    fallback: "/portfolio/photo-5-1024.jpg",
    full: "/portfolio/photo-5-1333.webp",
  },
];
