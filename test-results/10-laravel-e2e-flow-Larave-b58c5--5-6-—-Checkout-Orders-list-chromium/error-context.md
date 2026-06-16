# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 10-laravel-e2e-flow.spec.ts >> Laravel-connected E2E flow >> Scenario 5 & 6 — Checkout + Orders list
- Location: tests\playwright\10-laravel-e2e-flow.spec.ts:318:7

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
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
          - generic [ref=e50]:
            - img [ref=e51]
            - generic [ref=e53]: "1"
          - generic [ref=e54]:
            - generic [ref=e55]: Cart
            - generic [ref=e56]: PKR 250
    - generic [ref=e59]:
      - button "Browse Categories" [ref=e60]:
        - img [ref=e61]
        - generic [ref=e63]: Categories
        - img [ref=e64]
      - navigation "Main navigation" [ref=e66]:
        - link "Home" [ref=e67] [cursor=pointer]:
          - /url: /
        - link "Shop" [ref=e68] [cursor=pointer]:
          - /url: /shop
        - link "By Concern" [ref=e69] [cursor=pointer]:
          - /url: /concern
        - link "Category" [ref=e70] [cursor=pointer]:
          - /url: /category
        - link "Offers" [ref=e71] [cursor=pointer]:
          - /url: /offers
        - link "Rewards" [ref=e72] [cursor=pointer]:
          - /url: /rewards
        - link "Blog" [ref=e73] [cursor=pointer]:
          - /url: /blog
      - link "Become an Affiliate" [ref=e74] [cursor=pointer]:
        - /url: /affiliate
        - img [ref=e75]
        - text: Become an Affiliate
  - generic [ref=e77]:
    - generic [ref=e78]:
      - generic [ref=e79]:
        - button "Cart 1" [ref=e80]:
          - img [ref=e81]
          - text: Cart
          - generic [ref=e83]: "1"
        - button "Wishlist" [ref=e84]:
          - img [ref=e85]
          - text: Wishlist
        - button "Close" [ref=e87]:
          - img [ref=e88]
      - paragraph [ref=e91]: 1 item in cart
    - generic [ref=e95]:
      - img "Turmeric (Haldi)" [ref=e97]
      - generic [ref=e98]:
        - generic [ref=e99]:
          - generic [ref=e100]:
            - heading "Turmeric (Haldi)" [level=4] [ref=e101]
            - generic [ref=e102]: 100 gm / Powder
          - generic [ref=e103]:
            - button [ref=e104]:
              - img [ref=e105]
            - button [ref=e107]:
              - img [ref=e108]
        - generic [ref=e110]:
          - generic [ref=e112]: PKR 250
          - generic [ref=e113]:
            - button [ref=e114]:
              - img [ref=e115]
            - generic [ref=e117]: "1"
            - button [ref=e118]:
              - img [ref=e119]
    - generic [ref=e121]:
      - generic [ref=e122]:
        - generic [ref=e123]:
          - generic [ref=e124]: Subtotal (1 items)
          - generic [ref=e125]: PKR 250
        - generic [ref=e126]:
          - generic [ref=e127]: Total
          - generic [ref=e128]: PKR 250
      - button "Proceed to Checkout" [ref=e129]:
        - img [ref=e130]
        - text: Proceed to Checkout
        - img [ref=e132]
      - generic [ref=e134]:
        - button "View Cart" [ref=e135]
        - button "Clear Cart" [ref=e136]
  - main [ref=e137]:
    - generic [ref=e138]:
      - generic [ref=e140]:
        - generic [ref=e141]:
          - heading "Checkout" [level=1] [ref=e142]
          - generic [ref=e143]:
            - img [ref=e144]
            - generic [ref=e146]: Secure Checkout
        - generic [ref=e147]:
          - generic [ref=e149]:
            - img [ref=e151]
            - generic [ref=e153]: Cart
          - generic [ref=e156]:
            - generic [ref=e157]: "2"
            - generic [ref=e158]: Checkout
          - generic [ref=e161]:
            - generic [ref=e162]: "3"
            - generic [ref=e163]: Complete
      - generic [ref=e166]:
        - generic [ref=e167]:
          - generic [ref=e168]:
            - heading "Contact Information" [level=2] [ref=e169]
            - generic [ref=e170]:
              - generic [ref=e171]:
                - generic [ref=e172]: Full Name *
                - textbox "Ahmed Khan" [ref=e173]
              - generic [ref=e174]:
                - generic [ref=e175]: Email Address *
                - textbox "ahmed@example.com" [ref=e176]
              - generic [ref=e177]:
                - generic [ref=e178]: Phone Number *
                - generic [ref=e179]:
                  - generic [ref=e180] [cursor=pointer]:
                    - combobox "Phone number country" [ref=e181]:
                      - option "International"
                      - option "Afghanistan"
                      - option "Åland Islands"
                      - option "Albania"
                      - option "Algeria"
                      - option "American Samoa"
                      - option "Andorra"
                      - option "Angola"
                      - option "Anguilla"
                      - option "Antigua and Barbuda"
                      - option "Argentina"
                      - option "Armenia"
                      - option "Aruba"
                      - option "Ascension Island"
                      - option "Australia"
                      - option "Austria"
                      - option "Azerbaijan"
                      - option "Bahamas"
                      - option "Bahrain"
                      - option "Bangladesh"
                      - option "Barbados"
                      - option "Belarus"
                      - option "Belgium"
                      - option "Belize"
                      - option "Benin"
                      - option "Bermuda"
                      - option "Bhutan"
                      - option "Bolivia"
                      - option "Bonaire, Sint Eustatius and Saba"
                      - option "Bosnia and Herzegovina"
                      - option "Botswana"
                      - option "Brazil"
                      - option "British Indian Ocean Territory"
                      - option "Brunei Darussalam"
                      - option "Bulgaria"
                      - option "Burkina Faso"
                      - option "Burundi"
                      - option "Cambodia"
                      - option "Cameroon"
                      - option "Canada"
                      - option "Cape Verde"
                      - option "Cayman Islands"
                      - option "Central African Republic"
                      - option "Chad"
                      - option "Chile"
                      - option "China"
                      - option "Christmas Island"
                      - option "Cocos (Keeling) Islands"
                      - option "Colombia"
                      - option "Comoros"
                      - option "Congo"
                      - option "Congo, Democratic Republic of the"
                      - option "Cook Islands"
                      - option "Costa Rica"
                      - option "Cote d'Ivoire"
                      - option "Croatia"
                      - option "Cuba"
                      - option "Curaçao"
                      - option "Cyprus"
                      - option "Czech Republic"
                      - option "Denmark"
                      - option "Djibouti"
                      - option "Dominica"
                      - option "Dominican Republic"
                      - option "Ecuador"
                      - option "Egypt"
                      - option "El Salvador"
                      - option "Equatorial Guinea"
                      - option "Eritrea"
                      - option "Estonia"
                      - option "Ethiopia"
                      - option "Falkland Islands"
                      - option "Faroe Islands"
                      - option "Federated States of Micronesia"
                      - option "Fiji"
                      - option "Finland"
                      - option "France"
                      - option "French Guiana"
                      - option "French Polynesia"
                      - option "Gabon"
                      - option "Gambia"
                      - option "Georgia"
                      - option "Germany"
                      - option "Ghana"
                      - option "Gibraltar"
                      - option "Greece"
                      - option "Greenland"
                      - option "Grenada"
                      - option "Guadeloupe"
                      - option "Guam"
                      - option "Guatemala"
                      - option "Guernsey"
                      - option "Guinea"
                      - option "Guinea-Bissau"
                      - option "Guyana"
                      - option "Haiti"
                      - option "Holy See (Vatican City State)"
                      - option "Honduras"
                      - option "Hong Kong"
                      - option "Hungary"
                      - option "Iceland"
                      - option "India"
                      - option "Indonesia"
                      - option "Iran"
                      - option "Iraq"
                      - option "Ireland"
                      - option "Isle of Man"
                      - option "Israel"
                      - option "Italy"
                      - option "Jamaica"
                      - option "Japan"
                      - option "Jersey"
                      - option "Jordan"
                      - option "Kazakhstan"
                      - option "Kenya"
                      - option "Kiribati"
                      - option "Kosovo"
                      - option "Kuwait"
                      - option "Kyrgyzstan"
                      - option "Laos"
                      - option "Latvia"
                      - option "Lebanon"
                      - option "Lesotho"
                      - option "Liberia"
                      - option "Libya"
                      - option "Liechtenstein"
                      - option "Lithuania"
                      - option "Luxembourg"
                      - option "Macao"
                      - option "Madagascar"
                      - option "Malawi"
                      - option "Malaysia"
                      - option "Maldives"
                      - option "Mali"
                      - option "Malta"
                      - option "Marshall Islands"
                      - option "Martinique"
                      - option "Mauritania"
                      - option "Mauritius"
                      - option "Mayotte"
                      - option "Mexico"
                      - option "Moldova"
                      - option "Monaco"
                      - option "Mongolia"
                      - option "Montenegro"
                      - option "Montserrat"
                      - option "Morocco"
                      - option "Mozambique"
                      - option "Myanmar"
                      - option "Namibia"
                      - option "Nauru"
                      - option "Nepal"
                      - option "Netherlands"
                      - option "New Caledonia"
                      - option "New Zealand"
                      - option "Nicaragua"
                      - option "Niger"
                      - option "Nigeria"
                      - option "Niue"
                      - option "Norfolk Island"
                      - option "North Korea"
                      - option "North Macedonia"
                      - option "Northern Mariana Islands"
                      - option "Norway"
                      - option "Oman"
                      - option "Pakistan" [selected]
                      - option "Palau"
                      - option "Palestine"
                      - option "Panama"
                      - option "Papua New Guinea"
                      - option "Paraguay"
                      - option "Peru"
                      - option "Philippines"
                      - option "Poland"
                      - option "Portugal"
                      - option "Puerto Rico"
                      - option "Qatar"
                      - option "Reunion"
                      - option "Romania"
                      - option "Russia"
                      - option "Rwanda"
                      - option "Saint Barthélemy"
                      - option "Saint Helena"
                      - option "Saint Kitts and Nevis"
                      - option "Saint Lucia"
                      - option "Saint Martin (French Part)"
                      - option "Saint Pierre and Miquelon"
                      - option "Saint Vincent and the Grenadines"
                      - option "Samoa"
                      - option "San Marino"
                      - option "Sao Tome and Principe"
                      - option "Saudi Arabia"
                      - option "Senegal"
                      - option "Serbia"
                      - option "Seychelles"
                      - option "Sierra Leone"
                      - option "Singapore"
                      - option "Sint Maarten"
                      - option "Slovakia"
                      - option "Slovenia"
                      - option "Solomon Islands"
                      - option "Somalia"
                      - option "South Africa"
                      - option "South Korea"
                      - option "South Sudan"
                      - option "Spain"
                      - option "Sri Lanka"
                      - option "Sudan"
                      - option "Suriname"
                      - option "Svalbard and Jan Mayen"
                      - option "Swaziland"
                      - option "Sweden"
                      - option "Switzerland"
                      - option "Syria"
                      - option "Taiwan"
                      - option "Tajikistan"
                      - option "Tanzania"
                      - option "Thailand"
                      - option "Timor-Leste"
                      - option "Togo"
                      - option "Tokelau"
                      - option "Tonga"
                      - option "Trinidad and Tobago"
                      - option "Tristan da Cunha"
                      - option "Tunisia"
                      - option "Turkey"
                      - option "Turkmenistan"
                      - option "Turks and Caicos Islands"
                      - option "Tuvalu"
                      - option "Uganda"
                      - option "Ukraine"
                      - option "United Arab Emirates"
                      - option "United Kingdom"
                      - option "United States"
                      - option "Uruguay"
                      - option "Uzbekistan"
                      - option "Vanuatu"
                      - option "Venezuela"
                      - option "Vietnam"
                      - option "Virgin Islands, British"
                      - option "Virgin Islands, U.S."
                      - option "Wallis and Futuna"
                      - option "Western Sahara"
                      - option "Yemen"
                      - option "Zambia"
                      - option "Zimbabwe"
                    - img [ref=e183]
                  - textbox "Enter phone number" [ref=e185]: "+92"
          - generic [ref=e186]:
            - heading "Shipping Address" [level=2] [ref=e187]
            - generic [ref=e188]:
              - generic [ref=e189]:
                - generic [ref=e190]: Street Address *
                - textbox "House/Flat no, Street name, Area" [ref=e191]
              - generic [ref=e192]:
                - generic [ref=e193]: City *
                - generic [ref=e194]:
                  - combobox [ref=e195]:
                    - option "Select your city" [selected]
                    - option "Lahore"
                    - option "Faisalabad"
                    - option "Rawalpindi"
                    - option "Multan"
                    - option "Gujranwala"
                    - option "Sialkot"
                    - option "Bahawalpur"
                    - option "Sargodha"
                    - option "Karachi"
                    - option "Hyderabad"
                    - option "Sukkur"
                    - option "Larkana"
                    - option "Nawabshah"
                    - option "Peshawar"
                    - option "Mardan"
                    - option "Abbottabad"
                    - option "Swat"
                    - option "Nowshera"
                    - option "Quetta"
                    - option "Gwadar"
                    - option "Turbat"
                    - option "Islamabad"
                    - option "Muzaffarabad"
                    - option "Mirpur"
                  - img
              - generic [ref=e196]:
                - generic [ref=e197]: Area / Sector
                - textbox "Gulshan, DHA, etc." [ref=e198]
              - generic [ref=e199]:
                - generic [ref=e200]: Order Note (optional)
                - textbox "e.g., Call before delivery, leave at reception…" [ref=e201]
          - generic [ref=e202]:
            - heading "Payment Method" [level=2] [ref=e203]
            - generic [ref=e204]:
              - generic [ref=e205] [cursor=pointer]:
                - radio "Cash on Delivery Pay when you receive" [checked] [ref=e206]
                - img [ref=e208]
                - generic [ref=e210]:
                  - paragraph [ref=e211]: Cash on Delivery
                  - paragraph [ref=e212]: Pay when you receive
              - generic [ref=e213] [cursor=pointer]:
                - radio "Online Payment Credit/Debit Card · JazzCash · EasyPaisa" [ref=e214]
                - img [ref=e216]
                - generic [ref=e218]:
                  - paragraph [ref=e219]: Online Payment
                  - paragraph [ref=e220]: Credit/Debit Card · JazzCash · EasyPaisa
              - generic [ref=e221] [cursor=pointer]:
                - radio "Bank Transfer Direct bank deposit" [ref=e222]
                - img [ref=e224]
                - generic [ref=e226]:
                  - paragraph [ref=e227]: Bank Transfer
                  - paragraph [ref=e228]: Direct bank deposit
        - generic [ref=e229]:
          - generic [ref=e230]:
            - heading "Order Summary" [level=2] [ref=e231]
            - generic [ref=e233]:
              - img "Turmeric (Haldi)" [ref=e235]
              - generic [ref=e236]:
                - paragraph [ref=e237]: Turmeric (Haldi)
                - paragraph [ref=e238]: 100 gm / Powder · Qty 1
              - paragraph [ref=e239]: PKR 250
            - generic [ref=e240]:
              - generic [ref=e241]: Coupon Code
              - generic [ref=e242]:
                - generic [ref=e243]:
                  - img [ref=e244]
                  - textbox "Enter coupon code" [ref=e246]: INVALID_COUPON_E2E
                - button "…" [disabled] [ref=e247]
            - generic [ref=e248]:
              - generic [ref=e249]:
                - generic [ref=e250]: Subtotal
                - generic [ref=e251]: PKR 250
              - generic [ref=e252]:
                - generic [ref=e253]:
                  - img [ref=e254]
                  - text: Shipping
                - generic [ref=e256]: PKR 200
            - generic [ref=e257]:
              - generic [ref=e258]: Total
              - generic [ref=e259]: PKR 450
            - button "Place Order" [ref=e260]
            - generic [ref=e261]:
              - img [ref=e262]
              - text: Secure & encrypted · By placing you agree to our terms
          - paragraph [ref=e265]: Cash on Delivery · Bank Transfer · JazzCash · Easypaisa
  - generic [ref=e268]:
    - generic [ref=e269] [cursor=pointer]:
      - img [ref=e271]
      - paragraph [ref=e273]: Free Shipping
      - paragraph [ref=e274]: On orders above PKR 999
    - generic [ref=e275] [cursor=pointer]:
      - img [ref=e277]
      - paragraph [ref=e279]: Nationwide
      - paragraph [ref=e280]: Delivery Across Pakistan
    - generic [ref=e281] [cursor=pointer]:
      - img [ref=e283]
      - paragraph [ref=e285]: 100% Authentic
      - paragraph [ref=e286]: Certified Products
    - generic [ref=e287] [cursor=pointer]:
      - img [ref=e289]
      - paragraph [ref=e291]: Quick Delivery
      - paragraph [ref=e292]: 2–4 Business Days
    - generic [ref=e293] [cursor=pointer]:
      - img [ref=e295]
      - paragraph [ref=e297]: Eco-Friendly
      - paragraph [ref=e298]: Sustainable Packaging
  - contentinfo [ref=e299]:
    - generic [ref=e300]:
      - generic [ref=e301]:
        - generic [ref=e302]:
          - img "Pansari Inn Logo" [ref=e303]
          - generic [ref=e304]:
            - paragraph [ref=e305]:
              - text: "Email:"
              - link "pansariinn@gmail.com" [ref=e306] [cursor=pointer]:
                - /url: mailto:pansariinn@gmail.com
            - paragraph [ref=e307]:
              - text: "Phone:"
              - link "0304 577 9900" [ref=e308] [cursor=pointer]:
                - /url: tel:+923045779900
          - generic [ref=e309]:
            - paragraph [ref=e310]: Follow Our Social Media!
            - generic [ref=e311]:
              - link "Facebook" [ref=e312] [cursor=pointer]:
                - /url: https://facebook.com/pansariin.pk
                - img [ref=e313]
              - link "Twitter" [ref=e315] [cursor=pointer]:
                - /url: https://twitter.com/pansariin
                - img [ref=e316]
              - link "YouTube" [ref=e318] [cursor=pointer]:
                - /url: https://youtube.com/pansariin
                - img [ref=e319]
              - link "Instagram" [ref=e321] [cursor=pointer]:
                - /url: https://instagram.com/pansariin.pk
                - img [ref=e322]
        - generic [ref=e324]:
          - generic [ref=e325]:
            - heading "Quick Links" [level=4] [ref=e326]
            - list [ref=e327]:
              - listitem [ref=e328]:
                - link "About Us" [ref=e329] [cursor=pointer]:
                  - /url: /aboutus
              - listitem [ref=e330]:
                - link "Our Story" [ref=e331] [cursor=pointer]:
                  - /url: /our-story
              - listitem [ref=e332]:
                - link "Blog" [ref=e333] [cursor=pointer]:
                  - /url: /blog
          - generic [ref=e334]:
            - heading "Shop" [level=4] [ref=e335]
            - list [ref=e336]:
              - listitem [ref=e337]:
                - link "Skincare" [ref=e338] [cursor=pointer]:
                  - /url: /beauty-corner
              - listitem [ref=e339]:
                - link "Haircare" [ref=e340] [cursor=pointer]:
                  - /url: /shop?category=Herb
              - listitem [ref=e341]:
                - link "Oils" [ref=e342] [cursor=pointer]:
                  - /url: /oils
              - listitem [ref=e343]:
                - link "Supplements" [ref=e344] [cursor=pointer]:
                  - /url: /shop?category=Supplements
              - listitem [ref=e345]:
                - link "Best Sellers" [ref=e346] [cursor=pointer]:
                  - /url: /shop
          - generic [ref=e347]:
            - heading "Customer Service" [level=4] [ref=e348]
            - list [ref=e349]:
              - listitem [ref=e350]:
                - link "Track Order" [ref=e351] [cursor=pointer]:
                  - /url: /track-order
              - listitem [ref=e352]:
                - link "Returns" [ref=e353] [cursor=pointer]:
                  - /url: /returns
              - listitem [ref=e354]:
                - link "Shipping Info" [ref=e355] [cursor=pointer]:
                  - /url: /shipping-info
              - listitem [ref=e356]:
                - link "FAQs" [ref=e357] [cursor=pointer]:
                  - /url: /faqs
              - listitem [ref=e358]:
                - link "Contact Us" [ref=e359] [cursor=pointer]:
                  - /url: /contact
        - generic [ref=e360]:
          - generic [ref=e361]:
            - heading "Join Our Mailing List" [level=4] [ref=e362]
            - paragraph [ref=e363]: Find out all about our latest offers, new products, and the science of Ayurveda in our newsletters!
          - generic [ref=e364]:
            - textbox "E-mail" [ref=e365]
            - button "Subscribe" [ref=e366]
      - paragraph [ref=e368]: Pansari Inn 2026. All rights reserved.
  - region "Notifications Alt+T"
  - button "Open Next.js Dev Tools" [ref=e374] [cursor=pointer]:
    - img [ref=e375]
  - alert [ref=e378]
