import '../support/commands';

describe('auth-profile-tests', () => {

  beforeEach(() => {
    cy.setupMockPokemonList();
    cy.login();

    cy.url().should('include', 'http://localhost:4200/pokemon');
    cy.get('[data-cy="login-icon-button"]').click()
  })

  it('should enable update password button when passwords match and valid length', () => {
    cy.get('[data-cy="button-toggle-password-form"]').click()
    cy.get('[data-cy="input-new-password-field"]').type("bad")
    cy.get('[data-cy="input-confirm-new-password-field"]').type("bad")
    cy.get('[data-cy="update-password-button"]').should("be.disabled")

    cy.get('[data-cy="input-new-password-field"]').clear().type("valid-length-no-match")
    cy.get('[data-cy="input-confirm-new-password-field"]').clear().type("valid-length")
    cy.get('[data-cy="update-password-button"]').should("be.disabled")

    cy.get('[data-cy="input-new-password-field"]').clear().type("valid-length-match1234_###")
    cy.get('[data-cy="input-confirm-new-password-field"]').clear().type("valid-length-match1234_###")
    cy.get('[data-cy="update-password-button"]').should("not.be.disabled")
  });

  it('should communicate problems with new password', () => {
    const communicatePasswordIsRequired = () => {
      cy.get('[data-cy="button-toggle-password-form"]').click()
      cy.get('[data-cy="input-new-password-field"]').click()
      cy.get('[data-cy="input-confirm-new-password-field"]').click()
      cy.get('[data-cy="password-required-message"]').should('contain.text', "New password is required")
    };
    const communicateLengthNeedsToBeValid = () => {
      cy.get('[data-cy="input-new-password-field"]').type("bad")
      cy.get('[data-cy="input-confirm-new-password-field"]').click()
      cy.get('[data-cy="password-too-short-message"]').should('contain.text', "New password must be at least 6 characters long")
    };
    const communicatePasswordsNeedToMatch = () => {
      cy.get('[data-cy="input-new-password-field"]').clear().type("valid-length-match1234_###")
      cy.get('[data-cy="input-confirm-new-password-field"]').clear().type("non-matching")
      cy.get('[data-cy="password-do-not-match-message"]').should('contain.text', "Passwords do not match")
    };
    const validateNoMessageRemainsWhenEverythingValid = () => {
      cy.get('[data-cy="input-new-password-field"]').clear().type("valid-length-match1234_###")
      cy.get('[data-cy="input-confirm-new-password-field"]').clear().type("valid-length-match1234_###")

      cy.get('[data-cy="password-required-message"]').should("not.exist")
      cy.get('[data-cy="password-too-short-message"]').should("not.exist")
      cy.get('[data-cy="password-do-not-match-message"]').should("not.exist")
    };

    communicatePasswordIsRequired();
    communicateLengthNeedsToBeValid();
    communicatePasswordsNeedToMatch();
    validateNoMessageRemainsWhenEverythingValid();
  });

  it('should correctly post password change request', () => {
    cy.intercept('POST', 'https://identitytoolkit.googleapis.com/v1/accounts:update*', {
      fixture: 'firebase-successful-update-password-response.json'
    }).as('updatePassword');

    cy.intercept('POST', 'https://identitytoolkit.googleapis.com/v1/accounts:lookup*', {
      fixture: 'firebase-successful-lookup-post-update-password-response.json'
    }).as('lookupAccount');

    cy.get('[data-cy="button-toggle-password-form"]').click()
    cy.get('[data-cy="input-new-password-field"]').type("new-password")
    cy.get('[data-cy="input-confirm-new-password-field"]').type("new-password")
    cy.get('[data-cy="update-password-button"]').click()

    cy.wait('@updatePassword').its('response.statusCode').should('eq', 200);
  });
})
