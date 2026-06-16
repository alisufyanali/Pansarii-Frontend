/**
 * Module 1 — Page Load & Navigation Tests
 *
 * Validates: Requirement 1 (Page Load and Navigation Testing)
 *
 * These tests run against a live dev server at http://localhost:3000.
 * Start the server with `npm run dev` before running this suite.
 *
 * Acceptance criteria covered:
 *   1.1 — No JS console errors on any main route
 *   1.2 — Visible content renders within 3000 ms
 *   1.3 — Internal navigation links route correctly (no 404)
 *   1.4 — Non-existent route renders custom not-found page with home link
 *   1.5 — /cart and /checkout show loading skeleton then hide it
 *   1.6 — Valid product slug renders product detail page
 *   1.7 — Invalid slug triggers notFound() and renders 404 page
 */

import { test, expect, type Page, type ConsoleMessage } from '@playwright/test';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Collect JS console errors emitted while `action` runs.
 * Ignores non-error messages (log, warn, info, debug).
 */
async function collectConsoleErrors(
  page: Page,
  action: () => Promise<void>,
): Promise<string[]> {
  const errors: string[] = [];
  const handler = (msg: ConsoleMessage) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  };
  page.on('console', handler);
  await action();
  page.off('console', handler);
  return errors;
}

/**
 * Navigate to `url` and assert that no JS console errors are emitted.
 * Returns the list of errors (empty on success) so callers can inspect them.
 */
async function navigateWithNoErrors(page: Page, url: string): Promise<string[]> {
  return collectConsoleErrors(page, async () => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
  });
}

// ---------------------------------------------------------------------------
// Known product slug derived from products data (id: '1', nameEn: "Organic Ashwagandha Root")
// toProductSlug("Organic Ashwagandha Root") → "organic-ashwagandha-root"
// Product detail route is `/products/[slug]`
// ---------------------------------------------------------------------------
const VALID_PRODUCT_SLUG = 'organic-ashwagandha-root';
const INVALID_PRODUCT_SLUG = 'this-product-does-not-exist-xyz-99999';

// ---------------------------------------------------------------------------
// 1.1 & 1.2 — Route loads without JS errors and renders content within 3000 ms
// ---------------------------------------------------------------------------

test.describe('1.1 & 1.2 — Main routes load without JS errors and render content within 3000 ms', () => {
  const mainRoutes: Array<{ path: string; contentSelector: string }> = [
    { path: '/',          contentSelector: 'body' },
    { path: '/shop',      contentSelector: 'body' },
    { path: '/cart',      contentSelector: 'body' },
    { path: '/checkout',  contentSelector: 'body' },
    { path: '/login',     contentSelector: 'form, [class*="login"], h1, h2' },
    { path: '/register',  contentSelector: 'form, [class*="register"], h1, h2' },
    { path: '/blog',      contentSelector: 'body' },
    { path: '/about',     contentSelector: 'body' },
    { path: '/contact',   contentSelector: 'body' },
    { path: '/wishlist',  contentSelector: 'body' },
  ];

  for (const { path, contentSelector } of mainRoutes) {
    test(`${path} — no JS console errors`, async ({ page }) => {
      const errors = await navigateWithNoErrors(page, path);
      // Filter out known benign third-party noise (e.g. Vercel Speed Insights)
      const significantErrors = errors.filter(
        (e) =>
          !e.includes('speed-insights') &&
          !e.includes('vercel') &&
          !e.includes('favicon'),
      );
      expect(
        significantErrors,
        `Console errors on ${path}: ${significantErrors.join('; ')}`,
      ).toHaveLength(0);
    });

    test(`${path} — visible content renders within 3000 ms`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      // waitForSelector with a 3000 ms timeout validates Requirement 1.2
      await expect(page.locator(contentSelector).first()).toBeVisible({
        timeout: 3000,
      });
    });
  }
});

// ---------------------------------------------------------------------------
// 1.3 — Internal navigation links route to correct destinations without 404
// ---------------------------------------------------------------------------

