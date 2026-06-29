import { test, expect } from '@playwright/test';

test.describe('Cart basics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('octocat-cart'));
  });

  test('Add item to cart and view cart subtotal', async ({ page }) => {
    await page.goto('/products');
    await expect(page.locator('h1:has-text("Products")')).toBeVisible();

    const productName = 'SmartFeeder One';

    const productCard = page
      .locator('div', { has: page.locator(`h3:has-text("${productName}")`) })
      .first();

    await expect(productCard).toBeVisible();

    await productCard.locator('button[aria-label*="Increase quantity"]').first().click();
    await productCard.locator('button[aria-label*="Increase quantity"]').first().click();

    await productCard.locator('button:has-text("Add to Cart")').first().click();

    await expect(page.locator('a[aria-label="Cart"]').locator('span')).toHaveText('2');

    await page.click('a[aria-label="Cart"]');
    await expect(page).toHaveURL(/\/cart/);

    await expect(page.locator('h1:has-text("Your Cart")')).toBeVisible();
    await expect(page.locator('article')).toContainText(productName);
    await expect(page.locator('[aria-label="Cart subtotal"]')).toContainText('Subtotal');
    await expect(page.locator('[aria-label="Cart subtotal"]')).toContainText('$199.98');
  });
});
