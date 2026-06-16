# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 10-laravel-e2e-flow.spec.ts >> Laravel-connected E2E flow >> Scenario 3 — Register & Merge (POST /cart and /wishlist, then clear localStorage keys)
- Location: tests\playwright\10-laravel-e2e-flow.spec.ts:255:7

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0

Call Log:
- Timeout 15000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - link "Facebook" [ref=e7] [cursor=pointer]:
          - /url: https://facebook.com/pansariin.pk
          - img [ref=e8]
        - link "Instagram" [ref=e10] [cursor=pointer]:
          - /url: https://instagram.com/pansariin.pk
          - img [ref=e11]
        - link "Twitter" [ref=e13] [cursor=pointer]:
          - /url: https://twitter.com/pansariin
          - img [ref=e14]
        - link "YouTube" [ref=e16] [cursor=pointer]:
          - /url: https://youtube.com/pansariin
          - img [ref=e17]
      - paragraph [ref=e19]:
        - img [ref=e20]
        - text: 100% Ayurvedic & Herbal Products
      - link "WhatsApp" [ref=e22] [cursor=pointer]:
        - /url: https://wa.me/923001234567
        - img [ref=e23]
        - generic [ref=e25]: +92 300 1234567
    - generic [ref=e28]:
      - link "Pansariin.pk Home" [ref=e29] [cursor=pointer]:
        - /url: /
        - img "Pansariin.pk Logo" [ref=e31]
      - generic [ref=e33]:
        - textbox "Search products" [ref=e34]:
          - /placeholder: Search for products...
        - button "Search" [ref=e36]:
          - img [ref=e37]
      - generic [ref=e40]:
        - link "Track Order" [ref=e41] [cursor=pointer]:
          - /url: /track-order
          - img [ref=e42]
          - generic [ref=e44]: Track Order
        - link "Sign In" [ref=e45] [cursor=pointer]:
          - /url: /login
          - img [ref=e46]
          - generic [ref=e48]: Sign In
        - button "Shopping Cart" [ref=e49]:
          - img [ref=e51]
          - generic [ref=e54]: Cart
    - generic [ref=e57]:
      - button "Browse Categories" [ref=e58]:
        - img [ref=e59]
        - generic [ref=e61]: Categories
        - img [ref=e62]
      - navigation "Main navigation" [ref=e64]:
        - link "Home" [ref=e65] [cursor=pointer]:
          - /url: /
        - link "Shop" [ref=e66] [cursor=pointer]:
          - /url: /shop
        - link "By Concern" [ref=e67] [cursor=pointer]:
          - /url: /concern
        - link "Category" [ref=e68] [cursor=pointer]:
          - /url: /category
        - link "Offers" [ref=e69] [cursor=pointer]:
          - /url: /offers
        - link "Rewards" [ref=e70] [cursor=pointer]:
          - /url: /rewards
        - link "Blog" [ref=e71] [cursor=pointer]:
          - /url: /blog
      - link "Become an Affiliate" [ref=e72] [cursor=pointer]:
        - /url: /affiliate
        - img [ref=e73]
        - text: Become an Affiliate
  - generic [ref=e75]:
    - generic [ref=e76]:
      - generic [ref=e77]:
        - button "Cart" [ref=e78]:
          - img [ref=e79]
          - text: Cart
        - button "Wishlist 1" [ref=e81]:
          - img [ref=e82]
          - text: Wishlist
          - generic [ref=e84]: "1"
        - button "Close" [ref=e85]:
          - img [ref=e86]
      - paragraph [ref=e89]: Your cart is empty
    - generic [ref=e91]:
      - generic [ref=e92]:
        - img [ref=e94]
        - heading "Your cart is empty" [level=3] [ref=e96]
        - paragraph [ref=e97]: Looks like you haven't added anything yet.
        - button "Start Shopping" [ref=e98]
      - generic [ref=e99]:
        - paragraph [ref=e100]: You might also like
        - generic [ref=e101]:
          - generic [ref=e102]:
            - img "Organic Ashwagandha Root" [ref=e104]
            - generic [ref=e105]:
              - paragraph [ref=e106]: Organic Ashwagandha Root
              - generic [ref=e107]:
                - generic [ref=e108]: PKR 899
                - generic [ref=e109]: PKR 1,199
            - button "+" [ref=e110]
          - generic [ref=e111]:
            - img "Pure Shilajit Resin" [ref=e113]
            - generic [ref=e114]:
              - paragraph [ref=e115]: Pure Shilajit Resin
              - generic [ref=e116]:
                - generic [ref=e117]: PKR 1,499
                - generic [ref=e118]: PKR 1,999
            - button "+" [ref=e119]
          - generic [ref=e120]:
            - img "Tulsi (Holy Basil) Leaves" [ref=e122]
            - generic [ref=e123]:
              - paragraph [ref=e124]: Tulsi (Holy Basil) Leaves
              - generic [ref=e125]:
                - generic [ref=e126]: PKR 299
                - generic [ref=e127]: PKR 399
            - button "+" [ref=e128]
  - main [ref=e129]:
    - generic [ref=e131]:
      - generic [ref=e132]:
        - heading "Create Account" [level=1] [ref=e133]
        - paragraph [ref=e134]: Join Pansari Inn today
      - generic [ref=e135]:
        - generic [ref=e136]:
          - generic [ref=e137]:
            - generic [ref=e138]: Full Name
            - generic [ref=e139]:
              - img [ref=e140]
              - textbox "Full Name" [ref=e143]:
                - /placeholder: Ahmed Khan
          - generic [ref=e144]:
            - generic [ref=e145]: Email Address
            - generic [ref=e146]:
              - img [ref=e147]
              - textbox "Email Address" [ref=e150]:
                - /placeholder: your@email.com
          - generic [ref=e151]:
            - generic [ref=e152]: Phone Number
            - generic [ref=e153]:
              - img [ref=e154]
              - textbox "Phone Number" [ref=e156]:
                - /placeholder: +92 300 1234567
          - generic [ref=e157]:
            - generic [ref=e158]: Password
            - generic [ref=e159]:
              - img [ref=e160]
              - textbox "Password" [ref=e163]:
                - /placeholder: Create a password
              - button "Show password" [ref=e164]:
                - img [ref=e165]
          - generic [ref=e168]:
            - generic [ref=e169]: Confirm Password
            - generic [ref=e170]:
              - img [ref=e171]
              - textbox "Confirm Password" [ref=e174]:
                - /placeholder: Confirm your password
              - button "Show password" [ref=e175]:
                - img [ref=e176]
          - generic [ref=e179]:
            - checkbox "I agree to the Terms of Service and Privacy Policy" [ref=e180]
            - generic [ref=e181]:
              - text: I agree to the
              - link "Terms of Service" [ref=e182] [cursor=pointer]:
                - /url: /terms
              - text: and
              - link "Privacy Policy" [ref=e183] [cursor=pointer]:
                - /url: /privacy
          - button "Create Account" [ref=e184]
        - generic [ref=e187]: or
        - paragraph [ref=e189]:
          - text: Already have an account?
          - link "Sign in" [ref=e190] [cursor=pointer]:
            - /url: /login
  - generic [ref=e193]:
    - generic [ref=e194] [cursor=pointer]:
      - img [ref=e196]
      - paragraph [ref=e198]: Free Shipping
      - paragraph [ref=e199]: On orders above PKR 999
    - generic [ref=e200] [cursor=pointer]:
      - img [ref=e202]
      - paragraph [ref=e204]: Nationwide
      - paragraph [ref=e205]: Delivery Across Pakistan
    - generic [ref=e206] [cursor=pointer]:
      - img [ref=e208]
      - paragraph [ref=e210]: 100% Authentic
      - paragraph [ref=e211]: Certified Products
    - generic [ref=e212] [cursor=pointer]:
      - img [ref=e214]
      - paragraph [ref=e216]: Quick Delivery
      - paragraph [ref=e217]: 2–4 Business Days
    - generic [ref=e218] [cursor=pointer]:
      - img [ref=e220]
      - paragraph [ref=e222]: Eco-Friendly
      - paragraph [ref=e223]: Sustainable Packaging
  - contentinfo [ref=e224]:
    - generic [ref=e225]:
      - generic [ref=e226]:
        - generic [ref=e227]:
          - img "Pansari Inn Logo" [ref=e228]
          - generic [ref=e229]:
            - paragraph [ref=e230]:
              - text: "Email:"
              - link "pansariinn@gmail.com" [ref=e231] [cursor=pointer]:
                - /url: mailto:pansariinn@gmail.com
            - paragraph [ref=e232]:
              - text: "Phone:"
              - link "0304 577 9900" [ref=e233] [cursor=pointer]:
                - /url: tel:+923045779900
          - generic [ref=e234]:
            - paragraph [ref=e235]: Follow Our Social Media!
            - generic [ref=e236]:
              - link "Facebook" [ref=e237] [cursor=pointer]:
                - /url: https://facebook.com/pansariin.pk
                - img [ref=e238]
              - link "Twitter" [ref=e240] [cursor=pointer]:
                - /url: https://twitter.com/pansariin
                - img [ref=e241]
              - link "YouTube" [ref=e243] [cursor=pointer]:
                - /url: https://youtube.com/pansariin
                - img [ref=e244]
              - link "Instagram" [ref=e246] [cursor=pointer]:
                - /url: https://instagram.com/pansariin.pk
                - img [ref=e247]
        - generic [ref=e249]:
          - generic [ref=e250]:
            - heading "Quick Links" [level=4] [ref=e251]
            - list [ref=e252]:
              - listitem [ref=e253]:
                - link "About Us" [ref=e254] [cursor=pointer]:
                  - /url: /aboutus
              - listitem [ref=e255]:
                - link "Our Story" [ref=e256] [cursor=pointer]:
                  - /url: /our-story
              - listitem [ref=e257]:
                - link "Blog" [ref=e258] [cursor=pointer]:
                  - /url: /blog
          - generic [ref=e259]:
            - heading "Shop" [level=4] [ref=e260]
            - list [ref=e261]:
              - listitem [ref=e262]:
                - link "Skincare" [ref=e263] [cursor=pointer]:
                  - /url: /beauty-corner
              - listitem [ref=e264]:
                - link "Haircare" [ref=e265] [cursor=pointer]:
                  - /url: /shop?category=Herb
              - listitem [ref=e266]:
                - link "Oils" [ref=e267] [cursor=pointer]:
                  - /url: /oils
              - listitem [ref=e268]:
                - link "Supplements" [ref=e269] [cursor=pointer]:
                  - /url: /shop?category=Supplements
              - listitem [ref=e270]:
                - link "Best Sellers" [ref=e271] [cursor=pointer]:
                  - /url: /shop
          - generic [ref=e272]:
            - heading "Customer Service" [level=4] [ref=e273]
            - list [ref=e274]:
              - listitem [ref=e275]:
                - link "Track Order" [ref=e276] [cursor=pointer]:
                  - /url: /track-order
              - listitem [ref=e277]:
                - link "Returns" [ref=e278] [cursor=pointer]:
                  - /url: /returns
              - listitem [ref=e279]:
                - link "Shipping Info" [ref=e280] [cursor=pointer]:
                  - /url: /shipping-info
              - listitem [ref=e281]:
                - link "FAQs" [ref=e282] [cursor=pointer]:
                  - /url: /faqs
              - listitem [ref=e283]:
                - link "Contact Us" [ref=e284] [cursor=pointer]:
                  - /url: /contact
        - generic [ref=e285]:
          - generic [ref=e286]:
            - heading "Join Our Mailing List" [level=4] [ref=e287]
            - paragraph [ref=e288]: Find out all about our latest offers, new products, and the science of Ayurveda in our newsletters!
          - generic [ref=e289]:
            - textbox "E-mail" [ref=e290]
            - button "Subscribe" [ref=e291]
      - paragraph [ref=e293]: Pansari Inn 2026. All rights reserved.
  - region "Notifications Alt+T"
  - button "Open Next.js Dev Tools" [ref=e299] [cursor=pointer]:
    - img [ref=e300]
  - alert [ref=e303]
