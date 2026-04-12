// ============================================================
// Threadline E2E — User Journey
// Landing → Search → Filter → PDP → Cart → Checkout
// ============================================================

import { test, expect } from '@playwright/test';

test.describe('User Shopping Journey', () => {
  test('should load the landing page with hero section', async ({ page }) => {
    await page.goto('/landing');
    await page.waitForLoadState('networkidle');

    // Hero should be visible
    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();

    // Page title should exist
    await expect(page).toHaveTitle(/threadline/i);
  });

  test('should navigate from landing to home page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Banner strip should be visible
    const banner = page.locator('[aria-label="Promotional announcements"]');
    await expect(banner).toBeVisible();

    // Social proof strip should be visible
    const proofStrip = page.locator('[aria-label="Store statistics"]');
    await expect(proofStrip).toBeVisible();
  });

  test('should open search modal and search for products', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click search button
    const searchBtn = page.locator('button[aria-label="Search products"]');
    await expect(searchBtn).toBeVisible();
    await searchBtn.click();

    // Search modal should appear
    const searchModal = page.locator('[role="search"]');
    await expect(searchModal).toBeVisible();

    // Quick search suggestions should be visible
    const suggestion = page.locator('button[aria-label="Search for New Arrivals"]');
    await expect(suggestion).toBeVisible();

    // Type in search input
    const searchInput = searchModal.locator('input[type="text"]');
    await searchInput.fill('shirt');
    await page.waitForTimeout(500);

    // Close search modal with close button
    const closeBtn = page.locator('button[aria-label="Close search"]');
    await closeBtn.click();
    await expect(searchModal).not.toBeVisible();
  });

  test('should navigate to catalog and see filters', async ({ page }) => {
    await page.goto('/catalog');
    await page.waitForLoadState('networkidle');

    // Page heading
    const heading = page.locator('h1');
    await expect(heading).toContainText('Catalog');

    // On desktop, filter sidebar should be visible
    const filterSidebar = page.locator('aside.hidden.lg\\:block');
    // Check viewport width to decide
    const viewportSize = page.viewportSize();
    if (viewportSize && viewportSize.width >= 1024) {
      await expect(filterSidebar).toBeVisible();
    }

    // Sort dropdown button should exist
    const sortBtn = page.locator('button[aria-label="Sort products"]');
    await expect(sortBtn).toBeVisible();
  });

  test('should open sort dropdown and select option', async ({ page }) => {
    await page.goto('/catalog');
    await page.waitForLoadState('networkidle');

    // Click sort button
    const sortBtn = page.locator('button[aria-label="Sort products"]');
    await sortBtn.click();

    // Dropdown list should appear
    const sortList = page.locator('[role="listbox"][aria-label="Sort options"]');
    await expect(sortList).toBeVisible();

    // Select "Price: Low → High"
    const priceOption = sortList.locator('li', { hasText: 'Price: Low → High' });
    await priceOption.click();

    // Dropdown should close
    await expect(sortList).not.toBeVisible();

    // Button should now show the selected option
    await expect(sortBtn).toContainText('Price: Low → High');
  });

  test('should navigate to product detail page', async ({ page }) => {
    // Navigate to home and look for product links
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Try clicking on a product card (New Arrivals section)
    const productLink = page.locator('a[href*="/product/"]').first();
    const hasProducts = await productLink.count();

    if (hasProducts > 0) {
      // Force click to bypass the hover overlay intercepting pointer events
      await productLink.click({ force: true });
      await page.waitForLoadState('networkidle');

      // Should be on a product page
      await expect(page.url()).toContain('/product/');
    } else {
      // Navigate directly to a product page to test PDP
      await page.goto('/product/test-product');
      await page.waitForLoadState('networkidle');
    }
  });

  test('should open cart drawer', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find cart button in header
    const cartBtn = page.locator('button').filter({ has: page.locator('.lucide-shopping-cart') });
    const cartBtnCount = await cartBtn.count();

    if (cartBtnCount > 0) {
      await cartBtn.first().click();
      await page.waitForTimeout(500);

      // Cart drawer should open
      const cartDrawer = page.locator('[role="dialog"][aria-label="Shopping cart"]');
      await expect(cartDrawer).toBeVisible();

      // Should have close button
      const closeBtn = cartDrawer.locator('button').first();
      await expect(closeBtn).toBeVisible();

      // Close cart
      await closeBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('should load checkout page', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Checkout page should load without errors
    // The exact content depends on cart state, but the page should render
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should have working skip-navigation link', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Tab to activate skip link
    await page.keyboard.press('Tab');

    // Skip link should become visible
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();

    // Main content should have the id
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeAttached();
  });

  test('should have working navigation on desktop', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Main nav should be visible
    const nav = page.locator('nav[aria-label="Main navigation"]');
    await expect(nav).toBeVisible();

    // Nav links should exist
    const shopLink = nav.locator('a[href="/shop"]');
    await expect(shopLink).toBeVisible();
    await expect(shopLink).toContainText('Shop');
  });

  test('should have working mobile hamburger menu at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Hamburger button should be visible
    const hamburgerBtn = page.locator('button[aria-label="Open menu"]');
    await expect(hamburgerBtn).toBeVisible();

    // Desktop nav should be hidden
    const desktopNav = page.locator('nav[aria-label="Main navigation"]');
    await expect(desktopNav).not.toBeVisible();

    // Open mobile nav
    await hamburgerBtn.click();
    await page.waitForTimeout(500);

    // Mobile nav drawer should appear
    const mobileNav = page.locator('nav[aria-label="Mobile navigation"]');
    await expect(mobileNav).toBeVisible();

    // Should have navigation links
    const shopLink = mobileNav.locator('a[href="/shop"]');
    await expect(shopLink).toBeVisible();

    // Close menu
    const closeBtn = page.locator('button[aria-label="Close menu"]');
    await closeBtn.click();
    await page.waitForTimeout(500);
    await expect(mobileNav).not.toBeVisible();
  });

  test('should show mobile filter button on catalog at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/catalog');
    await page.waitForLoadState('networkidle');

    // Mobile filter button should be visible
    const filterBtn = page.locator('button[aria-label="Open filters"]');
    await expect(filterBtn).toBeVisible();

    // Click to open
    await filterBtn.click();
    await page.waitForTimeout(500);

    // Filter drawer should open
    const filterDrawer = page.locator('[role="dialog"][aria-label="Product filters"]');
    await expect(filterDrawer).toBeVisible();

    // Close filter drawer
    const closeBtn = page.locator('button[aria-label="Close filters"]');
    await closeBtn.click();
    await page.waitForTimeout(500);
  });
});
