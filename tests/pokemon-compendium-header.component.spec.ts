import { test, expect } from '@playwright/test';

test.describe('Pokemon Compendium Header', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200');
  });

  test('should display the header with the logo and title', async ({ page }) => {
    const headerWrapper = page.locator('.compendium-wrapper');
    await expect(headerWrapper).toBeVisible();

    const logoImage = page.locator('.compendium-logo');
    await expect(logoImage).toBeVisible();

    const title = page.locator('.compendium-title');
    await expect(title).toBeVisible();
    await expect(title).toHaveText('Pokemon Compendium');
  });

  test('should navigate to the login page when the login button is clicked and user is not logged in', async ({ page }) => {
    const loginButton = page.locator('.login-icon-button');
    await loginButton.click();

    await page.waitForURL('**/login');
    expect(page.url()).toContain('/login');
  });

  test('should navigate to the profile page when the login button is clicked and user is logged in', async ({ page }) => {
    // Perform Login
    await page.goto('http://localhost:4200/login');
    await page.getByLabel('Email').fill('mock.user2@example.com');
    await page.getByLabel('Password').fill('12341234');
    await page.getByRole('button', { name: 'Login' }).click();

    // Wait for the login to complete and the app to navigate to the profile page
    await page.waitForURL('**/pokemon');

    // Click the header's button now that the app's state is "logged in"
    const profileButton = page.locator('.login-icon-button');
    await expect(profileButton).toBeVisible();
    await profileButton.click();
    await expect(page).toHaveURL(/profile/);
  });

  test('should shrink when the page is scrolled down and restore when scrolled back up', async ({ page }) => {
    // Initial should not be scrolled
    const headerHostElement = page.locator('app-pokemon-compendium-header');
    await expect(headerHostElement).not.toHaveClass(/scrolled/);

    // Scroll down beyond PokemonCompendiumHeaderComponent.SCROLL_THRESHOLD_SHRINK
    await page.mouse.wheel(0, 150);
    await expect(headerHostElement).toHaveClass(/scrolled/);

    // Scroll back up
    await page.mouse.wheel(0, -150);
    await expect(headerHostElement).not.toHaveClass(/scrolled/);
  });
});
