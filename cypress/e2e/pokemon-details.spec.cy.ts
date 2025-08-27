import {cpMockPokemonDetailsInterface} from '../support/backend-response-testing.interface';

describe('pokemon-details-component', () => {
  const POKEMON_LIST_JSON = 'pokemon-list.json'
  const POKEMON_DETAILS_JSON = 'pokemon-details.json'

  beforeEach(() => {
    cy.intercept('GET', 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=6000', {
      statusCode: 200,
      fixture: POKEMON_LIST_JSON,
    }).as('getPokemonList');


    cy.fixture(POKEMON_LIST_JSON).then((pokemonList) => {
      cy.fixture(POKEMON_DETAILS_JSON).then((pokemonDetails) => {
        pokemonDetails.results.forEach((pokemon: cpMockPokemonDetailsInterface, index: number) => {
          const alias = `getPokemonDetails${pokemon.name}`;
          const urlToIntercept = pokemonList.results[index].url.slice(0, -1);
          cy.intercept('GET', urlToIntercept, {
            statusCode: 200,
            body: pokemon,
          }).as(alias);
        });
      });
    });

    cy.fixture('pokemon-evolution.json').then((data) => {
      data.results.forEach((evolutionChain) => {
        cy.intercept('GET', `https://pokeapi.co/api/v2/evolution-chain/${evolutionChain.id}`, {
          statusCode: 200,
          body: evolutionChain,
        }).as(`getEvolutionChain${evolutionChain.id}`);
      });
    });

    cy.intercept('GET', 'https://pokeapi.co/api/v2/pokemon-species/2', {
      statusCode: 200,
      fixture: 'pokemon-species.json',
    }).as('getPokemonSpecies');

    cy.visit('http://localhost:4200/pokemon-details/2');

  });

  it('should display a mocked pokemon details', () => {

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

  describe('input-details-tests', () => {
    beforeEach(() => {
      cy.get('[data-cy="toggle-edit-mode-button"]').click()
    })

    it('should change height', () => {
      cy.get('[data-cy="input-field-height"]').clear()
      cy.get('[data-cy="input-field-height"]').type('50')
      cy.get('[data-cy="toggle-edit-mode-button"]').click()
      cy.get('[data-cy="details-height-value"]').should('contain.text', '50')
    })

    it('should change weight', () => {
      cy.get('[data-cy="input-field-weight"]').clear();
      cy.get('[data-cy="input-field-weight"]').type('75');
      cy.get('[data-cy="toggle-edit-mode-button"]').click();
      cy.get('[data-cy="details-weight-value"]').should('contain.text', '75');
    });

    it('should change base experience', () => {
      cy.get('[data-cy="input-field-base-experience"]').clear();
      cy.get('[data-cy="input-field-base-experience"]').type('150');
      cy.get('[data-cy="toggle-edit-mode-button"]').click();
      cy.get('[data-cy="details-base-experience-value"]').should('contain.text', '150');
    });
  });

  describe.only('input-stats-tests', () => {
    beforeEach(() => {
      cy.get('[data-cy="toggle-edit-mode-button"]').click()
    })

    it('should change Hp', () => {
      cy.get('[data-cy="input-field-hp"]').clear();
      cy.get('[data-cy="input-field-hp"]').type('120');
      cy.get('[data-cy="toggle-edit-mode-button"]').click();
      cy.get('[data-cy="stats-hp-value"]').should('contain.text', '120');
    });

    it('should change Attack', () => {
      cy.get('[data-cy="input-field-attack"]').clear();
      cy.get('[data-cy="input-field-attack"]').type('95');
      cy.get('[data-cy="toggle-edit-mode-button"]').click();
      cy.get('[data-cy="stats-attack-value"]').should('contain.text', '95');
    });

    it('should change Defense', () => {
      cy.get('[data-cy="input-field-defense"]').clear();
      cy.get('[data-cy="input-field-defense"]').type('85');
      cy.get('[data-cy="toggle-edit-mode-button"]').click();
      cy.get('[data-cy="stats-defense-value"]').should('contain.text', '85');
    });

    it('should change Special-attack', () => {
      cy.get('[data-cy="input-field-special-attack"]').clear();
      cy.get('[data-cy="input-field-special-attack"]').type('110');
      cy.get('[data-cy="toggle-edit-mode-button"]').click();
      cy.get('[data-cy="stats-special-attack-value"]').should('contain.text', '110');
    });

    it('should change Special-defense', () => {
      cy.get('[data-cy="input-field-special-defense"]').clear();
      cy.get('[data-cy="input-field-special-defense"]').type('90');
      cy.get('[data-cy="toggle-edit-mode-button"]').click();
      cy.get('[data-cy="stats-special-defense-value"]').should('contain.text', '90');
    });

    it('should change Speed', () => {
      cy.get('[data-cy="input-field-speed"]').clear();
      cy.get('[data-cy="input-field-speed"]').type('105');
      cy.get('[data-cy="toggle-edit-mode-button"]').click();
      cy.get('[data-cy="stats-speed-value"]').should('contain.text', '105');
    });

    it.only('should change a combination of stats', () => {

      cy.get('[data-cy="input-field-defense"]').clear();
      cy.get('[data-cy="input-field-defense"]').type('85');
      cy.get('[data-cy="input-field-special-attack"]').clear();
      cy.get('[data-cy="input-field-special-attack"]').type('110');
      cy.get('[data-cy="input-field-hp"]').clear();
      cy.get('[data-cy="input-field-hp"]').type('120');

      cy.get('[data-cy="toggle-edit-mode-button"]').click();

      cy.get('[data-cy="stats-defense-value"]').should('contain.text', '85');
      cy.get('[data-cy="stats-special-attack-value"]').should('contain.text', '110');
      cy.get('[data-cy="stats-hp-value"]').should('contain.text', '120');
    });

  });
});
