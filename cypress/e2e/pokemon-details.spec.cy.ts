import '../support/commands';

describe('pokemon-details-component', () => {

  beforeEach(() => {
    cy.setupMockPokemonList();

    cy.intercept('GET', 'https://pokeapi.co/api/v2/pokemon-species/2', {
      statusCode: 200,
      fixture: 'pokemon-species.json',
    }).as('getPokemonSpecies');

    cy.setupMockEvolutionChain()

    cy.visit('http://localhost:4200/pokemon-details/2');

  });

  describe('pokemon-details-page-rendering-tests', () => {
    it('should render the evolution chain indicator and evolved species', () => {
      cy.get('.evolution-indicator').should('exist').and('contain.text', '>');
      cy.get('.evolved-species-list').should('exist');
      cy.get('app-evolution-chain-species').should('have.length.at.least', 1);
    });

    it('should apply the "is-current" class to the current pokemon container', () => {
      cy.get('.pokemon-container.is-current').should('exist');
      cy.get('.pokemon-image-wrapper.is-current').should('exist');
    });

    it('should disable favorites button for initial unauthenticated user test state', () => {
      cy.get('[data-cy="favorite-button"]')
        .should('be.disabled')
        .and('have.class', 'disabled-button');
    });

    it("should enable favorites button for authenticated user", () => {
      cy.login();
      cy.url().should('include', '/pokemon');

      cy.visit('http://localhost:4200/pokemon-details/2');
      cy.get('[data-cy="favorite-button"]')
        .should('not.be.disabled');
    });
  })

  describe('navigation-tests', () => {
    it('should not navigate when clicking the current pokemon container', () => {
      cy.url().then((initialUrl) => {
        cy.get('.pokemon-container.is-current').click();
        cy.url().should('eq', initialUrl);
      });
    });

    it('should navigate back to the pokemon list page', () => {
      cy.get('#details-page-navigate-back-button').click();
      cy.url().should('eq', 'http://localhost:4200/pokemon');
    });

    it('should navigate via evolution to 1st pokemon and correctly update data', () => {
      cy.get('.pokemon-details').first().click();
      cy.url().should('eq', 'http://localhost:4200/pokemon-details/1');
      cy.get('.pokemon-name').should('contain.text', 'bulbasaur');
    });

    it('should navigate via evolution to 3rd pokemon and correctly update data', () => {
      cy.get('.pokemon-details').last().click();
      cy.url().should('eq', 'http://localhost:4200/pokemon-details/3');
      cy.get('.pokemon-name').should('contain.text', 'venusaur');
    });
  })

  describe('input-details-tests', () => {
    beforeEach(() => {
      cy.get('[data-cy="toggle-edit-mode-button"]').click()
    })

    const detailsToTest = [
      { name: 'height', value: '50' },
      { name: 'weight', value: '75' },
      { name: 'base-experience', value: '150' },
    ];

    detailsToTest.forEach((detail) => {
      it(`should change ${detail.name}`, () => {
        cy.get(`[data-cy="input-field-${detail.name}"]`).clear();
        cy.get(`[data-cy="input-field-${detail.name}"]`).type(detail.value);
        cy.get('[data-cy="toggle-edit-mode-button"]').click();
        cy.get(`[data-cy="details-${detail.name}-value"]`).should('contain.text', detail.value);
      });
    });
  });

  describe('input-stats-tests', () => {
    beforeEach(() => {
      cy.get('[data-cy="toggle-edit-mode-button"]').click()
    })

    const statsToTest = [
      { name: 'hp', value: '120' },
      { name: 'attack', value: '95' },
      { name: 'defense', value: '85' },
      { name: 'special-attack', value: '110' },
      { name: 'special-defense', value: '90' },
      { name: 'speed', value: '105' },
    ];

    statsToTest.forEach((stat) => {
      it(`should change ${stat.name}`, () => {
        cy.get(`[data-cy="input-field-${stat.name}"]`).clear();
        cy.get(`[data-cy="input-field-${stat.name}"]`).type(stat.value);
        cy.get('[data-cy="toggle-edit-mode-button"]').click();
        cy.get(`[data-cy="stats-${stat.name}-value"]`).should('contain.text', stat.value);
      });
    });

    it('should change a combination of stats', () => {
      const combinedStats = [
        { name: 'defense', value: '85' },
        { name: 'special-attack', value: '110' },
        { name: 'hp', value: '120' },
      ];

      combinedStats.forEach((stat) => {
        cy.get(`[data-cy="input-field-${stat.name}"]`).clear().type(stat.value);
      });

      cy.get('[data-cy="toggle-edit-mode-button"]').click();

      combinedStats.forEach((stat) => {
        cy.get(`[data-cy="stats-${stat.name}-value"]`).should('contain.text', stat.value);
      });
    });
  });
});
