import { test, expect } from '@playwright/test';

test.describe('LoadingScreenComponent', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/pokemon-details/1');
    await page.waitForTimeout(500);
  });

  test('should display the loading logo and then hide it', async ({ page }) => {
    const logo = page.locator('img.spinner-icon');

    await expect(logo).toBeVisible();

    await page.waitForTimeout(500);
    await expect(logo).not.toBeVisible();
  });

  test('should display the loading spinner and then hide it', async ({ page }) => {
    const spinner = page.locator('mat-spinner');

    await expect(spinner).toBeVisible();

    await page.waitForTimeout(500);
    await expect(spinner).not.toBeVisible();
  });

  test('should contain both spinner and logo', async ({ page }) => {
    await page.waitForSelector('mat-spinner', { state: 'visible' });

    const spinner = page.locator('mat-spinner');
    const logo = page.locator('img.spinner-icon');

    await expect(spinner).toBeVisible();
    await expect(logo).toBeVisible();

    await page.waitForTimeout(500);
    await expect(spinner).not.toBeVisible();
    await expect(logo).not.toBeVisible();
  });
});
