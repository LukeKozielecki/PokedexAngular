import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {PokeApiPokemonDataSource} from './features/pokemon/infrastructure/data-sources/PokeApiPokemonDataSource';
import {provideHttpClient} from '@angular/common/http';
import {POKEMON_REPOSITORY} from './features/pokemon/domain/model/PokemonRepository';

  export const appConfig: ApplicationConfig = {
    providers: [
      provideBrowserGlobalErrorListeners(),
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes),
      provideHttpClient(),
      { provide: POKEMON_REPOSITORY, useClass: PokeApiPokemonDataSource },
    ]
  };
