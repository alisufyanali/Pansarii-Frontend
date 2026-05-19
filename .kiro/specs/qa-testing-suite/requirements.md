# Requirements Document

## Introduction

This document defines the requirements for a QA Testing Suite for the Pansari Inn e-commerce website — a Next.js-based storefront selling Ayurvedic and herbal products. The suite covers manual and automated test scenarios across six areas: page load and navigation, core functionality (cart, checkout, authentication, search/filter), responsiveness and UI, performance and error monitoring, edge cases, and reporting. The deliverable is a structured test execution process that produces an Issue Summary Table and Overall Feedback report.

## Glossary

- **QA_Suite**: The complete quality assurance testing suite described in this document.
- **Tester**: The person or automated agent executing the test cases.
- **SUT** (System Under Test): The Pansari Inn Next.js e-commerce website.
- **Issue_Summary_Table**: A structured table with columns: Page/Feature, Issue Description, Severity, Steps to Reproduce.
- **Overall_Feedback_Report**: A written summary covering Performance issues, UI/UX problems, and Functional bugs found during testing.
- **Severity**: A classification of bug impact — Critical, High, Medium, or Low.
- **Critical**: A defect that blocks a core user flow (e.g., checkout cannot be completed).
- **High**: A defect that significantly degrades user experience but has a workaround.
- **Medium**: A defect that causes minor functional or visual issues.
- **Low**: A cosmetic or trivial issue with no functional impact.
- **Page_Load_Time**: The elapsed time from navigation start until the page is fully interactive, measured in milliseconds.
- **Viewport**: The visible area of the browser window used to simulate a device screen size.
- **Cart_Context**: The React context (`CartContext`) managing cart state across the application.
- **Guest_User**: A user who proceeds through checkout without logging in.
- **Authenticated_User**: A user who has successfully logged in via `/login`.
- **Promo_Code**: A discount code validated via the `/api/validate-promo` endpoint.
- **Slug**: A URL-safe string identifying a product page, e.g., `/[slug]`.

---

## Requirements

### Requirement 1: Page Load and Navigation Testing

**User Story:** As a Tester, I want to verify that all main pages load without errors and all navigation links and buttons work correctly, so that users can browse the site without encountering broken pages or dead links.

#### Acceptance Criteria

1. WHEN the Tester navigates to any route on the SUT, THE SUT SHALL render the page without any JavaScript runtime errors in the browser console, including errors originating from third-party scripts.
2. WHEN the Tester navigates to each main page, THE SUT SHALL display the page content within 3000 milliseconds on a standard broadband connection.
3. WHEN the Tester clicks any internal navigation link (header, footer, breadcrumb, or CTA button), THE SUT SHALL route to the correct destination page without a 404 or error boundary being triggered.
4. WHEN the Tester navigates to a non-existent route, THE SUT SHALL render the custom `not-found.tsx` page with a user-friendly message and a link back to the home page.
5. WHEN the Tester navigates to `/cart` or `/checkout` while the page is loading, THE SUT SHALL display the loading skeleton defined in `loading.tsx` before the full content is rendered, and SHALL hide the loading skeleton once the full content finishes rendering so that the skeleton and content are never displayed simultaneously.
6. WHEN the Tester navigates to `/[slug]` with a valid product slug, THE SUT SHALL render the product detail page with the correct product name, price, images, and add-to-cart controls.
7. IF the Tester navigates to `/[slug]` with an invalid or unknown slug, THEN THE SUT SHALL invoke `notFound()` and render the 404 page.

---

### Requirement 2: Cart Functionality Testing

**User Story:** As a Tester, I want to verify that the shopping cart correctly handles adding, updating, and removing products, so that users can manage their cart without data loss or incorrect totals.

#### Acceptance Criteria

1. WHEN the Tester adds a product to the cart from a product detail page, THE Cart_Context SHALL add the item and increment the cart item count displayed in the header.
2. WHEN the Tester increases the quantity of a cart item using the `+` button on `/cart`, THE Cart_Context SHALL update the item quantity and recalculate the subtotal and total displayed on the page.
3. WHEN the Tester decreases the quantity of a cart item to 1 and then clicks `−`, THE Cart_Context SHALL remove the item from the cart entirely.
4. WHEN the Tester clicks the trash icon for a cart item, THE Cart_Context SHALL remove that item from the cart and update the displayed item count and totals.
5. WHEN the cart subtotal is below PKR 5,000, THE SUT SHALL display a free-shipping progress bar showing the remaining amount needed and a shipping fee of PKR 200 in the order summary.
6. WHEN the cart subtotal reaches or exceeds PKR 5,000, THE SUT SHALL display a "free shipping unlocked" banner and show PKR 0 shipping in the order summary.
7. WHEN the cart is empty, THE SUT SHALL display the empty-cart state with a "Browse Products" link pointing to `/shop`, regardless of the item count shown in the header.
8. THE Cart_Context SHALL preserve cart state across page navigations within the same browser session.

---

### Requirement 3: Checkout Flow Testing

