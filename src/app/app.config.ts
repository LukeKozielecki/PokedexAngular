import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {PokeApiPokemonDataSource} from './features/pokemon/infrastructure/data-sources/PokeApiPokemonDataSource';
import {provideHttpClient} from '@angular/common/http';
import {POKEMON_REPOSITORY} from './features/pokemon/domain/model/PokemonRepository';
import {POKEMON_DETAILS_REPOSITORY} from './features/pokemon/domain/model/PokemonDetailsRepository';

  export const appConfig: ApplicationConfig = {
    providers: [
      provideBrowserGlobalErrorListeners(),
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes),
      provideHttpClient(),
      { provide: POKEMON_REPOSITORY, useClass: PokeApiPokemonDataSource },
      { provide: POKEMON_DETAILS_REPOSITORY, useClass: PokeApiPokemonDataSource },
    ]
  };
