"use client";

import { useTransition, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

/**
 * Shared hook for navigating to a product detail page with immediate
 * per-card loading feedback.
 *
 * Usage:
 *   const { navigateTo, isPendingFor } = useProductNavigation();
 *
 *   // In click handler:
 *   navigateTo(product.slug, product.id);
 *
 *   // In render:
 *   const loading = isPendingFor(product.id);
 */
export function useProductNavigation() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // Track which product id triggered the navigation so only THAT card shows
  // a spinner — not every card on the page.
  const [pendingId, setPendingId] = useState<string | number | null>(null);

  const navigateTo = useCallback(
    (slug: string, id: string | number) => {
      // Already navigating — ignore extra clicks on any card.
      if (isPending) return;
      setPendingId(id);
      startTransition(() => {
        router.push(`/${slug}`);
      });
    },
    [isPending, router, startTransition],
  );

  const isPendingFor = useCallback(
    (id: string | number) => isPending && pendingId === id,
    [isPending, pendingId],
  );

  return { navigateTo, isPendingFor, anyPending: isPending };
}
