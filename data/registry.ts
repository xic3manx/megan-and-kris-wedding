/**
 * Curated registry items. Replace the URLs/titles with your real picks.
 * The page handles 0..many items — drop the array if you only want the
 * honeymoon fund.
 */

export interface RegistryItem {
  id: string;
  category: string;
  title: string;
  brand?: string;
  blurb: string;
  url: string;
  /** path under /public/images/registry/, optional */
  image?: string;
}

export const REGISTRY_ITEMS: RegistryItem[] = [
  {
    id: "1",
    category: "The Table",
    title: "Set of six dinner plates",
    brand: "Crate & Barrel",
    blurb: "Hand-thrown stoneware in a soft bone glaze — for the long dinners we plan to host.",
    url: "https://www.crateandbarrel.com",
  },
  {
    id: "2",
    category: "The Kitchen",
    title: "Cast-iron Dutch oven",
    brand: "Le Creuset",
    blurb: "The colour we picked is plum. Everything begins in this pot.",
    url: "https://www.lecreuset.com",
  },
  {
    id: "3",
    category: "The Bedroom",
    title: "Linen sheets",
    brand: "Cultiver",
    blurb: "European flax linen, lavender colorway. Replace the URL with your real pick.",
    url: "https://cultiverusa.com",
  },
  {
    id: "4",
    category: "Memory Lane",
    title: "Heirloom photo album",
    brand: "Artifact Uprising",
    blurb: "Where the gallery on this site eventually becomes a paper book on the shelf.",
    url: "https://www.artifactuprising.com",
  },
];
