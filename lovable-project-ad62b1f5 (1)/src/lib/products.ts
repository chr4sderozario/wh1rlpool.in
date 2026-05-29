import acmilanKaka from "@/assets/jersey-acmilan-kaka.jpg";
import italyFan from "@/assets/jersey-italy-fan.jpg";
import argentina2026 from "@/assets/jersey-argentina-2026.jpg";
import brazil2026 from "@/assets/jersey-brazil-2026.jpg";
import argentinaTrainingPolo from "@/assets/jersey-argentina-training-polo.jpg";
import italyTrainingPolo from "@/assets/jersey-italy-training-polo.jpg";

export type Category = "club" | "national" | "retro" | "player";

export interface Product {
  id: string;
  slug: string;
  name: string;
  team: string;
  category: Category;
  price: number;
  mrp: number;
  image: string;
  badge?: string;
  bestSeller?: boolean;
  newArrival?: boolean;
  featured?: boolean;
  player?: string;
  description: string;
  rating: number;
  reviewCount: number;
}

export const products: Product[] = [
  {
    id: "acm-kaka-player",
    slug: "ac-milan-kaka-player-edition",
    name: "AC Milan Kaká Player Edition",
    team: "AC Milan",
    category: "player",
    player: "Kaká",
    price: 599,
    mrp: 1999,
    image: acmilanKaka,
    badge: "PLAYER EDITION",
    featured: true,
    newArrival: true,
    description:
      "Iconic AC Milan red-and-black home kit — Kaká player edition. Lightweight breathable fabric with classic Rossoneri stripes and bwin sponsor print.",
    rating: 4.9,
    reviewCount: 0,
  },
  {
    id: "italy-fan",
    slug: "italy-fan-version",
    name: "Italy Home Jersey (Fan Version)",
    team: "Italy",
    category: "national",
    price: 599,
    mrp: 1999,
    image: italyFan,
    badge: "FAN VERSION",
    newArrival: true,
    featured: true,
    description:
      "Azzurri green training-edition home kit with FIGC 4-star crest and quarter-zip polo collar. Breathable fan-version fabric — built for matchday energy.",
    rating: 4.8,
    reviewCount: 0,
  },
  {
    id: "brazil-2026-fan",
    slug: "brazil-2026-world-cup-edition",
    name: "Brazil 2026 World Cup Edition",
    team: "Brazil",
    category: "national",
    price: 649,
    mrp: 1999,
    image: brazil2026,
    badge: "WORLD CUP 2026",
    newArrival: true,
    featured: true,
    description:
      "Canarinho yellow Brazil 2026 World Cup edition home kit with bold green chevrons, classic polo collar, and the iconic CBF five-star crest. Built for Seleção fans.",
    rating: 4.9,
    reviewCount: 0,
  },
  {
    id: "argentina-2026-fan",
    slug: "argentina-2026-world-cup-fan",
    name: "Argentina 2026 World Cup Edition (Fan Version)",
    team: "Argentina",
    category: "national",
    price: 599,
    mrp: 1999,
    image: argentina2026,
    badge: "WORLD CUP 2026",
    newArrival: true,
    featured: true,
    bestSeller: true,
    description:
      "Bold blackout Argentina fan jersey with sweeping celeste swirls, three-star AFA crest, and FIFA World Champions 2022 patch. Limited 2026 World Cup edition.",
    rating: 4.9,
    reviewCount: 0,
  },
  {
    id: "argentina-training-polo",
    slug: "argentina-training-polo",
    name: "Argentina Training Polo Kit",
    team: "Argentina",
    category: "national",
    price: 549,
    mrp: 1899,
    image: argentinaTrainingPolo,
    badge: "TRAINING",
    newArrival: true,
    description:
      "Argentina training quarter-zip polo in deep navy with celeste shoulder panels, ribbed collar, and embroidered three-star AFA crest. Lightweight breathable mesh.",
    rating: 4.8,
    reviewCount: 0,
  },
  {
    id: "italy-training-polo",
    slug: "italy-training-polo",
    name: "Italy Training Polo Kit",
    team: "Italy",
    category: "national",
    price: 549,
    mrp: 1899,
    image: italyTrainingPolo,
    badge: "TRAINING",
    newArrival: true,
    description:
      "Italy training quarter-zip polo in deep Azzurri green with white shoulder sweeps, gold trim, and embroidered four-star FIGC Italia crest. Breathable mesh fabric.",
    rating: 4.8,
    reviewCount: 0,
  },
];

export const categories = [
  { slug: "club", title: "Club Jerseys", description: "Real Madrid, Barça, United & more" },
  { slug: "national", title: "National Teams", description: "Argentina, Brazil, France, England" },
  { slug: "retro", title: "Retro Classics", description: "Legendary kits, reborn" },
  { slug: "player", title: "Player Editions", description: "Messi, Ronaldo, Neymar, Vini" },
] as const;

export const findProduct = (slug: string) => products.find((p) => p.slug === slug);
export const byCategory = (cat: Category) => products.filter((p) => p.category === cat);
export const featured = () => products.filter((p) => p.featured);
export const bestSellers = () => products.filter((p) => p.bestSeller);
export const newArrivals = () => products.filter((p) => p.newArrival);

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