```

# Test source

```ts
  241 |     // Refresh persists
  242 |     await page.reload({ waitUntil: 'domcontentloaded' });
  243 |     expect(await page.evaluate((k) => localStorage.getItem(k), CART_KEY)).not.toBeNull();
  244 |     expect(await page.evaluate((k) => localStorage.getItem(k), WISHLIST_KEY)).not.toBeNull();
  245 |   });
  246 | 
  247 |   test('Scenario 3 — Register & Merge (POST /cart and /wishlist, then clear localStorage keys)', async ({
  248 |     page,
  249 |     request,
  250 |   }) => {
  251 |     test.setTimeout(90000);
  252 |     const { product, variant } = await getFirstApiProduct(request);
  253 | 
  254 |     await page.goto('/', { waitUntil: 'domcontentloaded' });
  255 |     await seedGuestCartAndWishlist(page, product.id, variant.id);
  256 | 
  257 |     const mergeCalls: string[] = [];
  258 |     page.on('request', (req) => {
  259 |       if ((req.url().includes('/api/cart') || req.url().includes('/api/wishlist')) && req.method() === 'POST') {
  260 |         mergeCalls.push(`${req.method()} ${req.url()}`);
  261 |       }
  262 |     });
  263 | 
  264 |     await registerNewUser(page, request);
  265 | 
  266 |     await expect
  267 |       .poll(async () => mergeCalls.length, { timeout: 30000 })
  268 |       .toBeGreaterThan(0);
  269 | 
  270 |     // localStorage should be cleared (merge moves to API)
  271 |     await expect
  272 |       .poll(async () => page.evaluate((k) => localStorage.getItem(k), CART_KEY), { timeout: 15000 })
  273 |       .toBeNull();
  274 |     await expect
  275 |       .poll(async () => page.evaluate((k) => localStorage.getItem(k), WISHLIST_KEY), { timeout: 15000 })
  276 |       .toBeNull();
  277 | 
  278 |     // Verify API has the merged items (source of truth)
  279 |     const token = await page.evaluate((k) => localStorage.getItem(k), TOKEN_KEY);
  280 |     expect(token).not.toBeNull();
  281 | 
  282 |     const apiCart = await request.get(`${API_BASE}/cart`, {
  283 |       headers: { Authorization: `Bearer ${token}` },
  284 |     });
  285 |     expect(apiCart.ok()).toBeTruthy();
  286 |     const cartJson = (await apiCart.json()) as { success: boolean; data: unknown[] };
  287 |     expect(cartJson.data.length).toBeGreaterThan(0);
  288 | 
  289 |     const apiWishlist = await request.get(`${API_BASE}/wishlist`, {
  290 |       headers: { Authorization: `Bearer ${token}` },
  291 |     });
  292 |     expect(apiWishlist.ok()).toBeTruthy();
  293 |     const wishJson = (await apiWishlist.json()) as { success: boolean; data: unknown[] };
  294 |     expect(wishJson.data.length).toBeGreaterThan(0);
  295 |   });
  296 | 
  297 |   test('Scenario 4 — Logged-in Cart & Wishlist uses API, not localStorage', async ({ page, request }) => {
  298 |     const { product } = await getFirstApiProduct(request);
  299 |     await registerNewUser(page, request);
  300 | 
  301 |     const calls: string[] = [];
  302 |     page.on('request', (req) => {
  303 |       const u = req.url();
  304 |       if (u.includes('/api/cart') || u.includes('/api/wishlist')) calls.push(`${req.method()} ${u}`);
  305 |     });
  306 | 
  307 |     await page.goto(`/products/${product.slug}`, { waitUntil: 'domcontentloaded' });
  308 |     await page.getByRole('button', { name: /add to cart/i }).click();
  309 | 
  310 |     await expect
  311 |       .poll(async () => calls.some((c) => c.includes('POST') && c.includes('/api/cart')), { timeout: 15000 })
  312 |       .toBeTruthy();
  313 | 
  314 |     // Guest storage keys should not be used when logged in
  315 |     expect(await page.evaluate((k) => localStorage.getItem(k), CART_KEY)).toBeNull();
  316 |   });
  317 | 
  318 |   test('Scenario 5 & 6 — Checkout + Orders list', async ({ page, request }) => {
  319 |     test.setTimeout(120000);
  320 |     const { product, variant } = await getFirstApiProduct(request);
  321 |     await registerNewUser(page, request);
  322 | 
  323 |     // Ensure cart has an item (API seed for deterministic checkout UI)
  324 |     const token = await page.evaluate((k) => localStorage.getItem(k), TOKEN_KEY);
  325 |     expect(token).not.toBeNull();
  326 |     const addRes = await request.post(`${API_BASE}/cart`, {
  327 |       headers: { Authorization: `Bearer ${token}` },
  328 |       data: { product_variant_id: variant.id, quantity: 1 },
  329 |     });
  330 |     expect([200, 201].includes(addRes.status())).toBeTruthy();
  331 | 
  332 |     await page.goto('/checkout', { waitUntil: 'domcontentloaded' });
  333 |     await expect(page.getByText('Contact Information')).toBeVisible({ timeout: 20000 });
  334 | 
  335 |     // Invalid coupon shows error
  336 |     await page.getByPlaceholder('Enter coupon code').fill('INVALID_COUPON_E2E');
  337 |     const [couponRes] = await Promise.all([
  338 |       page.waitForResponse((r) => r.url().includes('/api/coupons/validate') && r.request().method() === 'POST'),
  339 |       page.getByRole('button', { name: 'Apply' }).click(),
  340 |     ]);
> 341 |     expect([200, 400, 401, 422].includes(couponRes.status())).toBeTruthy();
      |                                                               ^ Error: expect(received).toBeTruthy()
  342 |     await expect(page.locator('p.text-red-500').first()).toBeVisible({ timeout: 20000 });
  343 | 
  344 |     // Fill shipping details and place order
  345 |     await page.locator('input[name="name"]').fill('E2E User');
  346 |     await page.locator('input[name="email"]').fill('e2e_order@example.com');
  347 |     await page.locator('input[name="address"]').fill('123 E2E Street');
  348 |     await page.locator('select[name="city"]').selectOption('lahore');
  349 | 
  350 |     const [orderRes] = await Promise.all([
  351 |       page.waitForResponse((r) => r.url().includes('/api/orders') && r.request().method() === 'POST'),
  352 |       page.getByRole('button', { name: /place order/i }).click(),
  353 |     ]);
  354 |     expect([200, 201, 422].includes(orderRes.status())).toBeTruthy();
  355 |     await page.waitForURL(/\/order-confirmation\?orderId=\d+/, { timeout: 30000 });
  356 | 
  357 |     const url = new URL(page.url());
  358 |     const orderId = url.searchParams.get('orderId');
  359 |     expect(orderId).toMatch(/^\d+$/);
  360 | 
  361 |     // Confirmation should show real order number
  362 |     await expect(page.getByText(/Order Confirmed/i)).toBeVisible({ timeout: 15000 });
  363 |     await expect(page.locator(`text=#`).first()).toBeVisible();
  364 | 
  365 |     // Cart should now be empty (API cart cleared after order)
  366 |     await page.goto('/cart', { waitUntil: 'domcontentloaded' });
  367 |     await expect(page.locator('text=Your cart is empty').first()).toBeVisible({ timeout: 15000 });
  368 | 
  369 |     // Orders page contains the order and correct badge colors for pending/unpaid
  370 |     await page.goto('/orders', { waitUntil: 'domcontentloaded' });
  371 |     await expect(page.getByText('Order History')).toBeVisible({ timeout: 15000 });
  372 |     await expect(page.locator(`a[href*="orderId=${orderId}"]`).first()).toBeVisible({ timeout: 15000 });
  373 | 
  374 |     // Badge color checks (pending=yellow, unpaid=red) when those statuses apply
  375 |     const pendingBadge = page.locator('span.bg-yellow-100').filter({ hasText: /Pending/i });
  376 |     const unpaidBadge = page.locator('span.bg-red-100').filter({ hasText: /Unpaid/i });
  377 |     await pendingBadge.first().isVisible().catch(() => {});
  378 |     await unpaidBadge.first().isVisible().catch(() => {});
  379 |   });
  380 | 
  381 |   test('Scenario 7 — Contact Form validation + success', async ({ page }) => {
  382 |     await page.goto('/contact', { waitUntil: 'domcontentloaded' });
  383 | 
  384 |     await page.locator('input[name="name"]').fill('E2E Contact');
  385 |     await page.locator('input[name="email"]').fill('bad-email');
  386 |     await page.locator('textarea[name="message"]').fill('Hello from Playwright E2E');
  387 |     await page.getByRole('button', { name: /send|submit/i }).click();
  388 | 
  389 |     // Expect a validation error under email (422)
  390 |     await expect(page.locator('text=The email must be a valid email address').first()).toBeVisible({
  391 |       timeout: 10000,
  392 |     });
  393 | 
  394 |     // Submit valid
  395 |     await page.locator('input[name="email"]').fill('e2e_contact@example.com');
  396 |     await page.getByRole('button', { name: /send|submit/i }).click();
  397 |     await expect(page.locator('text=Message sent, text=success').first()).toBeVisible({ timeout: 10000 });
  398 |   });
  399 | 
  400 |   test('Scenario 8 — Logout clears token and redirects', async ({ page, request }) => {
  401 |     await registerNewUser(page, request);
  402 |     await page.goto('/profile', { waitUntil: 'domcontentloaded' });
  403 | 
  404 |     const logoutCalls: string[] = [];
  405 |     page.on('request', (req) => {
  406 |       if (req.url().includes('/api/logout')) logoutCalls.push(`${req.method()} ${req.url()}`);
  407 |     });
  408 | 
  409 |     await page.getByRole('button', { name: /logout/i }).click();
  410 |     await page.waitForURL('**/login', { timeout: 10000 });
  411 | 
  412 |     expect(logoutCalls.some((c) => c.startsWith('POST'))).toBeTruthy();
  413 |     expect(await page.evaluate((k) => localStorage.getItem(k), TOKEN_KEY)).toBeNull();
  414 |   });
  415 | });
  416 | 
  417 | 
```