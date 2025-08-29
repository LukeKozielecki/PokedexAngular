/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import {AuthService} from '../../src/app/features/auth/services/auth.service';
import {of} from 'rxjs';
import {cpMockPokemonDetailsInterface} from './backend-response-testing.interface';

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<any>;
      setupMockPokemonList(): Chainable<any>
    }
  }
}

Cypress.Commands.add('login', () => {
  const mockAuthService = new AuthService();
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

  cy.visit('http://localhost:4200/login');

  cy.get('#email').type('some-email@provider.example');
  cy.get('#password').type('correctPassword123');
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('setupMockPokemonList', () => {
  const POKEMON_LIST_JSON = 'pokemon-list.json'
  const POKEMON_DETAILS_JSON = 'pokemon-details.json'
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
