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
