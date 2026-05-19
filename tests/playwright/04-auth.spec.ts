import { test, expect } from '@playwright/test';

// ─── Login Tests ──────────────────────────────────────────────────────────────

test.describe('Login Page', () => {

  // ── 4.1 Valid credentials: mocked POST /auth/login, stores token, redirects ──

  test('valid credentials call POST /auth/login, store token, and redirect to /', async ({ page }) => {
    // Mock the auth API endpoint
    await page.route('**/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'test-token',
          user: { id: 1, name: 'Test User', email: 'test@example.com' },
        }),
      });
    });

    let loginRequestMade = false;
    page.on('request', (request) => {
      if (request.url().includes('/auth/login') && request.method() === 'POST') {
        loginRequestMade = true;
      }
    });

    await page.goto('/login');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Should redirect away from /login
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 5000 });

    expect(loginRequestMade).toBe(true);
    expect(page.url()).not.toContain('/login');
  });

  // ── 4.2 Empty email shows "Email is required" and does not submit ──

  test('empty email shows "Email is required" and does not submit', async ({ page }) => {
    let requestMade = false;
    await page.route('**/auth/login', async (route) => {
      requestMade = true;
      await route.continue();
    });

    await page.goto('/login');

    // Leave email empty, fill password
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Error message should appear
    const emailError = page.locator('p.mt-1.text-sm.text-red-500').filter({ hasText: 'Email is required' });
    await expect(emailError).toBeVisible();

    // Should still be on /login
    expect(page.url()).toContain('/login');
    expect(requestMade).toBe(false);
  });

  // ── 4.3 Malformed email shows "Email is invalid" and does not submit ──

  test('malformed email shows "Email is invalid" and does not submit', async ({ page }) => {
    let requestMade = false;
    await page.route('**/auth/login', async (route) => {
      requestMade = true;
      await route.continue();
    });

    await page.goto('/login');

    await page.fill('input[name="email"]', 'notanemail');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    const emailError = page.locator('p.mt-1.text-sm.text-red-500').filter({ hasText: 'Email is invalid' });
    await expect(emailError).toBeVisible();

    expect(page.url()).toContain('/login');
    expect(requestMade).toBe(false);
  });

  // ── 4.4 Password shorter than 6 chars shows validation error and does not submit ──

  test('password shorter than 6 characters shows "Password must be at least 6 characters" and does not submit', async ({ page }) => {
    let requestMade = false;
    await page.route('**/auth/login', async (route) => {
      requestMade = true;
      await route.continue();
    });

    await page.goto('/login');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'abc');
    await page.click('button[type="submit"]');

    const passwordError = page.locator('p.mt-1.text-sm.text-red-500').filter({
      hasText: 'Password must be at least 6 characters',
    });
    await expect(passwordError).toBeVisible();

    expect(page.url()).toContain('/login');
    expect(requestMade).toBe(false);
  });

  // ── 4.5 API error response shows error banner and does not redirect ──

  test('API error response shows error banner and does not redirect', async ({ page }) => {
    await page.route('**/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid credentials' }),
      });
    });

    await page.goto('/login');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Error banner should appear
    const errorBanner = page.locator('div.px-4.py-3.bg-red-50');
    await expect(errorBanner).toBeVisible();

    // Should remain on /login
    expect(page.url()).toContain('/login');
  });

  // ── 4.9 (login) Password visibility toggle changes input type ──

  test('password visibility toggle changes input type between "password" and "text"', async ({ page }) => {
    await page.goto('/login');

    const passwordInput = page.locator('input[name="password"]');

    // Initially should be type="password"
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click "Show password" toggle
    const toggleButton = page.locator('button[type="button"][aria-label="Show password"]');
    await toggleButton.click();

    // Should now be type="text"
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click "Hide password" toggle
    const hideButton = page.locator('button[type="button"][aria-label="Hide password"]');
    await hideButton.click();

    // Should be back to type="password"
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });
});

// ─── Register Tests ───────────────────────────────────────────────────────────

test.describe('Register Page', () => {

  // ── 4.6 Valid registration redirects to /login ──

  test('valid registration with all fields redirects to /login', async ({ page }) => {
    // Intercept the alert that the register page fires before redirecting
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    await page.goto('/register');

    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="phone"]', '03001234567');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    await page.check('input[type="checkbox"]#terms');

    await page.click('button[type="submit"]');

    // Should redirect to /login
    await page.waitForURL('**/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  // ── 4.7 Mismatched passwords shows "Passwords do not match" and does not submit ──

  test('mismatched passwords shows "Passwords do not match" and does not submit', async ({ page }) => {
    await page.goto('/register');

    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="phone"]', '03001234567');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'differentpassword');
    await page.check('input[type="checkbox"]#terms');

    await page.click('button[type="submit"]');

    const confirmPasswordError = page.locator('p.mt-1.text-sm.text-red-500').filter({
      hasText: 'Passwords do not match',
    });
    await expect(confirmPasswordError).toBeVisible();

    // Should remain on /register
    expect(page.url()).toContain('/register');
  });

  // ── 4.8 Terms checkbox unchecked prevents submission via native validation ──

  test('unchecked terms checkbox prevents submission via native browser validation', async ({ page }) => {
    // Intercept any dialog (alert) to detect if form was submitted
    let dialogShown = false;
    page.on('dialog', async (dialog) => {
      dialogShown = true;
      await dialog.accept();
    });

    await page.goto('/register');

    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="phone"]', '03001234567');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    // Intentionally do NOT check the terms checkbox

    await page.click('button[type="submit"]');

    // Native browser validation should block submission — no alert, no redirect
    expect(dialogShown).toBe(false);
    expect(page.url()).toContain('/register');

    // The terms checkbox should be invalid (native constraint)
    const termsCheckbox = page.locator('input[type="checkbox"]#terms');
    const isValid = await termsCheckbox.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBe(false);
  });

  // ── 4.9 (register) Password visibility toggle changes input type ──

  test('password visibility toggle changes input type between "password" and "text" on register page', async ({ page }) => {
    await page.goto('/register');

    const passwordInput = page.locator('input[name="password"]');
    const confirmPasswordInput = page.locator('input[name="confirmPassword"]');

    // Both should start as type="password"
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    // The register page toggle buttons have no aria-label; they are the only
    // button[type="button"] inside each password field's parent div.
    // Password field toggle: first button[type="button"] in the password field wrapper
    const passwordFieldWrapper = page.locator('input[name="password"]').locator('..');
    const passwordToggle = passwordFieldWrapper.locator('button[type="button"]');
    await passwordToggle.click();

    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Toggle back
    await passwordToggle.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Confirm password field toggle
    const confirmPasswordFieldWrapper = page.locator('input[name="confirmPassword"]').locator('..');
    const confirmPasswordToggle = confirmPasswordFieldWrapper.locator('button[type="button"]');
    await confirmPasswordToggle.click();

    await expect(confirmPasswordInput).toHaveAttribute('type', 'text');

    // Toggle back
    await confirmPasswordToggle.click();
    await expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });
});