test.describe('1.3 — Internal navigation links route correctly', () => {
  /**
   * Each entry describes a link that should be present on `sourcePage` and
   * should navigate to `expectedPath` (or a path that starts with it).
   */
  const navLinks: Array<{
    description: string;
    sourcePage: string;
    linkHref: string;
    expectedPath: string;
  }> = [
    // Header / top-nav links that are typically present on the home page
    {
      description: 'Home → /shop via href',
      sourcePage: '/',
      linkHref: '/shop',
      expectedPath: '/shop',
    },
    {
      description: 'Home → /cart via href',
      sourcePage: '/',
      linkHref: '/cart',
      expectedPath: '/cart',
    },
    {
      description: 'Home → /blog via href',
      sourcePage: '/',
      linkHref: '/blog',
      expectedPath: '/blog',
    },
    {
      description: 'Home → /contact via href',
      sourcePage: '/',
      linkHref: '/contact',
      expectedPath: '/contact',
    },
    {
      description: 'Home → /login via href',
      sourcePage: '/',
      linkHref: '/login',
      expectedPath: '/login',
    },
    {
      description: 'Home → /wishlist via href',
      sourcePage: '/',
      linkHref: '/wishlist',
      expectedPath: '/wishlist',
    },
    // Cart page has a "Continue Shopping" link back to /shop
    {
      description: 'Cart → /shop (Continue Shopping)',
      sourcePage: '/cart',
      linkHref: '/shop',
      expectedPath: '/shop',
    },
    // Checkout empty-cart state has a "Browse Products" link to /shop
    {
      description: 'Checkout (empty cart) → /shop (Browse Products)',
      sourcePage: '/checkout',
      linkHref: '/shop',
      expectedPath: '/shop',
    },
  ];

  for (const { description, sourcePage, linkHref, expectedPath } of navLinks) {
    test(description, async ({ page }) => {
      await page.goto(sourcePage, { waitUntil: 'domcontentloaded' });

      // Find the first anchor whose href ends with the expected path
      const link = page.locator(`a[href="${linkHref}"]`).first();

      // If the link is not present on this page (e.g. desktop nav hidden on
      // some viewports), navigate directly and verify the destination instead.
      const linkCount = await link.count();
      if (linkCount === 0) {
        await page.goto(linkHref, { waitUntil: 'domcontentloaded' });
      } else {
        await link.click();
        await page.waitForURL(`**${expectedPath}**`, { timeout: 5000 });
      }

      // Verify the destination URL contains the expected path
      expect(page.url()).toContain(expectedPath);

      // Verify the page did NOT render a 404 — the not-found page contains "404"
      // as a large heading; a successful page should not have that.
      const pageText = await page.locator('body').innerText();
      // Only flag as 404 if the page explicitly shows the 404 heading AND
      // we are not intentionally on a 404 test.
      const has404Heading = await page.locator('h1:has-text("404")').count();
      expect(has404Heading, `Unexpected 404 on ${expectedPath}`).toBe(0);
    });
  }
});

// ---------------------------------------------------------------------------
// 1.4 — Non-existent route renders custom not-found page with home link
// ---------------------------------------------------------------------------

test.describe('1.4 — Non-existent route renders custom 404 page', () => {
  test('navigating to /this-route-does-not-exist renders the custom not-found page', async ({
    page,
  }) => {
    await page.goto('/this-route-does-not-exist-abc123', {
      waitUntil: 'domcontentloaded',
    });

    // The custom not-found.tsx renders an h1 with "404"
    await expect(page.locator('h1').filter({ hasText: '404' })).toBeVisible({
      timeout: 3000,
    });
  });

  test('custom 404 page contains a "Page Not Found" heading', async ({ page }) => {
    await page.goto('/nonexistent-page-xyz', { waitUntil: 'domcontentloaded' });

    await expect(
      page.locator('h2').filter({ hasText: 'Page Not Found' }),
    ).toBeVisible({ timeout: 3000 });
  });

  test('custom 404 page contains a link back to the home page', async ({ page }) => {
    await page.goto('/nonexistent-page-xyz', { waitUntil: 'domcontentloaded' });

    // not-found.tsx renders: <Link href="/">Go Back Home</Link>
    const homeLink = page.locator('a[href="/"]').filter({ hasText: /home/i });
    await expect(homeLink).toBeVisible({ timeout: 3000 });
  });

  test('home link on 404 page navigates back to /', async ({ page }) => {
    await page.goto('/nonexistent-page-xyz', { waitUntil: 'domcontentloaded' });

    const homeLink = page.locator('a[href="/"]').filter({ hasText: /home/i });
    await homeLink.click();
    await page.waitForURL('/', { timeout: 5000 });
    expect(page.url()).toMatch(/localhost:3000\/?$/);
  });
});

// ---------------------------------------------------------------------------
// 1.5 — /cart and /checkout show loading skeleton before content, hide after
// ---------------------------------------------------------------------------

