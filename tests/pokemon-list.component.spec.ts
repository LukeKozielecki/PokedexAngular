import { test, expect, Page } from '@playwright/test';

test.describe('Pokemon List Page', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('http://localhost:4200/pokemon');
  });

  test('should display the search form and a list of pokemon', async () => {
    await expect(page.locator('app-loading-screen')).not.toBeVisible();

    await expect(page.locator('.pokemon-list-container')).toBeVisible();
    await expect(page.locator('app-search-form')).toBeVisible();
    await expect(page.locator('.pokemon-card').first()).toBeVisible();
  });

  test('should navigate to the details page when a pokemon card is clicked', async () => {
    await expect(page.locator('.pokemon-list-container')).toBeVisible();

    const firstPokemonCard = page.locator('.pokemon-grid .pokemon-card').first();
    await firstPokemonCard.click();

    await page.waitForURL(/\/pokemon-details\/\d+$/);
    await expect(page.locator('.pokemon-details-wrapper')).toBeVisible();
  });

  test('should display the "no pokemon found" message on a failed search', async () => {
    await expect(page.locator('.pokemon-list-container')).toBeVisible();

    await page.locator('#pokemon-search-input-form').fill('pikaaaaaaaaaaaaaaachu');
    await page.locator('#pokemon-search-input-form').press('Enter');

    await expect(page.locator('.search-failed')).toBeVisible();
    await expect(page.locator('.pokemon-grid')).toBeHidden();
  });

  test('should display a favourite pokemon when favourites filter is active', async () => {
    const setupFavouritePokemon = async (page:Page) => {
      // Login flow to ensure the user is authenticated
      await page.goto('http://localhost:4200/login');
      await page.getByLabel('Email').fill('mock.user@example.com');
      await page.getByLabel('Password').fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      await page.waitForURL('**/pokemon');

      // Navigate to Bulbasaur details page
      await page.goto('http://localhost:4200/pokemon-details/1');
      const favoriteButton = page.locator('.favorite-button');
      const hasFavoriteClass = await favoriteButton.evaluate(el => el.classList.contains('is-favorite'));

      if (!hasFavoriteClass) {
        await favoriteButton.click();
      }
    };

    const testProper = async (page: Page) => {
      await page.goto('http://localhost:4200/pokemon');

      // Click the "Favourites" button to filter the list
      const favoritesFilterButton = page.locator('app-search-form button:has-text("Favourites")');
      await favoritesFilterButton.click();
      await expect(favoritesFilterButton).toHaveClass(/is-favorite-active/);

      // Check if Bulbasaur is the only pokemon visible
      await expect(page.locator('.pokemon-grid')).toBeVisible();
      await expect(page.locator('.pokemon-grid .pokemon-card')).toHaveCount(1);
      await expect(page.locator('.pokemon-name:has-text("Bulbasaur")')).toBeVisible();

    };

    const setupTeardownChanges = async (page:Page) => {
      // Navigate back to the details page of Bulbasaur to un-favorite it
      await page.locator('.pokemon-grid .pokemon-card').first().click();
      await page.waitForURL('**/pokemon-details/1');
      await expect(page.locator('.pokemon-details-wrapper')).toBeVisible();

      // Click again to remove from favorites
      const favoriteButtonDetails = page.locator('.favorite-button');
      await favoriteButtonDetails.click();
      await expect(favoriteButtonDetails).not.toHaveClass(/is-favorite/);
      await expect(page.locator('.favorite-button mat-icon:text("favorite_border")')).toBeVisible();
    }

    await setupFavouritePokemon(page);
    await testProper(page);
    await setupTeardownChanges(page)
  });
});
