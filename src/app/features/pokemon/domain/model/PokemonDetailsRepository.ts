import {PokemonDetails} from './PokemonDetails';
import {Observable} from 'rxjs';
import {InjectionToken} from '@angular/core';

export interface PokemonDetailsRepository {
  getPokemonDetailsById(id: number, lang: string): Observable<PokemonDetails>;
  getPokemonDetailsByName(name: string): Observable<PokemonDetails>;
}

export const POKEMON_DETAILS_REPOSITORY = new InjectionToken<PokemonDetailsRepository>('PokemonDetailsRepository');
