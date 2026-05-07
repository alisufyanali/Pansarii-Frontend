"use client";

import { useState, useEffect } from "react";

/**
 * Standard responsive card count used across ALL product sections.
 * Change here → updates everywhere.
 *
 * Breakpoints:
 *  < 768px   → 2 cards  (mobile)
 *  768–1023  → 3 cards  (tablet)
 *  1024–1279 → 4 cards  (small laptop)
 *  1280–1535 → 4 cards  (laptop / 1080p)
 *  1536–1919 → 5 cards  (large desktop)
 *  1920–2559 → 5 cards  (FHD+)
 *  2560+     → 6 cards  (4K / ultrawide)
 */
export const CARD_GAP_PX = 24; // gap-6

export function useCardsToShow(max = 5): number {
  const [cards, setCards] = useState(4);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if      (w >= 2560) setCards(Math.min(max, 6));
      else if (w >= 1280) setCards(Math.min(max, 5));
      else if (w >= 1024) setCards(Math.min(max, 4));
      else if (w >= 768)  setCards(Math.min(max, 3));
      else                setCards(Math.min(max, 2));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [max]);

  return cards;
}

/** Returns the CSS calc() string for a card width inside a horizontal slider. */
export function cardWidthStyle(cardsToShow: number): string {
  const totalGap = (cardsToShow - 1) * CARD_GAP_PX;
  return `calc((min(100vw, 1920px) - 8vw - ${totalGap}px) / ${cardsToShow})`;
}
