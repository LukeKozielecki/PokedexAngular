import { Injectable, Inject } from '@angular/core';
import {Observable, catchError, of, map} from 'rxjs';
import {POKEMON_REPOSITORY, PokemonRepository} from '../../domain/model/PokemonRepository';
import {Pokemon} from '../../domain/model/Pokemon';

@Injectable({
  providedIn: 'root'
})
export class SearchPokemonUseCase {
  constructor(@Inject(POKEMON_REPOSITORY) private pokemonRepository: PokemonRepository) {}

  execute(name: string): Observable<Pokemon[]> {
    if (!name || name.trim() === '') {
      return of([]);
    }
    return this.pokemonRepository.getPokemonByName(name).pipe(
      map(pokemon => [pokemon]),
      catchError(error => {
        console.error('Error searching Pokemon:', error);
        return of([]);
      })
    );
  }
}