**User Story:** As a Tester, I want to verify that the checkout process works correctly for both guest and authenticated users, so that orders can be placed successfully with accurate order data.

#### Acceptance Criteria

1. WHEN the Tester navigates to `/checkout` with items in the cart, THE SUT SHALL display the checkout form with Contact Information, Shipping Address, and Payment Method sections.
2. WHEN the Tester submits the checkout form with all required fields filled (name, email, phone, street address, city) and a valid payment method selected, THE SUT SHALL generate a unique order ID, store the order in `localStorage`, clear the cart, and redirect to `/order-confirmation?orderId={orderId}`.
3. WHEN the Tester submits the checkout form with any required field left empty, THE SUT SHALL prevent form submission and display a validation error for each missing required field.
4. WHEN the Tester enters a valid promo code in the promo code field and clicks Apply, THE SUT SHALL call `/api/validate-promo`, apply the returned discount to the order total, and display a success message.
5. WHEN the Tester enters an invalid promo code and clicks Apply, THE SUT SHALL display the error message returned by `/api/validate-promo` and leave the order total unchanged.
6. WHEN the Tester selects the "Cash on Delivery" payment method, THE SUT SHALL record `paymentMethod` as "Cash on Delivery" in the stored order data.
7. WHEN the Tester navigates to `/checkout` with an empty cart, THE SUT SHALL display the empty-cart state with a "Browse Products" link and SHALL NOT render the checkout form.
8. WHEN the Tester clicks "Place Order" and the order is being processed, THE SUT SHALL disable the submit button and display a loading spinner for the duration of the submission.

---

### Requirement 4: User Authentication Testing

**User Story:** As a Tester, I want to verify that signup, login, and logout flows work correctly with proper validation, so that users can securely access their accounts.

#### Acceptance Criteria

1. WHEN the Tester submits the login form at `/login` with a valid email and password (minimum 6 characters), THE SUT SHALL call `POST /auth/login`, store the returned token and user data via `setAuthData`, and redirect to the `returnTo` query parameter destination or `/`.
2. WHEN the Tester submits the login form with an empty email field, THE SUT SHALL display the error "Email is required" and SHALL NOT submit the form.
3. WHEN the Tester submits the login form with a malformed email (e.g., "notanemail"), THE SUT SHALL display the error "Email is invalid" and SHALL NOT submit the form.
4. WHEN the Tester submits the login form with a password shorter than 6 characters, THE SUT SHALL display the error "Password must be at least 6 characters" and SHALL NOT submit the form.
5. WHEN the API returns an authentication error for the login form, THE SUT SHALL display the API error message in the error banner and SHALL NOT redirect the user.
6. WHEN the Tester submits the registration form at `/register` with all valid fields (name ≥ 2 chars, valid email, valid phone, password ≥ 6 chars, matching confirm password, terms checkbox checked), THE SUT SHALL redirect to `/login`.
7. WHEN the Tester submits the registration form with mismatched password and confirm-password fields, THE SUT SHALL display the error "Passwords do not match" and SHALL NOT submit the form.
8. WHEN the Tester submits the registration form without checking the terms checkbox, THE SUT SHALL prevent form submission via the browser's native required validation.
9. WHEN the Tester clicks the password visibility toggle on the login or register page, THE SUT SHALL toggle the password input type between `password` and `text`.

---

### Requirement 5: Search, Filter, and Sorting Testing

**User Story:** As a Tester, I want to verify that the shop page search, filter, and sorting features return correct and consistent results, so that users can find products efficiently.

#### Acceptance Criteria

1. WHEN the Tester enters a search term in the shop search input on `/shop`, THE SUT SHALL display only products whose name or category matches the search term, and SHALL display zero results with an appropriate message if no products match.
2. WHEN the Tester applies a category filter on `/shop`, THE SUT SHALL display only products belonging to the selected category.
3. WHEN the Tester applies a price-range filter on `/shop`, THE SUT SHALL display only products whose price falls within the specified range.
4. WHEN the Tester selects a sort option (e.g., "Price: Low to High"), THE SUT SHALL reorder the displayed product list according to the selected sort criterion.
5. WHEN the Tester clears all active filters on `/shop`, THE SUT SHALL restore the full unfiltered product list.
6. WHEN the Tester applies multiple filters simultaneously (e.g., category + price range), THE SUT SHALL display only products that satisfy all active filter conditions.

---

### Requirement 6: Responsiveness and UI Testing

**User Story:** As a Tester, I want to verify that the UI layout renders correctly across desktop, tablet, and mobile viewports, so that all users have a functional and visually consistent experience regardless of device.

#### Acceptance Criteria

