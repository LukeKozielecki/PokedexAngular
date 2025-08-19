import { test, expect } from '@playwright/test';

test.describe('UserProfileComponent', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept and mock the Firebase Auth accounts:lookup POST request
    await page.route('**/identitytoolkit/v1/accounts:lookup?**', async route => {
      const mockResponse = {
        "kind": "identitytoolkit#GetAccountInfoResponse",
        "users": [
          {
            "localId": "Ku1AsSdIBP1WLd1BzN8d6lPqb2",
            "email": "mock.user@example.com",
            "passwordHash": "akVEZUvBrBQ",
            "emailVerified": false,
            "passwordUpdatedAt": 1755350868772,
            "providerUserInfo": [
              {
                "providerId": "password",
                "federatedId": "mock.user@example.com",
                "email": "mock.user@example.com",
                "rawId": "mock.user@example.com"
              }
            ],
            "validSince": "1755350868",
            "lastLoginAt": "1755545027772",
            "createdAt": "1755350868772",
            "lastRefreshAt": "2025-08-19T12:15:02.251984Z"
          }
        ]
      };

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse)
      });
    });

    await page.goto('/profile');
  });

  test('should display welcome message with user email', async ({ page }) => {
    await expect(page.locator('#welcome-email-id')).toContainText('Welcome, mock.user@example.com!');
  });

  test('should display "You are logged in" message', async ({ page }) => {
    const loggedInMessage = await page.locator('.profile-container p').textContent();
    expect(loggedInMessage).toBe('You are logged in');
  });

  test('should log out the user and navigate to the login page on button click', async ({ page }) => {
    await page.locator('button', { hasText: 'Logout' }).click();
    await page.waitForURL('/login');
    expect(page.url()).toContain('/login');
  });
});
