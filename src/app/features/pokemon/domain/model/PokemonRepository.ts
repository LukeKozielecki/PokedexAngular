import {Pokemon} from './Pokemon';
import {Observable} from 'rxjs';
import {InjectionToken} from '@angular/core';

export interface PokemonRepository {
  getPokemonList(lang: string, offset?: number, limit?: number): Observable<Pokemon[]>;
  getPokemonById(id: number): Observable<Pokemon>;
  getPokemonByName(name: string): Observable<Pokemon>;
  getPokemonTypes(lang: string): Observable<string[]>;
}

export const POKEMON_REPOSITORY = new InjectionToken<PokemonRepository>('PokemonRepository');
