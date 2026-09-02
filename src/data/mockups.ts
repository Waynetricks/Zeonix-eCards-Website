import type { GalleryDesign } from "../types";

/**
 * Decorative invitation mockups used for ambient visuals in the Hero and
 * About sections (not the real portfolio — see `data/portfolio.ts` for
 * actual Zeonix eCards client designs shown in the Gallery section).
 */
export const mockupDesigns: GalleryDesign[] = [
  {
    id: "m1",
    category: "Wedding",
    title: "Amani & Neema",
    palette: ["#0C2521", "#FCFDFC"],
    motif: "arch",
    rotation: -3,
  },
  {
    id: "m2",
    category: "Wedding",
    title: "Baraka & Faraja",
    palette: ["#4C7A26", "#F2F5F0"],
    motif: "botanical",
    rotation: 2,
  },
  {
    id: "m3",
    category: "Kitchen Party",
    title: "Zawadi's Kitchen Party",
    palette: ["#81BE46", "#0C2521"],
    motif: "wave",
    rotation: -2,
  },
  {
    id: "m4",
    category: "Graduation",
    title: "Class of 2026",
    palette: ["#0C2521", "#FCFDFC"],
    motif: "geometric",
    rotation: -2,
  },
  {
    id: "m5",
    category: "Wedding",
    title: "Imani & Daudi",
    palette: ["#0C2521", "#F2F5F0"],
    motif: "botanical",
    rotation: -3,
  },
];
