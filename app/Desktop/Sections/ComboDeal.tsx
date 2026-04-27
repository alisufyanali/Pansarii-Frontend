"use client";

import { allProducts } from "@/app/Desktop/data/products";
import ProductSection from "./ProductSection";

export default function ComboDeal() {
  const products = allProducts.filter(p => p.category === "Supplements");

  return (
    <ProductSection
      title="Combo"
      titleHighlight="Deals"
      products={products}
      bannerImg="/images/Banner4.png"
      bannerAlt="Combo Deals"
    />
  );
}
