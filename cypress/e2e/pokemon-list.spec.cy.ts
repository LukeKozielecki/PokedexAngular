import {
  FIREBASE_SUCCESSFUL_API_RESPONSE_MOCK,
  FIREBASE_SUCCESSFUL_LOGIN_MOCK, FIREBASE_USER_LOOKUP_API_RESPONSE_MOCK,
  MOCK_POKEMON_DETAILS,
  MOCK_POKEMON_LIST
} from '../support/mocks';
import {NAVIGATION_DELAY} from '../../src/app/shared/constants/app.constants';
import {of} from 'rxjs';
import {AuthService} from '../../src/app/features/auth/services/auth.service';

describe('pokemon-list-component', () => {
  beforeEach(() => {
    // Intercept the GET request to the Pokémon API endpoint
    cy.intercept('GET', 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=6000', {
      statusCode: 200,
      body: MOCK_POKEMON_LIST,
    }).as('getPokemonList');

    MOCK_POKEMON_DETAILS.results.forEach((pokemon, index) => {
      const alias = `getPokemonDetails${pokemon.name}`;
      const urlToIntercept = MOCK_POKEMON_LIST
        .results[index]
        .url
        .slice(0, -1); // this slice removes the slash at the end of "url": "https://pokeapi.co/api/v2/pokemon/1/"
      cy.intercept('GET', urlToIntercept, {
        statusCode: 200,
        body: pokemon,
      }).as(alias);
    });

    const lastPokemonName = MOCK_POKEMON_LIST.results[MOCK_POKEMON_LIST.results.length - 1].name;

    cy.visit('http://localhost:4200/');

    cy.wait('@getPokemonList');
    cy.wait(`@getPokemonDetails${lastPokemonName}`);
  });

  it('should display the mocked list of Pokémon', () => {
    MOCK_POKEMON_LIST.results.forEach(pokemon => {
      const caseInsensitiveName = new RegExp(pokemon.name, 'i');

      cy.contains(caseInsensitiveName).should('be.visible');
    });
  });

  it('should search for "charmander mocked" and display only that Pokémon', () => {
    const searchTerm = "charmander mocked"
    cy.get('#pokemon-search-input-form').click().type(searchTerm);

    cy.contains(searchTerm, { matchCase: false }).should('be.visible');

    const otherPokemon = MOCK_POKEMON_LIST.results.filter(
      (pokemon) => pokemon.name !== searchTerm
    );

    otherPokemon.forEach((pokemon) => {
      cy.contains(pokemon.name, { matchCase: false }).should('not.exist');
    });
  });

  it('should search for "non-existent-pokemon" and display only that Pokémon', () => {
    cy.get('#pokemon-search-input-form').click().type('non-existent-pokemon');

    cy.contains('No Pokémon Matched Your Search!', { matchCase: false }).should('be.visible');

    const otherPokemon = MOCK_POKEMON_LIST.results

    otherPokemon.forEach((pokemon) => {
      cy.contains(pokemon.name, { matchCase: false }).should('not.exist');
    });
  });


  it('should filter only fire pokemon when selecting type "fire"', () => {
    cy.get('#pokemon-type-selector').select('Fire');

    const firePokemon = MOCK_POKEMON_DETAILS.results.filter(
      (pokemon: any) => pokemon.types.some((type: any) => type.type.name === 'fire')
    );

    firePokemon.forEach((pokemon) => {
      cy.contains(pokemon.name, { matchCase: false }).should('be.visible');
    });

    const otherPokemon = MOCK_POKEMON_DETAILS.results.filter(
      (pokemon: any) => !pokemon.types.some((type: any) => type.type.name === 'fire')
    );

    otherPokemon.forEach((pokemon) => {
      cy.contains(pokemon.name, { matchCase: false }).should('not.exist');
    });
  });

  it('should filter with both phrase and type', () => {
    cy.get('#pokemon-search-input-form').type('mocked');
    cy.get('#pokemon-type-selector').select('water');

    const visiblePokemon = MOCK_POKEMON_DETAILS.results.filter(
      (pokemon: any) =>
        pokemon.name.includes('mocked') &&
        pokemon.types.some((type: any) => type.type.name === 'water')
    );

    visiblePokemon.forEach((pokemon) => {
      cy.contains(`${pokemon.name}`, { matchCase: false }).should('be.visible');
    });

    const notVisiblePokemon = MOCK_POKEMON_DETAILS.results.filter(
      (pokemon: any) =>
        !pokemon.name.includes('mocked') ||
        !pokemon.types.some((type: any) => type.type.name === 'water')
    );

    notVisiblePokemon.forEach((pokemon) => {
      cy.contains(`${pokemon.name}`, { matchCase: false }).should('not.exist');
    });
  });

  it('should navigate to "/pokemon-details/1" on click of the first Pokémon card', () => {
    cy.get('.pokemon-card-inner').first().click();
    cy.wait(NAVIGATION_DELAY)
    cy.url().should('include', '/pokemon-details/1');
  });

  it('should display pokemon id on hover on card', () => {
    const firstPokemon = MOCK_POKEMON_DETAILS.results[0];
    const pokemonName = firstPokemon.name;
    const pokemonId = firstPokemon.id;

    cy.contains(pokemonName, { matchCase: false }).trigger('mouseover');
    cy.contains(`#${pokemonId}`).should('be.visible');
  });

  it('should display the full list when search term is cleared', () => {
    const searchTerm = 'charmander';
    cy.get('#pokemon-search-input-form').type(searchTerm);

    cy.contains(searchTerm, { matchCase: false }).should('be.visible');
    cy.contains('bulbasaur mocked', { matchCase: false }).should('not.exist');

    cy.get('#pokemon-search-input-form').clear();

    MOCK_POKEMON_LIST.results.forEach((pokemon) => {
      cy.contains(pokemon.name, { matchCase: false }).should('be.visible');
    });
  });

  it.only('should mock a successful login and navigate to the pokemon list page', () => {
    const mockAuthService = new AuthService();
    const favouritesButtonId = '#pokemon-favourites-toggle'
    cy.intercept('POST', 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?*', {
      statusCode: 200,
      body: FIREBASE_SUCCESSFUL_API_RESPONSE_MOCK,
    }).as('loginRequest');

    cy.intercept('POST', 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?*', {
      statusCode: 200,
      body: FIREBASE_USER_LOOKUP_API_RESPONSE_MOCK,
    }).as('lookupRequest');

    cy.stub(mockAuthService, 'loginUser').returns(of(FIREBASE_SUCCESSFUL_LOGIN_MOCK));

    cy.get(favouritesButtonId).should('not.exist')

    cy.visit('http://localhost:4200/login');

    cy.get('#email').type('some-email@provider.example');
    cy.get('#password').type('correctPassword123');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/pokemon');
    cy.get(favouritesButtonId).should('be.visible')
  });
});
