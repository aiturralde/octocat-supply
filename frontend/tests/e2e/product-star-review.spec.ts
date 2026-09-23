import { test, expect } from '@playwright/test';

/**
 * Product star review E2E tests
 * Implements: frontend/tests/features/product-star-review.feature
 *
 * Covers:
 * - Rating a product from the product catalog
 * - Changing an existing rating
 * - Default unrated state
 */

const PRODUCT = 'SmartFeeder One';

const starButton = (star: number) =>
  `button[aria-label="Rate ${PRODUCT} ${star} ${star === 1 ? 'star' : 'stars'}"]`;

test.describe('Product star reviews', () => {
  test.beforeEach(async ({ page }) => {
    // Given I am viewing the product catalog
    await page.goto('/products');
    await expect(page.locator(`h3:has-text("${PRODUCT}")`)).toBeVisible();
  });

  test('Rate a product with stars', async ({ page }) => {
    const rating = page.locator(`[role="radiogroup"][aria-label="Star review for ${PRODUCT}"]`);

    // When I select the fourth star
    await page.click(starButton(4));

    // Then the rating shows "4 of 5"
    await expect(rating).toContainText('4 of 5');

    // And the first four stars are highlighted
    for (const star of [1, 2, 3, 4]) {
      await expect(page.locator(starButton(star))).toHaveClass(/text-red-600/);
    }
    await expect(page.locator(starButton(5))).not.toHaveClass(/text-red-600/);
  });

  test('Change a rating for a product', async ({ page }) => {
    const rating = page.locator(`[role="radiogroup"][aria-label="Star review for ${PRODUCT}"]`);

    // Given I have rated the product with four stars
    await page.click(starButton(4));
    await expect(rating).toContainText('4 of 5');

    // When I select the second star
    await page.click(starButton(2));

    // Then the rating shows "2 of 5"
    await expect(rating).toContainText('2 of 5');
    await expect(page.locator(starButton(4))).not.toHaveClass(/text-red-600/);
  });

  test('Products start without a rating', async ({ page }) => {
    const rating = page.locator(`[role="radiogroup"][aria-label="Star review for ${PRODUCT}"]`);

    // Then the product prompts me to rate it
    await expect(rating).toContainText('Rate it');
  });
});
