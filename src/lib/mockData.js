// src/lib/mockData.js
// JSX-compatible mock data for Shop & ProductDetails
// Tailwind DARK/GOLDEN theme

// ASSET IMPORTS
import heroSneaker from "@/assets/hero_luxury_sneaker_spotlight.png";
import highTopSneaker from "@/assets/high-top_sneaker_white_gold.png";
import runningShoe from "@/assets/athletic_running_shoe_gold.png";
import formalShoe from "@/assets/black_formal_shoe_product.png";
import minimalistSneaker from "@/assets/minimalist_white_sneaker_product.png";
import navySuedeLoafer from "@/assets/navy_suede_loafer_gold.png"; // NEW

// SHOE DATA
export const SHOES = [
  {
    id: 1,
    name: "Aurum Stealth X",
    brand: "Nike",
    price: 450,
    category: "Sneakers",
    gender: "Men",
    image: heroSneaker,
    description:
      "Hand-crafted Italian leather with 24k gold plated accents. The ultimate statement in streetwear luxury.",
    sizes: [7, 8, 9, 10, 11, 12],
    colors: ["#000000", "#D4AF37"], // Black & Gold
    arEnabled: true,
    themeClasses: "bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]",
  },
  {
    id: 2,
    name: "GoldRush Runner",
    brand: "Adidas",
    price: 299,
    category: "Running",
    gender: "Women",
    image: runningShoe,
    description:
      "Aerodynamic design meets opulent aesthetics. High-performance sole with gold-infused cushioning.",
    sizes: [6, 7, 8, 9, 10, 11],
    colors: ["#000000", "#FFFFFF"], // Black & White
    arEnabled: true,
    themeClasses: "bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]",
  },
  {
    id: 3,
    name: "Midas Oxford",
    brand: "Clarks",
    price: 850,
    category: "Formal",
    gender: "Men",
    image: formalShoe,
    description:
      "Classic oxford silhouette reimagined for the modern tycoon. Polished black leather with subtle gold stitching.",
    sizes: [8, 9, 10, 11, 12],
    colors: ["#000000", "#3E2723"], // Black & Dark Brown
    arEnabled: false,
    themeClasses: "bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]",
  },
  {
    id: 4,
    name: "HighTop Luxe",
    brand: "Puma",
    price: 380,
    category: "Sneakers",
    gender: "Unisex",
    image: highTopSneaker,
    description:
      "Premium high-top sneaker with white and gold accents. Bold, stylish, and luxurious.",
    sizes: [7, 8, 9, 10, 11],
    colors: ["#FFFFFF", "#D4AF37"], // White & Gold
    arEnabled: true,
    themeClasses: "bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]",
  },
  {
    id: 5,
    name: "Minimalist White",
    brand: "Nike",
    price: 210,
    category: "Casual",
    gender: "Women",
    image: minimalistSneaker,
    description:
      "A clean, minimalist sneaker with subtle gold highlights. Comfort meets understated luxury.",
    sizes: [5, 6, 7, 8, 9],
    colors: ["#FFFFFF", "#D4AF37"], // White & Gold
    arEnabled: true,
    themeClasses: "bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]",
  },
  {
    id: 6,
    name: "Executive Loafer",
    brand: "Gucci",
    price: 950,
    category: "Formal",
    gender: "Men",
    image: formalShoe,
    description:
      "The definitive loafer for the boardroom. Horsebit detail in solid gold.",
    sizes: [8, 9, 10, 11],
    colors: ["#000000"], // Black
    arEnabled: true,
    themeClasses: "bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]",
  },
  {
    id: 7,
    name: "Navy Suede Loafer",
    brand: "Gucci",
    price: 920,
    category: "Formal",
    gender: "Men",
    image: navySuedeLoafer,
    description:
      "Luxurious navy suede with subtle gold accents. Perfect for formal events and boardroom meetings.",
    sizes: [8, 9, 10, 11],
    colors: ["#0A1F44", "#D4AF37"], // Navy & Gold
    arEnabled: true,
    themeClasses: "bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]",
  },
];
