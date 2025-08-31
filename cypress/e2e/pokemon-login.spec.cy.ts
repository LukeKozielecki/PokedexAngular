import '../support/commands';

describe('authentication-form-tests', () => {

  beforeEach(() => {
    cy.visit('http://localhost:4200/login');
  });

  it('should correctly initialize component', () => {
    cy.get('[data-cy="auth-email-input-filed"]').should('have.value', '');
    cy.get('[data-cy="auth-password-input-filed"]').should('have.value', '');
    cy.get('[data-cy="auth-error-message-string"]').should('not.exist');
  });

  it('should navigate to the home page when the back button is clicked', () => {
    cy.get('[data-cy="auth-navigate-back-button"]').click();
    cy.url().should('include', '/pokemon');
  });

  it('should correctly transition between login and auth state', () => {
    cy.get('[data-cy="auth-toggle-login-text"]').should('contain', 'Need to register?');

    cy.get('[data-cy="auth-toggle-login-register-button"]').click();
    cy.get('[data-cy="auth-toggle-login-text"]').should('contain', 'Already have an account?');

    cy.get('[data-cy="auth-toggle-login-register-button"]').click();
    cy.get('[data-cy="auth-toggle-login-text"]').should('contain', 'Need to register?');
  });

  it('should display a success message after a password reset request', () => {
    const testEmail = 'somethingSomething@something.asd';
    cy.intercept('POST', 'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode*', {
      statusCode: 200,
      body: {},
    }).as('resetPasswordRequest');

    cy.get('[data-cy="auth-email-input-filed"]').type(testEmail);
    cy.get('[data-cy="auth-reset-password-button"]').click();

    cy.get('[data-cy="auth-success-message-string"]')
      .should('be.visible')
      .and('contain', 'A password reset link has been sent to your email address. Please do check Spam');
  });


  it('should correctly log in with valid credentials', () => {
    cy.setupMockPokemonList();
    cy.login();
  });

  it('should correctly show error message with invalid credentials', () => {
    const testEmail = 'somethingSomething@something.asd';
    const testPassword = 'somethingSomething@something.asd';

    cy.intercept('POST', 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=*', {
      statusCode: 400,
      body: {
        error: {
          code: 400,
          message: 'INVALID_LOGIN_CREDENTIALS',
        },
      },
    }).as('failedLoginRequest');

    cy.get('[data-cy="auth-email-input-filed"]').type(testEmail);
    cy.get('[data-cy="auth-password-input-filed"]').type(testPassword)
    cy.get('[data-cy="auth-login-button"]').click();
    cy.wait('@failedLoginRequest');

    cy.get('[data-cy="auth-error-message-string"]')
      .should('be.visible')
      .and('contain', 'Firebase: Error (auth/invalid-credential).');
  });

  it('should register a new account', () => {
    cy.intercept('POST', 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=*', {
      statusCode: 200,
      body: {
        kind: "identitytoolkit#SignupNewUserResponse",
        idToken: "mock-id-token",
        refreshToken: "mock-refresh-token",
        expiresIn: "3600",
        localId: "mock-user-uid",
        email: "newuser@example.com"
      }
    }).as('successfulSignUp');

    cy.intercept('POST', 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=*', {
      statusCode: 400,
      body: {
        error: {
          code: 400,
          message: 'EMAIL_NOT_FOUND',
        },
      },
    });

    const testEmail = 'somethingaaSomething@something.asd';
    const testPassword = 'somethingaaSomething@something.asd';
    cy.get('[data-cy="auth-toggle-login-register-button"]').click();

    cy.get('[data-cy="auth-email-input-filed"]').type(testEmail);
    cy.get('[data-cy="auth-password-input-filed"]').type(testPassword)
    cy.get('[data-cy="auth-register-button"]').click();
    cy.wait('@successfulSignUp');
    cy.setupMockPokemonList();
    cy.url().should('include', '/pokemon');
  });

  it('should show an error message when registering with a taken email', () => {
    cy.intercept('POST', 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=*', {
      statusCode: 400,
      body: {
        error: {
          code: 400,
          message: 'EMAIL_EXISTS',
          errors: [{
            message: 'EMAIL_EXISTS',
            domain: 'global',
            reason: 'invalid'
          }]
        }
      },
    }).as('emailExistsError');

    const testEmail = 'existinguser@example.com';
    const testPassword = 'testpassword';

    cy.get('[data-cy="auth-toggle-login-register-button"]').click();
    cy.get('[data-cy="auth-email-input-filed"]').type(testEmail);
    cy.get('[data-cy="auth-password-input-filed"]').type(testPassword);
    cy.get('[data-cy="auth-register-button"]').click();
    cy.wait('@emailExistsError');

    cy.get('[data-cy="auth-error-message-string"]')
      .should('be.visible')
      .and('contain', 'Firebase: Error (auth/email-already-in-use).');
  });

});