```

# Test source

```ts
  203 |     await expect(page.getByText(/Featured Articles|All Articles|Wellness Blog/i).first()).toBeVisible();
  204 | 
  205 |     // Open a real blog post slug (from API)
  206 |     const blogsRes = await request.get(`${API_BASE}/blogs`, { params: { per_page: 5, page: 1 } });
  207 |     expect(blogsRes.ok()).toBeTruthy();
  208 |     const blogsJson = (await blogsRes.json()) as { success: boolean; data: Array<{ slug: string }> };
  209 |     const blogSlug = blogsJson.data?.[0]?.slug;
  210 |     expect(blogSlug, 'No blog posts returned from API').toBeTruthy();
  211 | 
  212 |     await page.goto(`/blog/${blogSlug}`, { waitUntil: 'domcontentloaded' });
  213 |     await expect(page.locator('h1').first()).toBeVisible({ timeout: 15000 });
  214 |     // Related posts section (when API provides them)
  215 |     await page.locator('text=Related Articles').first().isVisible().catch(() => {});
  216 |   });
  217 | 
  218 |   test('Scenario 2 — Guest Cart & Wishlist uses localStorage only', async ({ page, request }) => {
  219 |     test.setTimeout(60000);
  220 |     const { product } = await getFirstApiProduct(request);
  221 | 
  222 |     const cartWishlistCalls: string[] = [];
  223 |     page.on('request', (req) => {
  224 |       const u = req.url();
  225 |       if (u.includes('/api/cart') || u.includes('/api/wishlist')) cartWishlistCalls.push(`${req.method()} ${u}`);
  226 |     });
  227 | 
  228 |     // Add to cart & wishlist as a guest via Product page
  229 |     await page.goto(`/products/${product.slug}`, { waitUntil: 'domcontentloaded' });
  230 |     // Product page renders a skeleton for ~800ms; wait for the button to appear.
  231 |     const addToCartBtn = page.getByRole('button', { name: /add to cart/i }).first();
  232 |     await expect(addToCartBtn).toBeVisible({ timeout: 20000 });
  233 |     await addToCartBtn.click();
  234 | 
  235 |     // Wishlist is an icon-only button positioned on the product image (no accessible name).
  236 |     const wishlistBtn = page.locator('button.absolute.top-2.left-2').first();
  237 |     if (await wishlistBtn.count()) {
  238 |       await wishlistBtn.click();
  239 |     }
  240 | 
  241 |     const cartRaw = await page.evaluate((k) => localStorage.getItem(k), CART_KEY);
  242 |     expect(cartRaw).not.toBeNull();
  243 |     const wishlistRaw = await page.evaluate((k) => localStorage.getItem(k), WISHLIST_KEY);
  244 |     expect(wishlistRaw).not.toBeNull();
  245 | 
  246 |     // No cart/wishlist API calls as a guest
  247 |     expect(cartWishlistCalls).toEqual([]);
  248 | 
  249 |     // Refresh persists
  250 |     await page.reload({ waitUntil: 'domcontentloaded' });
  251 |     expect(await page.evaluate((k) => localStorage.getItem(k), CART_KEY)).not.toBeNull();
  252 |     expect(await page.evaluate((k) => localStorage.getItem(k), WISHLIST_KEY)).not.toBeNull();
  253 |   });
  254 | 
  255 |   test('Scenario 3 — Register & Merge (POST /cart and /wishlist, then clear localStorage keys)', async ({
  256 |     page,
  257 |     request,
  258 |   }) => {
  259 |     test.setTimeout(90000);
  260 |     const { product, variant } = await getFirstApiProduct(request);
  261 | 
  262 |     await page.goto('/', { waitUntil: 'domcontentloaded' });
  263 |     await seedGuestCartAndWishlist(page, product.id, variant.id);
  264 | 
  265 |     const mergeCalls: string[] = [];
  266 |     page.on('request', (req) => {
  267 |       if ((req.url().includes('/api/cart') || req.url().includes('/api/wishlist')) && req.method() === 'POST') {
  268 |         mergeCalls.push(`${req.method()} ${req.url()}`);
  269 |       }
  270 |     });
  271 | 
  272 |     await registerNewUser(page, request);
  273 | 
  274 |     await expect
  275 |       .poll(async () => mergeCalls.length, { timeout: 30000 })
  276 |       .toBeGreaterThan(0);
  277 | 
  278 |     // localStorage should be cleared (merge moves to API)
  279 |     await expect
  280 |       .poll(async () => page.evaluate((k) => localStorage.getItem(k), CART_KEY), { timeout: 15000 })
  281 |       .toBeNull();
  282 |     await expect
  283 |       .poll(async () => page.evaluate((k) => localStorage.getItem(k), WISHLIST_KEY), { timeout: 15000 })
  284 |       .toBeNull();
  285 | 
  286 |     // Verify API has the merged items (source of truth)
  287 |     const token = await page.evaluate((k) => localStorage.getItem(k), TOKEN_KEY);
  288 |     expect(token).not.toBeNull();
  289 | 
  290 |     const apiCart = await request.get(`${API_BASE}/cart`, {
  291 |       headers: { Authorization: `Bearer ${token}` },
  292 |     });
  293 |     expect(apiCart.ok()).toBeTruthy();
  294 |     const cartJson = (await apiCart.json()) as { success: boolean; data: unknown[] };
  295 |     await expect
  296 |       .poll(async () => {
  297 |         const res = await request.get(`${API_BASE}/cart`, {
  298 |           headers: { Authorization: `Bearer ${token}` },
  299 |         });
  300 |         const body = (await res.json()) as { data: unknown[] };
  301 |         return body.data.length;
  302 |       }, { timeout: 15000 })
> 303 |       .toBeGreaterThan(0);
      |        ^ Error: expect(received).toBeGreaterThan(expected)
  304 | 
  305 |     const apiWishlist = await request.get(`${API_BASE}/wishlist`, {
  306 |       headers: { Authorization: `Bearer ${token}` },
  307 |     });
  308 |     expect(apiWishlist.ok()).toBeTruthy();
  309 |     const wishJson = (await apiWishlist.json()) as { success: boolean; data: unknown[] };
  310 |     expect(wishJson.data.length).toBeGreaterThan(0);
  311 |   });
  312 | 
  313 |   test('Scenario 4 — Logged-in Cart & Wishlist uses API, not localStorage', async ({ page, request }) => {
  314 |     const { product } = await getFirstApiProduct(request);
  315 |     await registerNewUser(page, request);
  316 | 
  317 |     const calls: string[] = [];
  318 |     page.on('request', (req) => {
  319 |       const u = req.url();
  320 |       if (u.includes('/api/cart') || u.includes('/api/wishlist')) calls.push(`${req.method()} ${u}`);
  321 |     });
  322 | 
  323 |     await page.goto(`/products/${product.slug}`, { waitUntil: 'domcontentloaded' });
  324 |     await page.getByRole('button', { name: /add to cart/i }).click();
  325 | 
  326 |     await expect
  327 |       .poll(async () => calls.some((c) => c.includes('POST') && c.includes('/api/cart')), { timeout: 15000 })
  328 |       .toBeTruthy();
  329 | 
  330 |     // Guest storage keys should not be used when logged in
  331 |     expect(await page.evaluate((k) => localStorage.getItem(k), CART_KEY)).toBeNull();
  332 |   });
  333 | 
  334 |   test('Scenario 5 & 6 — Checkout + Orders list', async ({ page, request }) => {
  335 |     test.setTimeout(120000);
  336 |     const { product } = await getFirstApiProduct(request);
  337 |     await registerNewUser(page, request);
  338 | 
  339 |     // Add to cart via UI (real user flow — must populate CartContext before checkout)
  340 |     await page.goto(`/products/${product.slug}`, { waitUntil: 'domcontentloaded' });
  341 |     const addToCartBtn = page.getByRole('button', { name: /add to cart/i }).first();
  342 |     await expect(addToCartBtn).toBeVisible({ timeout: 20000 });
  343 |     const [cartPostRes] = await Promise.all([
  344 |       page.waitForResponse((r) => r.url().includes('/api/cart') && r.request().method() === 'POST'),
  345 |       addToCartBtn.click(),
  346 |     ]);
  347 |     expect([200, 201].includes(cartPostRes.status())).toBeTruthy();
  348 | 
  349 |     await page.goto('/checkout', { waitUntil: 'domcontentloaded' });
  350 |     await expect(page.getByText('Contact Information')).toBeVisible({ timeout: 20000 });
  351 | 
  352 |     // Invalid coupon shows error
  353 |     await page.getByPlaceholder('Enter coupon code').fill('INVALID_COUPON_E2E');
  354 |     const [couponRes] = await Promise.all([
  355 |       page.waitForResponse((r) => r.url().includes('/api/coupons/validate') && r.request().method() === 'POST'),
  356 |       page.getByRole('button', { name: 'Apply' }).click(),
  357 |     ]);
  358 |     expect([200, 400, 401, 404, 422].includes(couponRes.status())).toBeTruthy();
  359 |     await expect(page.locator('p.text-red-500').first()).toBeVisible({ timeout: 20000 });
  360 | 
  361 |     // Fill shipping details and place order
  362 |     await page.locator('input[name="name"]').fill('E2E User');
  363 |     await page.locator('input[name="email"]').fill('e2e_order@example.com');
  364 |     await page.locator('input[name="address"]').fill('123 E2E Street');
  365 |     await page.locator('select[name="city"]').selectOption('lahore');
  366 | 
  367 |     const [orderRes] = await Promise.all([
  368 |       page.waitForResponse((r) => r.url().includes('/api/orders') && r.request().method() === 'POST'),
  369 |       page.getByRole('button', { name: /place order/i }).click(),
  370 |     ]);
  371 |     expect([200, 201, 422].includes(orderRes.status())).toBeTruthy();
  372 |     await page.waitForURL(/\/order-confirmation\?orderId=\d+/, { timeout: 30000 });
  373 | 
  374 |     const url = new URL(page.url());
  375 |     const orderId = url.searchParams.get('orderId');
  376 |     expect(orderId).toMatch(/^\d+$/);
  377 | 
  378 |     // Confirmation should show real order number
  379 |     await expect(page.getByRole('heading', { name: /Order Confirmed/i })).toBeVisible({ timeout: 15000 });
  380 |     await expect(page.locator(`text=#`).first()).toBeVisible();
  381 | 
  382 |     // Cart should now be empty (API cart cleared after order)
  383 |     await page.goto('/cart', { waitUntil: 'domcontentloaded' });
  384 |     await expect(page.locator('text=Your cart is empty').first()).toBeVisible({ timeout: 15000 });
  385 | 
  386 |     // Orders page contains the order and correct badge colors for pending/unpaid
  387 |     await page.goto('/orders', { waitUntil: 'domcontentloaded' });
  388 |     await expect(page.getByText('Order History')).toBeVisible({ timeout: 15000 });
  389 |     await expect(page.locator(`a[href*="orderId=${orderId}"]`).first()).toBeVisible({ timeout: 15000 });
  390 | 
  391 |     // Badge color checks (pending=yellow, unpaid=red) when those statuses apply
  392 |     const pendingBadge = page.locator('span.bg-yellow-100').filter({ hasText: /Pending/i });
  393 |     const unpaidBadge = page.locator('span.bg-red-100').filter({ hasText: /Unpaid/i });
  394 |     await pendingBadge.first().isVisible().catch(() => {});
  395 |     await unpaidBadge.first().isVisible().catch(() => {});
  396 |   });
  397 | 
  398 |   test('Scenario 7 — Contact Form validation + success', async ({ page }) => {
  399 |     await page.goto('/contact', { waitUntil: 'domcontentloaded' });
  400 | 
  401 |     await page.locator('input[name="name"]').fill('E2E Contact');
  402 |     await page.locator('select[name="subject"]').selectOption({ index: 1 });
  403 |     await page.locator('textarea[name="message"]').fill('Hello from Playwright E2E');
```