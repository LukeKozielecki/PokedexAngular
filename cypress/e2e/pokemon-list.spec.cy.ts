import {NAVIGATION_DELAY} from '../../src/app/shared/constants/app.constants';
import {of} from 'rxjs';
import {AuthService} from '../../src/app/features/auth/services/auth.service';

interface cpMockPokemonDetailsFixture {
  count: number;
  next: string | null;
  previous: string | null;
  results: cpMockPokemonDetailsInterface[];
}
interface cpMockPokemonListObject {
  name: string;
  url: string;
}
interface cpMockPokemonDetailsInterface {
  id: number;
  name: string;
  base_experience: number;
  abilities: cpMockAbilityObject[];
  stats: cpMockStatObject[];
  sprites: cpMockSpriteObject;
  types: cpMockTypeObject[];
  height: number;
  weight: number;
  species: {
    name: string;
    url: string;
  };
}
interface cpMockAbilityObject {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}
interface cpMockStatObject {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}
interface cpMockSpriteObject {
  front_default: string;
  other: {
    'official-artwork': {
      front_default: string;
    };
  };
}
interface cpMockTypeObject {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

describe('pokemon-list-component', () => {

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

      const lastPokemonName = pokemonList.results[pokemonList.results.length - 1].name;

      cy.visit('http://localhost:4200/');

      cy.wait('@getPokemonList');
      cy.wait(`@getPokemonDetails${lastPokemonName}`);
    });
  });

  it('should display the mocked list of Pokémon', () => {
    cy.fixture(POKEMON_LIST_JSON).then((pokemonList: any) => {
      pokemonList.results.forEach((pokemon: any) => {
        const caseInsensitiveName = new RegExp(pokemon.name, 'i');
        cy.contains(caseInsensitiveName).should('be.visible');
      });
    });
  });

  it('should search for "charmander mocked" and display only that Pokémon', () => {
    const searchTerm = "charmander mocked";
    cy.get('#pokemon-search-input-form').click().type(searchTerm);

    cy.fixture(POKEMON_LIST_JSON).then((pokemonList) => {
      cy.contains(searchTerm, { matchCase: false }).should('be.visible');

      const otherPokemon: { name: string, url: string }[] = pokemonList.results.filter(
        (pokemon: { name: string, url: string }) => pokemon.name !== searchTerm
      );

      otherPokemon.forEach((pokemon) => {
        cy.contains(pokemon.name, { matchCase: false }).should('not.exist');
      });
    });
  });

  it('should search for "non-existent-pokemon" and display only that Pokémon', () => {
    cy.get('#pokemon-search-input-form').click().type('non-existent-pokemon');

    cy.contains('No Pokémon Matched Your Search!', { matchCase: false }).should('be.visible');

    cy.fixture(POKEMON_LIST_JSON).then((pokemonList) => {
      const otherPokemon = pokemonList.results;

      otherPokemon.forEach((pokemon : cpMockPokemonListObject) => {
        cy.contains(pokemon.name, { matchCase: false }).should('not.exist');
      });
    });
  });


  it('should filter only fire pokemon when selecting type "fire"', () => {
    cy.get('#pokemon-type-selector').select('Fire');

    cy.fixture(POKEMON_DETAILS_JSON).then((pokemonDetails: cpMockPokemonDetailsFixture) => {
      const firePokemon = pokemonDetails.results.filter(
        (pokemon) => pokemon.types.some((type) => type.type.name === 'fire')
      );

      firePokemon.forEach((pokemon: cpMockPokemonDetailsInterface) => {
        cy.contains(pokemon.name, { matchCase: false }).should('be.visible');
      });

      const otherPokemon = pokemonDetails.results.filter(
        (pokemon) => !pokemon.types.some((type) => type.type.name === 'fire')
      );

      otherPokemon.forEach((pokemon: cpMockPokemonDetailsInterface) => {
        cy.contains(pokemon.name, { matchCase: false }).should('not.exist');
      });
    });
  });

  it('should filter with both phrase and type', () => {
    cy.get('#pokemon-search-input-form').type('mocked');
    cy.get('#pokemon-type-selector').select('water');

    cy.fixture(POKEMON_DETAILS_JSON).then((pokemonDetails: cpMockPokemonDetailsFixture) => {
      const visiblePokemon = pokemonDetails.results.filter(
        (pokemon) =>
          pokemon.name.includes('mocked') &&
          pokemon.types.some((type) => type.type.name === 'water')
      );

      visiblePokemon.forEach((pokemon: cpMockPokemonDetailsInterface) => {
        cy.contains(pokemon.name, { matchCase: false }).should('be.visible');
      });

      const notVisiblePokemon = pokemonDetails.results.filter(
        (pokemon) =>
          !pokemon.name.includes('mocked') ||
          !pokemon.types.some((type) => type.type.name === 'water')
      );

      notVisiblePokemon.forEach((pokemon) => {
        cy.contains(pokemon.name, { matchCase: false }).should('not.exist');
      });
    });
  });

  it('should navigate to "/pokemon-details/1" on click of the first Pokémon card', () => {
    cy.get('.pokemon-card-inner').first().click();
    cy.wait(NAVIGATION_DELAY)
    cy.url().should('include', '/pokemon-details/1');
  });

  it('should display pokemon id on hover on card', () => {
    cy.fixture(POKEMON_DETAILS_JSON).then((pokemonDetails) => {
      const firstPokemon = pokemonDetails.results[0];
      const pokemonName = firstPokemon.name;
      const pokemonId = firstPokemon.id;

      cy.contains(pokemonName, { matchCase: false }).trigger('mouseover');
      cy.contains(`#${pokemonId}`).should('be.visible');
    });
  });

  it('should display the full list when search term is cleared', () => {
    const searchTerm = 'charmander';
    cy.get('#pokemon-search-input-form').type(searchTerm);

    cy.contains(searchTerm, { matchCase: false }).should('be.visible');
    cy.contains('bulbasaur mocked', { matchCase: false }).should('not.exist');

    cy.get('#pokemon-search-input-form').clear();

    cy.fixture(POKEMON_LIST_JSON).then((pokemonList) => {
      pokemonList.results.forEach((pokemon: cpMockPokemonListObject) => {
        cy.contains(pokemon.name, { matchCase: false }).should('be.visible');
      });
    });
  });

  it('should mock a successful login and navigate to the pokemon list page', () => {
    const mockAuthService = new AuthService();
    const favouritesButtonId = '#pokemon-favourites-toggle'
    cy.intercept('POST', 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?*', {
      statusCode: 200,
      fixture: 'firebase-successful-login-response.json',
    }).as('loginRequest');

    cy.intercept('POST', 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?*', {
      statusCode: 200,
      fixture: 'firebase-successful-user-lookup-response.json',
    }).as('lookupRequest');

    cy.fixture('firebase-successful-user-data-response.json').then((userData) => {
      cy.stub(mockAuthService, 'loginUser').returns(of(userData));
    });

    cy.get(favouritesButtonId).should('not.exist')

    cy.visit('http://localhost:4200/login');

    cy.get('#email').type('some-email@provider.example');
    cy.get('#password').type('correctPassword123');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/pokemon');
    cy.get(favouritesButtonId).should('be.visible')
  });
});
