import { test, expect, Page } from '@playwright/test';

test.describe('Pokemon Details Page', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('http://localhost:4200/pokemon-details/1');
  });

  test('should display all core components for a pokemon', async () => {
    await expect(page.locator('.pokemon-details-wrapper')).toBeVisible();

    // Verify the header and its content
    const header = page.locator('details-page-header');
    await expect(header).toBeVisible();
    await expect(header.locator('.pokemon-name')).toBeVisible();
    await expect(header.locator('img')).toBeVisible();

    // Verify the "Details" section and its components
    const detailsSection = page.locator('app-pokemon-details-summary');
    await expect(page.locator('h2:text("Details")')).toBeVisible();
    await expect(detailsSection).toBeVisible();

    // Verify the "Stats" section and its components
    const statsSection = page.locator('app-stats-breakdown');
    await expect(page.locator('h2:text("Stats")')).toBeVisible();
    await expect(statsSection).toBeVisible();

    // Verify the "Evolution" section and its components
    const evolutionSection = page.locator('.evolution-container');
    await expect(page.locator('h2:text("Evolution")')).toBeVisible();
    await expect(evolutionSection).toBeVisible();
    await expect(evolutionSection.locator('app-evolution-chain-species').first()).toBeVisible();
  });

  test('should toggle the favorite button state on click for a logged-in user', async () => {
    const setupFavouritePokemon = async (page:Page) => {
      await page.goto('http://localhost:4200/login');
      await page.getByLabel('Email').fill('mock.user@example.com');
      await page.getByLabel('Password').fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      await page.waitForURL('**/pokemon');
    };
    await setupFavouritePokemon(page)

    await page.goto('http://localhost:4200/pokemon-details/1');
    await expect(page.locator('.pokemon-details-wrapper')).toBeVisible();

    const favoriteButton = page.locator('.favorite-button');
    await expect(favoriteButton).toBeEnabled();

    // The initial state should be 'not favorite'
    const initialIcon = page.locator('.favorite-button mat-icon:text("favorite_border")');
    await expect(initialIcon).toBeVisible();
    await expect(favoriteButton).not.toHaveClass(/is-favorite/);

    // Click to add to favorites
    await favoriteButton.click();
    await expect(favoriteButton).toHaveClass(/is-favorite/);
    await expect(page.locator('.favorite-button mat-icon:text("favorite")')).toBeVisible();

    // Click again to remove from favorites
    await favoriteButton.click();
    await expect(favoriteButton).not.toHaveClass(/is-favorite/);
    await expect(page.locator('.favorite-button mat-icon:text("favorite_border")')).toBeVisible();


    const setupTeardown = async (page:Page)=> {
      await page.goto('http://localhost:4200/profile');
      await page.locator('#profile-logout-button').click();
    }

    await setupTeardown(page)
  });

  test('should disable the favorite button when the user is not logged in', async () => {
    await expect(page.locator('.pokemon-details-wrapper')).toBeVisible();

    const favoriteButton = page.locator('.favorite-button');

    await expect(favoriteButton).toBeDisabled();
    await expect(page.locator('.favorite-button mat-icon:text("favorite_border")')).toBeVisible();
  });

  test('should navigate to a new pokemon details page when clicking a similar pokemon card', async () => {
    const similarPokemonSection = page.locator('.similar-pokemon-container');
    await expect(similarPokemonSection).toBeVisible();

    const initialUrl = page.url();

    const firstSimilarPokemonCard = page.locator('.similar-pokemon-list .pokemon-item').first();
    await firstSimilarPokemonCard.click();

    await page.waitForURL(url => url.href !== initialUrl);

    const newUrl = page.url();
    expect(newUrl).not.toEqual(initialUrl);
    expect(newUrl).toMatch(/\/pokemon-details\/\d+$/);

    await expect(page.locator('app-loading-screen')).not.toBeVisible();
    await expect(page.locator('.pokemon-details-wrapper')).toBeVisible();
  });

  test('should display the Pokemon ID when hovering over the header', async () => {
    await expect(page.getByTestId('details-header-pokemon-sprite')).toBeVisible();

    const hoverContainer = page.getByTestId('details-header-pokemon-sprite');
    await hoverContainer.hover();
    await expect(page.locator('.pokemon-id')).toBeVisible();
  });
});
