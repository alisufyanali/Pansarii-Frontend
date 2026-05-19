import { test, expect, Page } from '@playwright/test';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CART_KEY = 'pansari-cart';

const SAMPLE_ITEM = {
  id: '1',
  img: '/images/product.png',
  nameEn: 'Test Product',
  nameUr: 'ٹیسٹ',
  price: 1000,
  quantity: 1,
  size: '30ml',
};

/** Seed localStorage with one cart item and navigate to /checkout. */
async function goToCheckoutWithCart(page: Page, items = [SAMPLE_ITEM]) {
  await page.goto('/');
  await page.evaluate(
    ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
    { key: CART_KEY, value: items },
  );
  await page.goto('/checkout');
}

/** Fill all required checkout fields. */
async function fillRequiredFields(page: Page) {
  await page.locator('input[name="name"]').fill('Ahmed Khan');
  await page.locator('input[name="email"]').fill('ahmed@example.com');
  // PhoneInput renders its actual <input> with class .PhoneInputInput
  await page.locator('.PhoneInputInput').fill('3001234567');
  await page.locator('input[name="address"]').fill('123 Test Street, Gulshan');
  await page.locator('select[name="city"]').selectOption('lahore');
}

// ---------------------------------------------------------------------------
// Test Suite
// ---------------------------------------------------------------------------

