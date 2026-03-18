// src/lib/mockData.js
// NEW REAL PRODUCT DATA (Gallery Enabled)

import addidasStreetClassic from "@/assets/addidas_street_classic.png";
import addidasStreetClassic1 from "@/assets/addidas_street_classic1.png";

import stanSmithRetro from "@/assets/stan_smith_retro.png";
import stanSmithRetro1 from "@/assets/stan_smith_retro1.png";

import urbanGreyRunner from "@/assets/urban_grey_runner.png";
import urbanGreyRunner1 from "@/assets/urban_grey_runner1.png";

import nikeFlexMotion from "@/assets/nike_flex_motion.png";
import nikeFlexMotion1 from "@/assets/nike_flex_motion1.png";

import nikeZoomRunner from "@/assets/nike_zoom_runner.png";
import nikeZoomRunner1 from "@/assets/nike_zoom_runner1.png";

import airJordanHigh from "@/assets/air_jordan_high1.png";
import airJordanHigh1 from "@/assets/air_jordan_high.png";

import pumaStreetHigh from "@/assets/puma_street_high1.png";
import pumaStreetHigh1 from "@/assets/puma_street_high.png";

export const SHOES = [

  {
    id: 1,
    name: "Adidas Street Classic",
    brand: "Adidas",
    price: 140,
    category: "Sneakers",
    gender: "Men",
    images: [addidasStreetClassic, addidasStreetClassic1],
    description: "Retro indoor style sneaker with durable gum sole and classic 3-stripe design.",
    sizes: [7, 8, 9, 10, 11],
    colors: ["#29150a"],
    arEnabled: true,
  },

  {
    id: 2,
    name: "Stan Smith Retro",
    brand: "Adidas",
    price: 160,
    category: "Casual",
    gender: "Unisex",
    images: [stanSmithRetro, stanSmithRetro1],
    description: "Iconic clean leather sneaker with perforated stripes and green heel tab.",
    sizes: [6, 7, 8, 9, 10],
    colors: ["#fff"],
    arEnabled: true,
  },

  {
    id: 3,
    name: "Urban Grey Runner",
    brand: "Clarks",
    price: 190,
    category: "Running",
    gender: "Men",
    images: [urbanGreyRunner, urbanGreyRunner1],
    description: "Modern suede mesh runner designed for comfort and everyday movement.",
    sizes: [7, 8, 9, 10],
    colors: ["#777"],
    arEnabled: true,
  },

  {
    id: 4,
    name: "Nike Flex Motion",
    brand: "Nike",
    price: 210,
    category: "Training",
    gender: "Unisex",
    images: [nikeFlexMotion, nikeFlexMotion1],
    description: "Lightweight flexible training sneaker ideal for gym sessions and cardio workouts.",
    sizes: [7, 8, 9, 10, 11],
    colors: ["#000"],
    arEnabled: true,
  },

  {
    id: 5,
    name: "Nike Zoom Runner",
    brand: "Nike",
    price: 240,
    category: "Running",
    gender: "Unisex",
    images: [nikeZoomRunner, nikeZoomRunner1],
    description: "Performance running shoe with breathable mesh and responsive Zoom cushioning.",
    sizes: [7, 8, 9, 10, 11],
    colors: ["#000"],
    arEnabled: true,
  },

  {
    id: 6,
    name: "Air Jordan High",
    brand: "Jordan",
    price: 320,
    category: "Basketball",
    gender: "Men",
    images: [airJordanHigh, airJordanHigh1],
    description: "Legendary high-top sneaker delivering bold street presence and court performance.",
    sizes: [8, 9, 10, 11],
     colors: ["#ffffff", "#ff0000", "#000000"],
    arEnabled: true,
  },

  {
    id: 7,
    name: "Puma Street High",
    brand: "Puma",
    price: 200,
    category: "Sneakers",
    gender: "Men",
    images: [pumaStreetHigh, pumaStreetHigh1],
    description: "Stylish winter high-top sneaker with inner fur lining for comfort and warmth.",
    sizes: [7, 8, 9, 10],
    colors: ["#000"],
    arEnabled: true,
  }

];