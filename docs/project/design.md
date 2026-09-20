# Pansari Inn — UI / UX Design Direction

## Component Library (no external UI kit)
- **No component library (MUI/Ant/Radix)** — all components are hand-built with Tailwind utility classes + custom CSS
- **Icons**: `react-icons` (optimized imports via `next.config.ts` → `optimizePackageImports: ['react-icons', 'react-toastify']`)
  - **Fa*** (Font Awesome): stars, tags, truck, lock, shopping cart, gift, heart, shield, WhatsApp
  - **Fi*** (Feather): search, filter, grid/list view, chevrons, sliders, refresh, check, close, clock
  - **Hi*** (Heroicons): shopping bag, tag outline
  - **Bs*** (Bootstrap): star
- **Toast system**: `react-toastify` v11, position=top-right, autoClose=3000 ms, light theme, z-index 999999
- **Phone input**: `react-phone-number-input` with `defaultCountry="PK"`

---

## Tailwind Tokens (globals.css + inline)

> Note: Project uses Tailwind v4 with `@import "tailwindcss"` and `@theme inline {}` (NOT a separate `tailwind.config` file in this repo — tailwind config file not found)

### Colors
| Token | Value | Usage | Source |
|-------|-------|-------|--------|
| `--background` | `#ffffff` | Page background | globals.css ✅ |
| `--foreground` | `#171717` | Default text | globals.css ✅ |
| Green (primary) | `#197B33` / `bg-green-700` / `text-green-700` | CTAs, accents, nav bar, primary button bg | Custom class `.me-bgcolor-g` / `.me-color-g` + Tailwind greens |
| Yellow / accent | `#FAA944` | Secondary badge, SolutionBar gradient overlay | `.me-bgcolor-y` / `.me-color-y` |
| Cream | `#fdf6f0` | SolutionBar / accent bg utility | `.bg-cream` |
| Sale badge | `bg-red-500` text-white | `-X% OFF` corner pill | ProductCard ✅ |
| Success | `text-green-600` / `bg-green-50`, `border-green-200` | In-stock, applied coupon, success state |
| Warning / stock-alert | `text-amber-700` / `bg-amber-50`, `border-amber-200` | Stock validation warnings |
| Error | `text-red-500` / `border-red-500` | Invalid form fields, inline errors |
| Neutral gray ramp | `gray-50 / 100 / 200 / 300 / 400 / 500 / 600 / 700 / 800 / 900` | Borders, placeholders, subtext, body text, headings |
| WhatsApp green | `#25D366` hover `#1DA851` | Order-confirmation WhatsApp CTA (inline `bg-[#25D366]`) |

### Fonts
| Role | Family | Source |
|------|--------|--------|
| Primary body + headings | **Poppins** (300, 400, 500, 600, 700) | `Poppins` via `next/font/google` in layout.tsx, `--font-poppins` CSS var + fallback `'Poppins', Arial, Helvetica, sans-serif` |
| Sans fallback | Geist Sans (CSS var `--font-geist-sans`) | Declared in theme inline but Poppins is the actual applied family in `body { font-family: 'Poppins', Arial, Helvetica, sans-serif }` |
| Mono fallback | Geist Mono (CSS var `--font-geist-mono`) | Declared but unused visually |

> **Dark mode explicitly disabled**: `@media (prefers-color-scheme: dark)` overrides `--background` back to white. No dark UI exists anywhere.

### Spacing
- App-level page gutters: `px-[4%]` (used on max-w-[1600px] / max-w-[1920px] wrappers)
- Section vertical padding: `py-6`, `py-10`
- Card padding: `p-4 sm:p-5`, `p-5`
- Feature-card padding inside lists: `px-3 py-2.5`

### Radius
- Primary CTA: `rounded-full` (pill-shaped buttons — navbar CTAs, Add to Cart, Proceed to Checkout, Place Order, Login, Register)
- Cards: `rounded-2xl` (ProductCard, hero cards) or `rounded-xl` (panels, order summary, form cards) or `rounded-lg` (inputs)
- Small badges/tooltips: `rounded-md`, `rounded-full`

### Shadows
- Cards: `shadow-sm` border `border-gray-100 border border-gray-200`
- Hovered product card: border `border-green-700` (shadow change subtle)
- Dropdown/filter panels: `shadow-lg` (city combobox, mobile filter drawer)
- No heavy `shadow-xl` used anywhere — intentionally soft elevation style

---

## Layout Patterns

