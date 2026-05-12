"use client";

import { newArrivals } from "@/components/Desktop/data/products";
import ProductSection from "./ProductSection";

export default function NewArrivals() {
  return (
    <ProductSection
      title="New"
      titleHighlight="Arrivals"
      products={newArrivals}
    />
  );
}
