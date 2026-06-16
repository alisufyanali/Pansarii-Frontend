# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 10-laravel-e2e-flow.spec.ts >> Laravel-connected E2E flow >> Scenario 3 — Register & Merge (POST /cart and /wishlist, then clear localStorage keys)
- Location: tests\playwright\10-laravel-e2e-flow.spec.ts:235:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Shopping Cart, text=cart').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Shopping Cart, text=cart').first()

```

```yaml
- banner:
  - link "Facebook":
    - /url: https://facebook.com/pansariin.pk
    - img
  - link "Instagram":
    - /url: https://instagram.com/pansariin.pk
    - img
  - link "Twitter":
    - /url: https://twitter.com/pansariin
    - img
  - link "YouTube":
    - /url: https://youtube.com/pansariin
    - img
  - paragraph:
    - img
    - text: 100% Ayurvedic & Herbal Products
  - link "WhatsApp":
    - /url: https://wa.me/923001234567
    - img
    - text: +92 300 1234567
  - link "Pansariin.pk Home":
    - /url: /
    - img "Pansariin.pk Logo"
  - textbox "Search products":
    - /placeholder: Search for products...
  - button "Search":
    - img
  - link "Track Order":
    - /url: /track-order
    - img
    - text: Track Order
  - link "Sign In":
    - /url: /login
    - img
    - text: Sign In
  - button "Shopping Cart":
    - img
    - text: Cart
  - button "Browse Categories":
    - img
    - text: Categories
    - img
  - navigation "Main navigation":
    - link "Home":
      - /url: /
    - link "Shop":
      - /url: /shop
    - link "By Concern":
      - /url: /concern
    - link "Category":
      - /url: /category
    - link "Offers":
      - /url: /offers
    - link "Rewards":
      - /url: /rewards
    - link "Blog":
      - /url: /blog
  - link "Become an Affiliate":
    - /url: /affiliate
    - img
    - text: Become an Affiliate
- button "Cart":
  - img
  - text: Cart
- button "Wishlist":
  - img
  - text: Wishlist
- button "Close":
  - img
- paragraph: Your cart is empty
- img
- heading "Your cart is empty" [level=3]
- paragraph: Looks like you haven't added anything yet.
- button "Start Shopping"
- paragraph: You might also like
- img "Organic Ashwagandha Root"
- paragraph: Organic Ashwagandha Root
- text: PKR 899 PKR 1,199
- button "+"
- img "Pure Shilajit Resin"
- paragraph: Pure Shilajit Resin
- text: PKR 1,499 PKR 1,999
- button "+"
- img "Tulsi (Holy Basil) Leaves"
- paragraph: Tulsi (Holy Basil) Leaves
- text: PKR 299 PKR 399
- button "+"
- main
- img
- paragraph: Free Shipping
- paragraph: On orders above PKR 999
- img
- paragraph: Nationwide
- paragraph: Delivery Across Pakistan
- img
- paragraph: 100% Authentic
- paragraph: Certified Products
- img
- paragraph: Quick Delivery
- paragraph: 2–4 Business Days
- img
- paragraph: Eco-Friendly
- paragraph: Sustainable Packaging
- contentinfo:
  - img "Pansari Inn Logo"
  - paragraph:
    - text: "Email:"
    - link "pansariinn@gmail.com":
      - /url: mailto:pansariinn@gmail.com
  - paragraph:
    - text: "Phone:"
    - link "0304 577 9900":
      - /url: tel:+923045779900
  - paragraph: Follow Our Social Media!
  - link "Facebook":
    - /url: https://facebook.com/pansariin.pk
    - img
  - link "Twitter":
    - /url: https://twitter.com/pansariin
    - img
  - link "YouTube":
    - /url: https://youtube.com/pansariin
    - img
  - link "Instagram":
    - /url: https://instagram.com/pansariin.pk
    - img
  - heading "Quick Links" [level=4]
  - list:
    - listitem:
      - link "About Us":
        - /url: /aboutus
    - listitem:
      - link "Our Story":
        - /url: /our-story
    - listitem:
      - link "Blog":
        - /url: /blog
  - heading "Shop" [level=4]
  - list:
    - listitem:
      - link "Skincare":
        - /url: /beauty-corner
    - listitem:
      - link "Haircare":
        - /url: /shop?category=Herb
    - listitem:
      - link "Oils":
        - /url: /oils
    - listitem:
      - link "Supplements":
        - /url: /shop?category=Supplements
    - listitem:
      - link "Best Sellers":
        - /url: /shop
  - heading "Customer Service" [level=4]
  - list:
    - listitem:
      - link "Track Order":
        - /url: /track-order
    - listitem:
      - link "Returns":
        - /url: /returns
    - listitem:
      - link "Shipping Info":
        - /url: /shipping-info
    - listitem:
      - link "FAQs":
        - /url: /faqs
    - listitem:
      - link "Contact Us":
        - /url: /contact
  - heading "Join Our Mailing List" [level=4]
  - paragraph: Find out all about our latest offers, new products, and the science of Ayurveda in our newsletters!
  - textbox "E-mail"
  - button "Subscribe"
  - paragraph: Pansari Inn 2026. All rights reserved.