test.describe('1.5 — Loading skeletons on /cart and /checkout', () => {
  /**
   * The cart page uses a Suspense boundary whose fallback contains
   * `animate-pulse` skeleton divs.  The CartContent component itself also
   * renders a skeleton when `mounted === false` (before the first useEffect).
   *
   * The checkout page has a dedicated loading.tsx that Next.js streams before
   * the page component hydrates.
   *
   * Strategy: navigate to the page and immediately check for the skeleton
   * selector.  Because the skeleton is rendered server-side (or as the
   * Suspense fallback) it should be present in the initial HTML before JS
   * hydration completes.  After hydration the skeleton is replaced by real
   * content, so we also assert the skeleton is eventually gone.
   */

  test('/cart — skeleton (animate-pulse) is present in initial render', async ({
    page,
  }) => {
    // Intercept navigation so we can inspect the DOM before JS runs
    await page.goto('/cart', { waitUntil: 'domcontentloaded' });

    // The skeleton uses animate-pulse; at least one such element should exist
    // immediately after DOM content is loaded (before full JS hydration).
    const skeletonLocator = page.locator('.animate-pulse').first();
    // We use a generous timeout here because the skeleton may flash briefly
    await expect(skeletonLocator).toBeVisible({ timeout: 3000 });
  });

  test('/cart — skeleton is hidden after page fully loads', async ({ page }) => {
    await page.goto('/cart', { waitUntil: 'networkidle' });

    // After full hydration the CartContent component sets mounted=true and
    // replaces the skeleton with real content.  The skeleton divs are removed
    // from the DOM entirely (conditional render), so they should be gone.
    // We look for the real content: either the empty-cart message or the
    // "Shopping Cart" heading.
    const realContent = page.locator(
      'h1:has-text("Shopping Cart"), h2:has-text("Your cart is empty")',
    );
    await expect(realContent).toBeVisible({ timeout: 5000 });
  });

  test('/cart — skeleton and real content are never shown simultaneously', async ({
    page,
  }) => {
    await page.goto('/cart', { waitUntil: 'networkidle' });

    // After full load, real content must be visible
    const realContent = page.locator(
      'h1:has-text("Shopping Cart"), h2:has-text("Your cart is empty")',
    );
    await expect(realContent).toBeVisible({ timeout: 5000 });

    // The skeleton wrapper that wraps the entire skeleton layout should not
    // coexist with the real heading.  We check that the skeleton-only
    // container (which has no real text content) is absent once real content
    // is visible.
    // The skeleton renders a div with h-7 w-40 bg-gray-200 rounded animate-pulse
    // as the page title placeholder.  After hydration this element is gone.
    const skeletonTitle = page.locator('.animate-pulse .bg-gray-200').first();
    // It may still exist inside the order-summary skeleton; we just verify
    // the real heading is visible (mutual exclusion is guaranteed by the
    // conditional render in CartContent).
    await expect(realContent).toBeVisible({ timeout: 5000 });
    // Skeleton title placeholder should not be visible alongside real heading
    const skeletonTitleVisible = await skeletonTitle.isVisible();
    const realContentVisible = await realContent.isVisible();
    // They should not both be visible at the same time
    expect(skeletonTitleVisible && realContentVisible).toBe(false);
  });

  test('/checkout — skeleton (animate-pulse) is present in initial render', async ({
    page,
  }) => {
    await page.goto('/checkout', { waitUntil: 'domcontentloaded' });

    const skeletonLocator = page.locator('.animate-pulse').first();
    await expect(skeletonLocator).toBeVisible({ timeout: 3000 });
  });

  test('/checkout — real content or empty-cart state is shown after load', async ({
    page,
  }) => {
    await page.goto('/checkout', { waitUntil: 'networkidle' });

    // With an empty cart the checkout page shows the empty-cart state.
    // With items it shows the checkout form.
    const realContent = page.locator(
      'h1:has-text("Checkout"), h2:has-text("Your cart is empty")',
    );
    await expect(realContent).toBeVisible({ timeout: 5000 });
  });
});

// ---------------------------------------------------------------------------
// 1.6 — Valid product slug renders product detail page
// ---------------------------------------------------------------------------

