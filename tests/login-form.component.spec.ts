import { test, Page, expect } from '@playwright/test';

//This god forsaken response mock needs to be taken implicitly from inspect network. apparently
const mockLoginResponse = {
  displayName: '',
  email: 'mock.user@example.com',
  expiresIn: '3600',
  idToken: 'something-somethingToken',
  kind: 'identitytoolkit#VerifyPasswordResponse',
  localId: 'something-somethingLocation',
  refreshToken: 'something-somethingRefresh',
  registered: true
};

const mockRegisterResponse = {
  displayName: '',
  email: 'newuser@example.com',
  expiresIn: '3600',
  idToken: 'newIdToken',
  kind: 'identitytoolkit#SignupNewUserResponse',
  localId: 'newLocalId',
  refreshToken: 'newRefreshToken'
};

const invalidEmail = "aaaaaAtSth.Sth"

test.describe('Login Form', () => {
  test.beforeEach(async ({ page }) => {
    // Fulfill the login request with the mock success response
    await page.route('**/identitytoolkit/v3/relyingparty/verifyPassword', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockLoginResponse)
      });
    });

    // Fulfill the registration request with the mock success response
    await page.route('**/identitytoolkit/v3/relyingparty/signupNewUser', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockRegisterResponse)
      });
    });

    // Fulfill the registration request the mock invalid email respo
    await page.route('**/identitytoolkit/v3/relyingparty/**', async route => {
      const requestBody = JSON.parse(route.request().postData() || '{}');
      if (requestBody.email === invalidEmail) {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            error: {
              code: 400,
              message: 'INVALID_EMAIL',
              errors: [{
                message: 'INVALID_EMAIL',
                domain: 'global',
                reason: 'badRequest'
              }]
            }
          })
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('http://localhost:4200/login');
  });

  test('should start by default in login mode', async ({ page }) => {
    await expect(page.locator('.login-container h2')).toHaveText('Login');
    await expect(page.locator('button[type="submit"]')).toHaveText('Login');
    await expect(page.locator('.toggle-mode-button a')).toHaveText('Need to register?');
  });


  test('should transition to register on click "Need to register?"', async ({ page }) => {
    await page.locator('.toggle-mode-button').click();

    await expect(page.locator('#form-title-register')).toHaveText('Register');
    await expect(page.locator('button[type="submit"]')).toHaveText('Register');
    await expect(page.locator('.toggle-mode-button a')).toHaveText('Already have an account?');
  });

  test('should transition back to login on click "Already have an account?"', async ({ page }) => {
    await page.locator('.toggle-mode-button').click();
    await page.locator('.toggle-mode-button').click();

    await expect(page.locator('#form-title-login')).toHaveText('Login');
    await expect(page.locator('button[type="submit"]')).toHaveText('Login');
    await expect(page.locator('.toggle-mode-button a')).toHaveText('Need to register?');
  });

  test('onLogin correct response should navigate', async ({ page }) => {
    await page.locator('#email').fill('testuser@example.com');
    await page.locator('#password').fill('password123');
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL('http://localhost:4200/pokemon');
  });

  test('onRegister correct response should navigate', async ({ page }) => {
    await page.locator('.toggle-mode-button').click();

    await page.locator('#email').fill('newuser@example.com');
    await page.locator('#password').fill('newpassword123');
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL('http://localhost:4200/pokemon');
  });

  test('on error should not navigate and should display error message', async ({ page }) => {
    await page.locator('#email').fill(invalidEmail);
    await page.locator('#password').fill('aaa');
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL('http://localhost:4200/login');
    await expect(page.locator('.error-message')).toHaveText('Firebase: Error (auth/invalid-email).');
  });
});
