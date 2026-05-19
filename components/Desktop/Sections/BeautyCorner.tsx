"use client";

import { allProducts } from "@/data/products";
import ProductSection from "./ProductSection";

export default function BeautyCorner() {
  const products = allProducts.filter(p => p.category === "Beauty Corner");

  return (
    <ProductSection
      title="Beauty"
      titleHighlight="Corner"
      products={products}
      bannerImg="/images/beautycorner.png"
      bannerAlt="Beauty Corner"
      viewAllHref="/shop?category=Beauty+Corner"
    />
  );
}
