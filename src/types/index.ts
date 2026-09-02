export type EventCategory =
  | "Wedding"
  | "Birthday"
  | "Send-off"
  | "Kitchen Party"
  | "Graduation"
  | "Custom Event";

export interface ServiceItem {
  id: string;
  category: EventCategory;
  title: string;
  description: string;
}

export interface GalleryDesign {
  id: string;
  category: EventCategory;
  title: string;
  palette: [string, string];
  motif: "botanical" | "geometric" | "arch" | "wave" | "frame" | "confetti";
  rotation: number;
}

export interface PortfolioDesign {
  id: string;
  category: EventCategory;
  title: string;
  image: string;
  width: number;
  height: number;
}

export interface ProcessStep {
  order: number;
  title: string;
  description: string;
}

export interface FeatureItem {
  title: string;
  description: string;
}
