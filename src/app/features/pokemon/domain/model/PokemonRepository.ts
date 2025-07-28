import {Pokemon} from './Pokemon';
import {Observable} from 'rxjs';
import {InjectionToken} from '@angular/core';

export interface PokemonRepository {
  getPokemonList(offset?: number, limit?: number): Observable<Pokemon[]>;
  getPokemonById(id: number): Observable<Pokemon>;
  getPokemonByName(name: string): Observable<Pokemon>;
}

export const POKEMON_REPOSITORY = new InjectionToken<PokemonRepository>('PokemonRepository');