### Max-Width Wrappers
- Shop/checkout/cart/orders: `max-w-[1600px] mx-auto px-[4%]`
- Footer/rewards/blog: `max-w-[1920px]` or `max-w-5xl` (order confirmation)
- Blog listing: 3-col grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5`
- Checkout / Cart: 2-col: `grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] 2xl:grid-cols-[1fr_440px]` with sticky right summary (`lg:sticky lg:top-6` or `lg:top-[144px]`)
- Footer: `grid-cols-1 md:grid-cols-[200px_1fr_260px] gap-8 lg:gap-16`

### Navbar
- Desktop navbar component: `components/Desktop/components/navbar.tsx` + wrapper `SearchBarWrapper.tsx`
- Mobile: `components/Mobile/components/header.tsx` + `MenuButton.tsx` + `IconSection.tsx` + `MenuModal.tsx` (slide-in)
- Desktop navbar height: **~144 px** (confirmed from checkout page sticky summary `lg:top-[144px]` which clears the header exactly; `app/checkout/page.tsx`)
  - Skeleton navbar also confirms fixed top-0 header pattern: `skeletolloading/navbar.tsx:L6`
- Z-index layering: toasts > modal > filter drawer > sticky header

### BottomNav (mobile only)
- Mobile BottomNav height: **56 px**
- Toast container repositioned to `bottom: 72 px` on screens ≤ 639 px to clear it (56 + 16 breathing)
- pb-24 on mobile cart page content wrapper

### Footer
- 4-section structure rendered as 3-column grid:
  - Col 1 (left): Logo + contact info (phone, email, address) + social icons row (`FooterIcons.tsx`)
  - Col 2 (center): 3 link columns — Quick Links / Shop / Customer Service (`LinkColumns.tsx`)
  - Col 3 (right): Newsletter signup with email input + Subscribe CTA
- Divider + copyright line

---

## Product Card
File: `components/Desktop/components/ProductCard.tsx` / Mobile variant in `components/Mobile/components/ProductCard.tsx`

- **Aspect/ratio**: Fixed height `h-44` image wrapper (ratio-independent) → internal `object-contain` on image with centered placement (left-1/4 w-1/2 absolute container)
- **Image swap on hover**: `isHovered` state — shows `hoverImg` if exists, falls back to primary
- **Top-left**: Wishlist heart (white bg-90 rounded, red filled if wishlisted, gray outline if not)
- **Top-right**: Sale badge `bg-red-500` rounded-full text-[11px] showing `product.sale` ("-X% OFF")
- **Click loading overlay**: Spinner overlay `bg-white/60` with 8 px border-spinner `border-green-700 border-t-transparent`; triggered on navigation click to prevent double-click navigation
- **Border**: 2 px border, default `gray-200` → green-700 on hover or loading-while-pending state
- **Price**: PKR XXXX formatted `toLocaleString()`, red strikethrough old price line if exists
- **Rating**: FaStar count + numeric score
- **Quick Add / hover actions**: Desktop card opens `ProductDetailsModal` (quick view) via "Quick Add" CTA on hover

---

## Quick-View Modal
Component: `components/Desktop/components/ProductDetailsModal.tsx`

- Pattern: **device-dependent animation**. Evidence: `ProductDetailsModal.tsx:L218-L223` (mobile) + L499 (desktop):
  - **Mobile**: bottom-sheet panel using `@keyframes slideUp` (translateY 100% → 0, 0.3 s ease-out) → rises from bottom of viewport
  - **Desktop**: centered overlay panel, no slide animation (direct mount, fadeIn backdrop only)
- Content: product image, variant selector, name, price, Add to Cart CTA
- **Known UX issue**: Add-to-cart toast reported **not showing instantly** when added from quick-view modal (works fine from main ProductDetails page) — investigate modal DOM / toast container z-index + CartContext update timing

---

## Toasts
- Config: position `top-right`, autoClose `3000 ms`, newestOnTop, closeOnClick, draggable, pauseOnHover, theme=light, `zIndex: 999999`
- Mobile override via globals.css media query (`≤ 639 px`): toast container relocates to bottom-center, `bottom: 72 px`, 100% width, padding 12 px left/right, individual toast `border-radius: 12 px`, 13 px font size
- Error toasts: show top-level message AND (for 422) inline field errors
- Success toasts: coupon applied, order placed, newsletter subscribed, item added, item removed

---

## Forms (pattern extracted from checkout + login + newsletter)
- **Input class pattern** (`inputCls`): `w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-600 transition bg-white`
- **Label class pattern** (`labelCls`): `block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide`
- **Error state**: `border-red-500 focus:border-red-500 focus:ring-red-500/20` + under-input `mt-1 text-xs text-red-500` message
- **Textarea**: same inputCls + `resize-none`
- **Primary buttons**: `bg-green-700 hover:bg-green-600 text-white py-3 rounded-full text-sm font-bold transition shadow-sm hover:shadow-md` + disabled:opacity-70 cursor-not-allowed (plus inline spinner)
- **Secondary buttons**: `border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full / rounded-lg`
- **Destructive**: link-style remove button with `text-gray-300 hover:text-red-500 hover:bg-red-50` (Trash icon)
- **Quantity stepper**: 8×8 px bordered box with `−` / number / `+` — decrement at qty 1 triggers remove

---

## Image Sizing Rules
### Next.js Image Config (`next.config.ts`)
- Formats: avif + webp
- `deviceSizes`: 640, 750, 828, 1080, 1200, 1920
- `imageSizes`: 16, 32, 48, 64, 96, 128, 256
- `minimumCacheTTL: 60 s`
- `dangerouslyAllowSVG: true`
- Content-Disposition attachment + strict CSP sandbox for images

### Usage patterns
- Product card: `sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 20vw"`
- Cart item thumbnail: `sizes="48px" / "72px"`
- Product detail hero image: TODO confirm explicit sizes string
- OG image default: `/images/Banner.png` 1200×630 declared in metadataBase OG