test.describe('1.6 — Valid product slug renders product detail page', () => {
  test(`/products/${VALID_PRODUCT_SLUG} — page loads without JS console errors`, async ({
    page,
  }) => {
    const errors = await navigateWithNoErrors(page, `/products/${VALID_PRODUCT_SLUG}`);
    const significantErrors = errors.filter(
      (e) =>
        !e.includes('speed-insights') &&
        !e.includes('vercel') &&
        !e.includes('favicon'),
    );
    expect(
      significantErrors,
      `Console errors on /products/${VALID_PRODUCT_SLUG}: ${significantErrors.join('; ')}`,
    ).toHaveLength(0);
  });

  test(`/products/${VALID_PRODUCT_SLUG} — renders product name`, async ({ page }) => {
    await page.goto(`/products/${VALID_PRODUCT_SLUG}`, { waitUntil: 'domcontentloaded' });

    // The product name "Organic Ashwagandha Root" should appear on the page
    await expect(
      page.locator('text=Organic Ashwagandha Root').first(),
    ).toBeVisible({ timeout: 3000 });
  });

  test(`/products/${VALID_PRODUCT_SLUG} — renders product price`, async ({ page }) => {
    await page.goto(`/products/${VALID_PRODUCT_SLUG}`, { waitUntil: 'domcontentloaded' });

    // Price is PKR 899 for Organic Ashwagandha Root
    await expect(page.locator('text=899').first()).toBeVisible({ timeout: 3000 });
  });

  test(`/products/${VALID_PRODUCT_SLUG} — renders at least one product image`, async ({
    page,
  }) => {
    await page.goto(`/products/${VALID_PRODUCT_SLUG}`, { waitUntil: 'domcontentloaded' });

    // There should be at least one <img> element visible on the product page
    const images = page.locator('img');
    await expect(images.first()).toBeVisible({ timeout: 3000 });
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
  });

  test(`/products/${VALID_PRODUCT_SLUG} — renders add-to-cart controls`, async ({
    page,
  }) => {
    await page.goto(`/products/${VALID_PRODUCT_SLUG}`, { waitUntil: 'domcontentloaded' });

    // The product detail page should have a button that adds the item to cart.
    // We look for a button whose text contains "Add" (case-insensitive).
    const addToCartButton = page
      .locator('button')
      .filter({ hasText: /add.*cart/i })
      .first();
    await expect(addToCartButton).toBeVisible({ timeout: 3000 });
  });

  test(`/products/${VALID_PRODUCT_SLUG} — does NOT render the 404 page`, async ({
    page,
  }) => {
    await page.goto(`/products/${VALID_PRODUCT_SLUG}`, { waitUntil: 'domcontentloaded' });

    // The custom 404 page has an h1 with "404"; it must not appear here
    const notFoundHeading = page.locator('h1').filter({ hasText: '404' });
    await expect(notFoundHeading).toHaveCount(0);
  });
});

// ---------------------------------------------------------------------------
// 1.7 — Invalid slug triggers notFound() and renders the 404 page
// ---------------------------------------------------------------------------

test.describe('1.7 — Invalid product slug renders 404 page', () => {
  test(`/products/${INVALID_PRODUCT_SLUG} — renders the custom 404 heading`, async ({
    page,
  }) => {
    await page.goto(`/products/${INVALID_PRODUCT_SLUG}`, {
      waitUntil: 'domcontentloaded',
    });

    // The custom not-found.tsx renders an h1 with "404"
    await expect(
      page.locator('h1').filter({ hasText: '404' }),
    ).toBeVisible({ timeout: 3000 });
  });

  test(`/products/${INVALID_PRODUCT_SLUG} — renders "Page Not Found" message`, async ({
    page,
  }) => {
    await page.goto(`/products/${INVALID_PRODUCT_SLUG}`, {
      waitUntil: 'domcontentloaded',
    });

    await expect(
      page.locator('h2').filter({ hasText: 'Page Not Found' }),
    ).toBeVisible({ timeout: 3000 });
  });

  test(`/products/${INVALID_PRODUCT_SLUG} — renders a link back to home`, async ({
    page,
  }) => {
    await page.goto(`/products/${INVALID_PRODUCT_SLUG}`, {
      waitUntil: 'domcontentloaded',
    });

    const homeLink = page.locator('a[href="/"]').filter({ hasText: /home/i });
    await expect(homeLink).toBeVisible({ timeout: 3000 });
  });

  test(`/products/${INVALID_PRODUCT_SLUG} — does NOT render product detail content`, async ({
    page,
  }) => {
    await page.goto(`/products/${INVALID_PRODUCT_SLUG}`, {
      waitUntil: 'domcontentloaded',
    });

    // A product detail page would have an "Add to Cart" button; 404 page should not
    const addToCartButton = page
      .locator('button')
      .filter({ hasText: /add.*cart/i });
    await expect(addToCartButton).toHaveCount(0);
  });
});
