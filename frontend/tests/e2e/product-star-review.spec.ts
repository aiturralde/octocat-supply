import { test, expect, type Page } from '@playwright/test';

/**
 * Product star review E2E tests
 * Implements: frontend/tests/features/product-star-review.feature
 *
 * Covers:
 * - Rating a product from the product catalog
 * - Changing an existing rating
 * - Default unrated state
 * - Keyboard navigation of the star review control
 */

const PRODUCT = 'SmartFeeder One';

const productCard = (page: Page) =>
  page.locator('[data-testid="product-card"]', { has: page.locator(`h3:text-is("${PRODUCT}")`) });

const ratingSummary = (page: Page) =>
  productCard(page).locator('[data-testid="star-rating-value"]');

const starButton = (star: number) =>
  `button[aria-label="Rate ${PRODUCT} ${star} ${star === 1 ? 'star' : 'stars'}"]`;

test.describe('Product star reviews', () => {
  test.beforeEach(async ({ page }) => {
    // Given I am viewing the product catalog
    await page.goto('/products');
    await expect(page.locator(`h3:has-text("${PRODUCT}")`)).toBeVisible();
  });

  test('Rate a product with stars', async ({ page }) => {
    const rating = ratingSummary(page);

    // When I select the fourth star
    await page.click(starButton(4));

    // Then the rating shows "4 of 5"
    await expect(rating).toContainText('4 of 5');

    // And the fourth star is checked and highlighted in red
    await expect(page.locator(starButton(4))).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator(starButton(4))).toHaveClass(/text-red-600/);
    await expect(page.locator(starButton(5))).toHaveAttribute('aria-checked', 'false');
  });

  test('Change a rating for a product', async ({ page }) => {
    const rating = ratingSummary(page);

    // Given I have rated the product with four stars
    await page.click(starButton(4));
    await expect(rating).toContainText('4 of 5');

    // When I select the second star
    await page.click(starButton(2));

    // Then the rating shows "2 of 5"
    await expect(rating).toContainText('2 of 5');
    await expect(page.locator(starButton(4))).toHaveAttribute('aria-checked', 'false');
  });

  test('Products start without a rating', async ({ page }) => {
    // Then every product prompts me to rate it
    const summaries = page.locator('[data-testid="star-rating-value"]');
    const count = await summaries.count();
    expect(count).toBeGreaterThan(0);

    for (let index = 0; index < count; index++) {
      await expect(summaries.nth(index)).toHaveText('Rate it');
    }
  });

  test('Rate a product with the keyboard', async ({ page }) => {
    const rating = ratingSummary(page);

    // When I focus the star review and use the arrow keys
    await page.locator(starButton(1)).focus();
    await page.keyboard.press('ArrowRight');
    await expect(rating).toHaveText('1 of 5');
    await page.keyboard.press('ArrowRight');

    // Then the rating shows "2 of 5"
    await expect(rating).toHaveText('2 of 5');
    await expect(page.locator(starButton(2))).toBeFocused();
  });
});