test.describe('Checkout Flow', () => {

  // ── 3.1 ─────────────────────────────────────────────────────────────────
  test.describe('3.1 Checkout form sections are visible with items in cart', () => {
    test('shows Contact Information, Shipping Address, and Payment Method sections', async ({ page }) => {
      await goToCheckoutWithCart(page);

      // All three section headings must be present
      await expect(page.getByText('Contact Information')).toBeVisible();
      await expect(page.getByText('Shipping Address')).toBeVisible();
      await expect(page.getByText('Payment Method')).toBeVisible();

      // Key form fields should be rendered
      await expect(page.locator('input[name="name"]')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('.PhoneInputInput')).toBeVisible();
      await expect(page.locator('input[name="address"]')).toBeVisible();
      await expect(page.locator('select[name="city"]')).toBeVisible();
    });
  });

  // ── 3.2 ─────────────────────────────────────────────────────────────────
  test.describe('3.2 Successful order submission', () => {
    test('generates order ID, stores order in localStorage, clears cart, and redirects to /order-confirmation', async ({ page }) => {
      await goToCheckoutWithCart(page);
      await fillRequiredFields(page);

      // Submit the form
      await page.getByRole('button', { name: 'Place Order' }).click();

      // Wait for redirect to order-confirmation
      await page.waitForURL(/\/order-confirmation\?orderId=ORD-\d+/, { timeout: 10000 });

      const url = new URL(page.url());
      const orderId = url.searchParams.get('orderId');
      expect(orderId).toMatch(/^ORD-\d+$/);

      // Order data must be stored in localStorage
      const storedOrder = await page.evaluate(
        (id: string) => localStorage.getItem(`order-${id}`),
        orderId as string,
      );
      expect(storedOrder).not.toBeNull();

      const orderData = JSON.parse(storedOrder as string);
      expect(orderData.orderId).toBe(orderId);
      expect(Array.isArray(orderData.items)).toBe(true);

      // Cart must be cleared
      const cartRaw = await page.evaluate((key: string) => localStorage.getItem(key), CART_KEY);
      const cart = cartRaw ? JSON.parse(cartRaw) : [];
      expect(cart).toHaveLength(0);
    });
  });

  // ── 3.3 ─────────────────────────────────────────────────────────────────
  test.describe('3.3 Validation prevents submission with missing required fields', () => {
    test('shows a validation error and prevents submission when name is missing', async ({ page }) => {
      await goToCheckoutWithCart(page);

      // Fill everything except name
      await page.locator('input[name="email"]').fill('ahmed@example.com');
      await page.locator('.PhoneInputInput').fill('3001234567');
      await page.locator('input[name="address"]').fill('123 Test Street');
      await page.locator('select[name="city"]').selectOption('lahore');

      await page.getByRole('button', { name: 'Place Order' }).click();

      // Page must NOT navigate away
      await expect(page).toHaveURL(/\/checkout/);

      // Browser native validation marks the field as invalid
      const nameInvalid = await page.locator('input[name="name"]').evaluate(
        (el: HTMLInputElement) => !el.validity.valid,
      );
      expect(nameInvalid).toBe(true);
    });

    test('shows a validation error and prevents submission when address is missing', async ({ page }) => {
      await goToCheckoutWithCart(page);

      await page.locator('input[name="name"]').fill('Ahmed Khan');
      await page.locator('input[name="email"]').fill('ahmed@example.com');
      await page.locator('.PhoneInputInput').fill('3001234567');
      // address intentionally left empty
      await page.locator('select[name="city"]').selectOption('lahore');

      await page.getByRole('button', { name: 'Place Order' }).click();

      await expect(page).toHaveURL(/\/checkout/);

      const addressInvalid = await page.locator('input[name="address"]').evaluate(
        (el: HTMLInputElement) => !el.validity.valid,
      );
      expect(addressInvalid).toBe(true);
    });

    test('shows a validation error and prevents submission when city is not selected', async ({ page }) => {
      await goToCheckoutWithCart(page);

      await page.locator('input[name="name"]').fill('Ahmed Khan');
      await page.locator('input[name="email"]').fill('ahmed@example.com');
      await page.locator('.PhoneInputInput').fill('3001234567');
      await page.locator('input[name="address"]').fill('123 Test Street');
      // city intentionally left at default empty value

      await page.getByRole('button', { name: 'Place Order' }).click();

      await expect(page).toHaveURL(/\/checkout/);

      const cityInvalid = await page.locator('select[name="city"]').evaluate(
        (el: HTMLSelectElement) => !el.validity.valid,
      );
      expect(cityInvalid).toBe(true);
    });
  });

  // ── 3.4 ─────────────────────────────────────────────────────────────────
  test.describe('3.4 Valid promo code applies discount and shows success message', () => {
    test('SAVE10 calls /api/validate-promo, applies 10% discount, and shows success message', async ({ page }) => {
      // Intercept the promo API for deterministic results
      await page.route('**/api/validate-promo', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            valid: true,
            type: 'percentage',
            value: 100, // 10% of 1000
            message: '10% discount applied! You saved PKR 100',
          }),
        });
      });

      await goToCheckoutWithCart(page);

      // Capture the API call
      const [request] = await Promise.all([
        page.waitForRequest('**/api/validate-promo'),
        (async () => {
          await page.locator('input[placeholder="Enter promo code"]').fill('SAVE10');
          await page.getByRole('button', { name: 'Apply' }).click();
        })(),
      ]);

      expect(request.method()).toBe('POST');
      const body = request.postDataJSON() as { code: string; subtotal: number };
      expect(body.code).toBe('SAVE10');

      // Success message must appear
      await expect(page.getByText(/10% discount applied/i)).toBeVisible();

      // Remove button replaces Apply button
      await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Apply' })).not.toBeVisible();
    });
  });

  // ── 3.5 ─────────────────────────────────────────────────────────────────
  test.describe('3.5 Invalid promo code shows error and leaves total unchanged', () => {
    test('shows error message returned by /api/validate-promo and does not apply discount', async ({ page }) => {
      await page.route('**/api/validate-promo', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            valid: false,
            type: null,
            value: 0,
            message: 'Invalid promo code',
          }),
        });
      });

      await goToCheckoutWithCart(page);

      // Record the total before applying promo
      const totalBefore = await page.locator('text=PKR 1,200').first().textContent();

      await page.locator('input[placeholder="Enter promo code"]').fill('BADCODE');
      await page.getByRole('button', { name: 'Apply' }).click();

      // Error message must be visible
      await expect(page.getByText('Invalid promo code')).toBeVisible();

      // Apply button must still be present (promo not applied)
      await expect(page.getByRole('button', { name: 'Apply' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Remove' })).not.toBeVisible();

      // Total must remain unchanged (1000 subtotal + 200 shipping = 1200)
      const totalAfter = await page.locator('text=PKR 1,200').first().textContent();
      expect(totalAfter).toBe(totalBefore);
    });
  });

  // ── 3.6 ─────────────────────────────────────────────────────────────────
  test.describe('3.6 Cash on Delivery records correct paymentMethod in stored order', () => {
    test('paymentMethod is "Cash on Delivery" in localStorage order data', async ({ page }) => {
      await goToCheckoutWithCart(page);
      await fillRequiredFields(page);

      // Cash on Delivery is the default; ensure it is selected
      await page.locator('input[type="radio"][value="cod"]').check();

      await page.getByRole('button', { name: 'Place Order' }).click();

      await page.waitForURL(/\/order-confirmation\?orderId=ORD-\d+/, { timeout: 10000 });

      const url = new URL(page.url());
      const orderId = url.searchParams.get('orderId') as string;

      const storedOrder = await page.evaluate(
        (id: string) => localStorage.getItem(`order-${id}`),
        orderId,
      );
      expect(storedOrder).not.toBeNull();

      const orderData = JSON.parse(storedOrder as string);
      expect(orderData.paymentMethod).toBe('Cash on Delivery');
    });
  });

  // ── 3.7 ─────────────────────────────────────────────────────────────────
  test.describe('3.7 Empty cart shows empty-cart state and no checkout form', () => {
    test('displays "Your cart is empty" heading and Browse Products link, and hides the checkout form', async ({ page }) => {
      // Navigate to checkout with an empty cart
      await page.goto('/');
      await page.evaluate((key: string) => localStorage.removeItem(key), CART_KEY);
      await page.goto('/checkout');

      // Empty-cart heading must be visible
      await expect(page.getByRole('heading', { name: 'Your cart is empty' })).toBeVisible();

      // Browse Products link must be present
      await expect(page.getByRole('link', { name: 'Browse Products' })).toBeVisible();

      // Checkout form fields must NOT be rendered
      await expect(page.locator('input[name="name"]')).not.toBeVisible();
      await expect(page.locator('input[name="address"]')).not.toBeVisible();
      await expect(page.getByRole('button', { name: 'Place Order' })).not.toBeVisible();
    });
  });

  // ── 3.8 ─────────────────────────────────────────────────────────────────
  test.describe('3.8 Place Order button shows loading state during submission', () => {
    test('disables the submit button and shows a loading spinner while processing', async ({ page }) => {
      await goToCheckoutWithCart(page);
      await fillRequiredFields(page);

      const submitButton = page.getByRole('button', { name: /Place Order|Processing/i });

      // Click and immediately check the loading state before redirect completes
      await submitButton.click();

      // The button should become disabled
      await expect(submitButton).toBeDisabled();

      // A spinner SVG with animate-spin class should appear
      await expect(page.locator('svg.animate-spin')).toBeVisible();

      // Wait for the redirect to complete (submission finishes)
      await page.waitForURL(/\/order-confirmation/, { timeout: 10000 });
    });
  });

});
