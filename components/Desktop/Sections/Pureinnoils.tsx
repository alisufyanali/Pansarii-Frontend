"use client";

import { allProducts } from "@/data/products";
import ProductSection from "./ProductSection";

export default function PansariInn() {
  return (
    <>
      <ProductSection
        title="PureInn"
        titleHighlight="Oils"
        products={allProducts.filter(p => p.category === "Oils")}
        bannerImg="/images/Banner2.png"
        bannerAlt="PureInn Oils"
        viewAllHref="/shop?category=Oils"
      />

      <ProductSection
        title="PureInn"
        titleHighlight="Herbal Extracts"
        products={allProducts.filter(p => p.category === "Herb")}
        bannerImg="/images/Banner3.png"
        bannerAlt="PureInn Herbal Extracts"
        viewAllHref="/shop?category=Herb"
      />
    </>
  );
}