### Banner 812×317 Inconsistent Sizing Issue (Known)
- **Problem**: Home hero banner image expected aspect ratio 812:317 ≈ 2.56:1; observed stretched/cropped inconsistently across device widths
- **Known todo**: enforce consistent aspect ratio wrapper (`aspect-[812/317]` or `aspect-[256/100]`) with `object-cover` + CSS position adjustments
- Verify across: Desktop (1920+ / 1440 / 1280 / 1024), Tablet (768), Mobile (390)

---

## Tone of Copy
- **Headings**: Bold, short, benefit-first (e.g. "Premium Ayurvedic & Herbal Products", "100% Pure & Natural")
- **Body**: Warm, trust-focused ("100% Ayurvedic & Herbal Product", "Free Delivery On All Orders Above PKR 5000", "GST Included in Price")
- **Product infoLines** (shown on every PDP):
  1. "100% Ayurvedic & Herbal Product"
  2. "Free Delivery On All Orders Above PKR 5000"
  3. "GST Included in Price"
- **Success messages**: Short, warm toasts ("Order placed successfully!", "Coupon applied successfully!", "Successfully subscribed!")
- **Error messages**: Friendly, action-oriented, NEVER technical. E.g. "Request timed out. Please try again." / "Network error. Check your connection." / "Something went wrong. Please try again." / Per-field: "Please enter a valid Pakistani mobile number (e.g. 03XXXXXXXXX)"
- **Urdu names**: Displayed as muted gray subtitle (`nameUr`) below English product name when present and distinct from nameEn. Never double the same string in both fields.

---

## Animations / Motion
Defined in `globals.css`:
| Name | Details | Usage |
|------|---------|-------|
| `@keyframes slideInLeft` | translateX(−100%) → 0, 0.3 s ease, slideInLeft class | Mobile menu modal |
| `@keyframes fadeIn` | opacity 0→1, 0.2 s ease-out | Solution cards backdrop |
| `@keyframes marquee` | translateX(0) → −33.33%, 18 s linear infinite | Marquee text promo row |
| `@keyframes slideUp` | translateY(100%) → 0, 0.3 s ease-out | Modals / quick-view |
| `Tailwind animate-spin` | — | Loading spinners on cards / CTAs / stock validation overlay |
| `Tailwind animate-pulse` | — | All skeleton placeholder rows / columns |

---

## SEO Visual Assets
- OpenGraph default image: `/images/Banner.png` 1200×630 declared in RootLayout metadata
- Product OG image = product thumbnail 800×800 (declared in per-product metadata)
- Favicon: `/favicon.ico`; Apple touch: `/apple-touch-icon.png`

---

## Mobile Behavior
- **Dedicated Mobile components tree**: `components/Mobile/` (not responsive variants)
- **Bottom Nav** (`BottomNav.tsx`): 56 px fixed-height nav at bottom — mobile-specific
- **Mobile Menu**: slide-in-left animation modal
- **Mobile toasts**: Bottom alignment, 72 px bottom offset to clear bottom nav
- **Mobile free-shipping progress bar**: Shown at top of cart items scroll area
- **Mobile stock warning**: Prominent at top of cart items column (not only in summary), amber pill
- **Pages**: Home splits via `useDeviceDetection` hook; pages like cart/checkout render same component but use responsive utilities (2-col → 1-col, grids collapse)
- **Max-scale=5 viewport**: `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />` (allows pinch zoom for accessibility)
- **Preconnects**: DNS-prefetch + preload for Banner.png at top of `<head>`