1. WHEN the Tester sets the browser Viewport to 1280px width (desktop), THE SUT SHALL render the desktop layout including the full navigation header, multi-column product grids, and the two-column cart/checkout layout.
2. WHEN the Tester sets the browser Viewport to 768px width (tablet), THE SUT SHALL render a responsive layout where navigation collapses appropriately and product grids adjust to a reduced column count without horizontal overflow. IF the Viewport width is strictly greater than 768px and less than the desktop breakpoint, horizontal overflow is permitted until the desktop layout activates.
3. WHEN the Tester sets the browser Viewport to 375px width (mobile), THE SUT SHALL render the mobile layout — the home page SHALL serve `MobileHome` via the `useDeviceDetection` hook, and all interactive elements (buttons, inputs, quantity controls) SHALL be at least 44px in touch target size.
4. WHEN the Tester inspects any product image on any page, THE SUT SHALL display the image without distortion, cropping critical content, or broken `src` references; images with failed `src` SHALL fall back to `/images/product.png`, and the fallback image itself SHALL also be displayed without distortion or cropping.
5. WHEN the Tester inspects form inputs (login, register, checkout) on any Viewport, THE SUT SHALL display all labels, input fields, and error messages without overlapping or clipping.
6. WHEN the Tester inspects the cart page on a mobile Viewport, THE SUT SHALL display the order summary below the cart items list in a single-column layout.

---

### Requirement 7: Performance and Error Monitoring

**User Story:** As a Tester, I want to measure page load speed and detect console errors, API errors, and failed network requests, so that performance regressions and runtime issues are identified before release.

#### Acceptance Criteria

1. WHEN the Tester loads the Home page (`/`), THE SUT SHALL achieve a Page_Load_Time of 3000 milliseconds or less under a simulated Fast 3G network condition.
2. WHEN the Tester loads the Shop page (`/shop`), THE SUT SHALL achieve a Page_Load_Time of 3000 milliseconds or less under a simulated Fast 3G network condition.
3. WHEN the Tester loads the Product Detail page (`/[slug]`), THE SUT SHALL achieve a Page_Load_Time of 3000 milliseconds or less under a simulated Fast 3G network condition.
4. WHEN the Tester loads the Cart page (`/cart`), THE SUT SHALL achieve a Page_Load_Time of 3000 milliseconds or less under a simulated Fast 3G network condition.
5. WHEN the Tester monitors the browser console during any page load or user interaction, THE SUT SHALL produce zero unhandled JavaScript errors, including errors originating from third-party scripts or analytics code.
6. WHEN the Tester monitors the browser Network tab during checkout form submission, THE SUT SHALL produce zero failed network requests (HTTP 4xx or 5xx responses) for the `/api/validate-promo` endpoint when a valid promo code is submitted.
7. WHEN the Tester monitors the browser Network tab during login form submission, THE SUT SHALL produce zero failed network requests for the `POST /auth/login` endpoint when valid credentials are submitted.

---

### Requirement 8: Edge Case Testing

**User Story:** As a Tester, I want to verify that the application handles invalid inputs and boundary conditions gracefully, so that users cannot place invalid orders or corrupt application state.

#### Acceptance Criteria

1. WHEN the Tester attempts to add a product that is marked as out-of-stock or unavailable to the cart, THE SUT SHALL prevent the item from being added and SHALL display an appropriate unavailability message.
2. WHEN the Tester attempts to set a cart item quantity to a negative number via direct input manipulation, THE Cart_Context SHALL reject the value and maintain the current valid quantity.
3. WHEN the Tester navigates directly to `/checkout` with an empty cart, THE SUT SHALL display the empty-cart state and SHALL NOT allow the checkout form to be submitted.
4. WHEN the Tester submits the login form with an email containing only whitespace, THE SUT SHALL treat the input as empty and display the "Email is required" validation error.
5. WHEN the Tester submits the registration form with a name of exactly 1 character, THE SUT SHALL display the error "Name must be at least 2 characters" and SHALL NOT submit the form.
6. WHEN the Tester submits the checkout form with a phone number field left empty (PhoneInput component), THE SUT SHALL prevent form submission and indicate the phone field is required.
7. WHEN the Tester applies a promo code and then removes it via the "Remove" button, THE SUT SHALL restore the original order total and clear the promo success message.
8. WHEN the Tester submits the checkout form with an extremely long string (500+ characters) in the Street Address field, THE SUT SHALL accept the input without crashing and include it in the stored order data.

---

### Requirement 9: Test Reporting

**User Story:** As a Tester, I want to produce a structured test report after executing all test cases, so that stakeholders can review identified issues and prioritize fixes.

#### Acceptance Criteria

1. THE QA_Suite SHALL produce an Issue_Summary_Table containing one row per identified defect, with the columns: Page/Feature, Issue Description, Severity, and Steps to Reproduce.
2. THE QA_Suite SHALL classify each defect with exactly one Severity level: Critical, High, Medium, or Low.
3. THE QA_Suite SHALL produce an Overall_Feedback_Report with three clearly labelled sections: Performance Issues, UI/UX Problems, and Functional Bugs.
4. WHEN no defects are found in a section of the Overall_Feedback_Report, THE QA_Suite SHALL explicitly state "No issues found" for that section rather than omitting it.
5. THE Issue_Summary_Table SHALL list Steps to Reproduce as a numbered sequence of actions sufficient for a developer to independently reproduce the defect.
6. THE QA_Suite SHALL record the browser, browser version, operating system, and screen resolution used during each test session in the report header.