- region "Notifications Alt+T"
- alert
```

# Test source

```ts
  168 |     expect(productApiCalls.length, `Expected at least 1 /api/products* call, got: ${productApiCalls.join(', ')}`).toBeGreaterThan(0);
  169 | 
  170 |     await page.goto('/shop', { waitUntil: 'domcontentloaded' });
  171 |     await expect(page.locator('text=Showing').first()).toBeVisible();
  172 |     await expect(page.locator('button[aria-label="Next page"]').first()).toBeVisible();
  173 | 
  174 |     // Pagination basic check (if multiple pages exist)
  175 |     const nextBtn = page.locator('button[aria-label="Next page"]').first();
  176 |     if (await nextBtn.isEnabled()) {
  177 |       await nextBtn.click();
  178 |       await expect(page.locator('button[aria-current="page"]')).toBeVisible();
  179 |     }
  180 | 
  181 |     // Blog
  182 |     await page.goto('/blog', { waitUntil: 'domcontentloaded' });
  183 |     await expect(page.getByText(/Featured Articles|All Articles|Wellness Blog/i).first()).toBeVisible();
  184 | 
  185 |     // Open a real blog post slug (from API)
  186 |     const blogsRes = await request.get(`${API_BASE}/blogs`, { params: { per_page: 5, page: 1 } });
  187 |     expect(blogsRes.ok()).toBeTruthy();
  188 |     const blogsJson = (await blogsRes.json()) as { success: boolean; data: Array<{ slug: string }> };
  189 |     const blogSlug = blogsJson.data?.[0]?.slug;
  190 |     expect(blogSlug, 'No blog posts returned from API').toBeTruthy();
  191 | 
  192 |     await page.goto(`/blog/${blogSlug}`, { waitUntil: 'domcontentloaded' });
  193 |     await expect(page.locator('h1').first()).toBeVisible({ timeout: 15000 });
  194 |     // Related posts section (when API provides them)
  195 |     await page.locator('text=Related Articles').first().isVisible().catch(() => {});
  196 |   });
  197 | 
  198 |   test('Scenario 2 — Guest Cart & Wishlist uses localStorage only', async ({ page, request }) => {
  199 |     test.setTimeout(60000);
  200 |     const { product } = await getFirstApiProduct(request);
  201 | 
  202 |     const cartWishlistCalls: string[] = [];
  203 |     page.on('request', (req) => {
  204 |       const u = req.url();
  205 |       if (u.includes('/api/cart') || u.includes('/api/wishlist')) cartWishlistCalls.push(`${req.method()} ${u}`);
  206 |     });
  207 | 
  208 |     // Add to cart & wishlist as a guest via Product page
  209 |     await page.goto(`/products/${product.slug}`, { waitUntil: 'domcontentloaded' });
  210 |     // Product page renders a skeleton for ~800ms; wait for the button to appear.
  211 |     const addToCartBtn = page.getByRole('button', { name: /add to cart/i }).first();
  212 |     await expect(addToCartBtn).toBeVisible({ timeout: 20000 });
  213 |     await addToCartBtn.click();
  214 | 
  215 |     // Wishlist is an icon-only button positioned on the product image (no accessible name).
  216 |     const wishlistBtn = page.locator('button.absolute.top-2.left-2').first();
  217 |     if (await wishlistBtn.count()) {
  218 |       await wishlistBtn.click();
  219 |     }
  220 | 
  221 |     const cartRaw = await page.evaluate((k) => localStorage.getItem(k), CART_KEY);
  222 |     expect(cartRaw).not.toBeNull();
  223 |     const wishlistRaw = await page.evaluate((k) => localStorage.getItem(k), WISHLIST_KEY);
  224 |     expect(wishlistRaw).not.toBeNull();
  225 | 
  226 |     // No cart/wishlist API calls as a guest
  227 |     expect(cartWishlistCalls).toEqual([]);
  228 | 
  229 |     // Refresh persists
  230 |     await page.reload({ waitUntil: 'domcontentloaded' });
  231 |     expect(await page.evaluate((k) => localStorage.getItem(k), CART_KEY)).not.toBeNull();
  232 |     expect(await page.evaluate((k) => localStorage.getItem(k), WISHLIST_KEY)).not.toBeNull();
  233 |   });
  234 | 
  235 |   test('Scenario 3 — Register & Merge (POST /cart and /wishlist, then clear localStorage keys)', async ({
  236 |     page,
  237 |     request,
  238 |   }) => {
  239 |     test.setTimeout(90000);
  240 |     const { product, variant } = await getFirstApiProduct(request);
  241 | 
  242 |     await page.goto('/', { waitUntil: 'domcontentloaded' });
  243 |     await seedGuestCartAndWishlist(page, product.id, variant.id);
  244 | 
  245 |     const mergeCalls: string[] = [];
  246 |     page.on('request', (req) => {
  247 |       if ((req.url().includes('/api/cart') || req.url().includes('/api/wishlist')) && req.method() === 'POST') {
  248 |         mergeCalls.push(`${req.method()} ${req.url()}`);
  249 |       }
  250 |     });
  251 | 
  252 |     await registerNewUser(page, request);
  253 | 
  254 |     await expect
  255 |       .poll(async () => mergeCalls.length, { timeout: 30000 })
  256 |       .toBeGreaterThan(0);
  257 | 
  258 |     // localStorage should be cleared (merge moves to API)
  259 |     await expect
  260 |       .poll(async () => page.evaluate((k) => localStorage.getItem(k), CART_KEY), { timeout: 15000 })
  261 |       .toBeNull();
  262 |     await expect
  263 |       .poll(async () => page.evaluate((k) => localStorage.getItem(k), WISHLIST_KEY), { timeout: 15000 })
  264 |       .toBeNull();
  265 | 
  266 |     // Pages show items (from API)
  267 |     await page.goto('/cart', { waitUntil: 'domcontentloaded' });
> 268 |     await expect(page.locator('text=Shopping Cart, text=cart').first()).toBeVisible();
      |                                                                         ^ Error: expect(locator).toBeVisible() failed
  269 |     await page.goto('/wishlist', { waitUntil: 'domcontentloaded' });
  270 |     await expect(page.locator('body')).toBeVisible();
  271 |   });
  272 | 
  273 |   test('Scenario 4 — Logged-in Cart & Wishlist uses API, not localStorage', async ({ page, request }) => {
  274 |     const { product } = await getFirstApiProduct(request);
  275 |     await registerNewUser(page, request);
  276 | 
  277 |     const calls: string[] = [];
  278 |     page.on('request', (req) => {
  279 |       const u = req.url();
  280 |       if (u.includes('/api/cart') || u.includes('/api/wishlist')) calls.push(`${req.method()} ${u}`);
  281 |     });
  282 | 
  283 |     await page.goto(`/products/${product.slug}`, { waitUntil: 'domcontentloaded' });
  284 |     await page.getByRole('button', { name: /add to cart/i }).click();
  285 | 
  286 |     await expect
  287 |       .poll(async () => calls.some((c) => c.includes('POST') && c.includes('/api/cart')), { timeout: 15000 })
  288 |       .toBeTruthy();
  289 | 
  290 |     // Guest storage keys should not be used when logged in
  291 |     expect(await page.evaluate((k) => localStorage.getItem(k), CART_KEY)).toBeNull();
  292 |   });
  293 | 
  294 |   test('Scenario 5 & 6 — Checkout + Orders list', async ({ page, request }) => {
  295 |     test.setTimeout(120000);
  296 |     const { product } = await getFirstApiProduct(request);
  297 |     await registerNewUser(page, request);
  298 | 
  299 |     // Add one item to API cart
  300 |     await page.goto(`/products/${product.slug}`, { waitUntil: 'domcontentloaded' });
  301 |     await page.getByRole('button', { name: /add to cart/i }).click();
  302 | 
  303 |     await page.goto('/checkout', { waitUntil: 'domcontentloaded' });
  304 | 
  305 |     // Invalid coupon shows error
  306 |     await page.getByPlaceholder('Enter coupon code').fill('INVALID_COUPON_E2E');
  307 |     await page.getByRole('button', { name: 'Apply' }).click();
  308 |     await expect(page.locator('text=Invalid').first()).toBeVisible({ timeout: 15000 });
  309 | 
  310 |     // Fill shipping details and place order
  311 |     await page.locator('input[name="name"]').fill('E2E User');
  312 |     await page.locator('input[name="email"]').fill('e2e_order@example.com');
  313 |     await page.locator('input[name="address"]').fill('123 E2E Street');
  314 |     await page.locator('select[name="city"]').selectOption('lahore');
  315 | 
  316 |     await page.getByRole('button', { name: /place order/i }).click();
  317 |     await page.waitForURL(/\/order-confirmation\?orderId=\d+/, { timeout: 30000 });
  318 | 
  319 |     const url = new URL(page.url());
  320 |     const orderId = url.searchParams.get('orderId');
  321 |     expect(orderId).toMatch(/^\d+$/);
  322 | 
  323 |     // Confirmation should show real order number
  324 |     await expect(page.getByText(/Order Confirmed/i)).toBeVisible({ timeout: 15000 });
  325 |     await expect(page.locator(`text=#`).first()).toBeVisible();
  326 | 
  327 |     // Cart should now be empty (API cart cleared after order)
  328 |     await page.goto('/cart', { waitUntil: 'domcontentloaded' });
  329 |     await expect(page.locator('text=Your cart is empty').first()).toBeVisible({ timeout: 15000 });
  330 | 
  331 |     // Orders page contains the order and correct badge colors for pending/unpaid
  332 |     await page.goto('/orders', { waitUntil: 'domcontentloaded' });
  333 |     await expect(page.getByText('Order History')).toBeVisible({ timeout: 15000 });
  334 |     await expect(page.locator(`a[href*="orderId=${orderId}"]`).first()).toBeVisible({ timeout: 15000 });
  335 | 
  336 |     // Badge color checks (pending=yellow, unpaid=red) when those statuses apply
  337 |     const pendingBadge = page.locator('span.bg-yellow-100').filter({ hasText: /Pending/i });
  338 |     const unpaidBadge = page.locator('span.bg-red-100').filter({ hasText: /Unpaid/i });
  339 |     await pendingBadge.first().isVisible().catch(() => {});
  340 |     await unpaidBadge.first().isVisible().catch(() => {});
  341 |   });
  342 | 
  343 |   test('Scenario 7 — Contact Form validation + success', async ({ page }) => {
  344 |     await page.goto('/contact', { waitUntil: 'domcontentloaded' });
  345 | 
  346 |     await page.locator('input[name="name"]').fill('E2E Contact');
  347 |     await page.locator('input[name="email"]').fill('bad-email');
  348 |     await page.locator('textarea[name="message"]').fill('Hello from Playwright E2E');
  349 |     await page.getByRole('button', { name: /send|submit/i }).click();
  350 | 
  351 |     // Expect a validation error under email (422)
  352 |     await expect(page.locator('text=The email must be a valid email address').first()).toBeVisible({
  353 |       timeout: 10000,
  354 |     });
  355 | 
  356 |     // Submit valid
  357 |     await page.locator('input[name="email"]').fill('e2e_contact@example.com');
  358 |     await page.getByRole('button', { name: /send|submit/i }).click();
  359 |     await expect(page.locator('text=Message sent, text=success').first()).toBeVisible({ timeout: 10000 });
  360 |   });
  361 | 
  362 |   test('Scenario 8 — Logout clears token and redirects', async ({ page, request }) => {
  363 |     await registerNewUser(page, request);
  364 |     await page.goto('/profile', { waitUntil: 'domcontentloaded' });
  365 | 
  366 |     const logoutCalls: string[] = [];
  367 |     page.on('request', (req) => {
  368 |       if (req.url().includes('/api/logout')) logoutCalls.push(`${req.method()} ${req.url()}`);
```