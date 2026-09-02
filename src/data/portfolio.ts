import type { PortfolioDesign } from "../types";

/**
 * Real Zeonix eCards invitation designs.
 * To add a new design: drop the image in `public/gallery/` and add an
 * entry here with its category and pixel dimensions (used to preserve
 * the correct aspect ratio in the masonry layout before the image loads).
 */
export const portfolioDesigns: PortfolioDesign[] = [
  {
    id: "p1",
    category: "Wedding",
    title: "Andrew & Janeth",
    image: "/gallery/wedding-andrew-janeth.jpg",
    width: 1142,
    height: 1600,
  },
  {
    id: "p2",
    category: "Wedding",
    title: "Stanslaus & Mevis",
    image: "/gallery/wedding-stanslaus-mevis.jpg",
    width: 1254,
    height: 1254,
  },
  {
    id: "p3",
    category: "Wedding",
    title: "Themistockles & Grace",
    image: "/gallery/wedding-themistockles-grace.jpg",
    width: 736,
    height: 1030,
  },
  {
    id: "p4",
    category: "Wedding",
    title: "Simon & Ester",
    image: "/gallery/wedding-simon-ester.jpg",
    width: 620,
    height: 877,
  },
  {
    id: "p5",
    category: "Wedding",
    title: "Jackson & Monica",
    image: "/gallery/wedding-jackson-monica.jpg",
    width: 1080,
    height: 1080,
  },
  {
    id: "p6",
    category: "Send-off",
    title: "Mevis Leonard Massawe",
    image: "/gallery/sendoff-mevis-massawe.jpg",
    width: 1004,
    height: 1280,
  },
];
