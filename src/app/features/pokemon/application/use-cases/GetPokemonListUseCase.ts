import {Injectable} from '@angular/core';
import {catchError, map, Observable, of} from 'rxjs';
import {Pokemon} from '../../domain/model/Pokemon';
import {PokemonDataService} from '../../infrastructure/services/PokemonDataService';

/**
 * A use case that retrieves a paginated list of Pokémon.
 * This class relies on the `PokemonDataService` to get the full list
 * and then slices it to return a paginated view.
 */
@Injectable({
  providedIn: 'root'
})
export class GetPokemonListUseCase {

  constructor(
    private dataService: PokemonDataService
  ) {}

  /**
   * @param offset The starting index for the list (defaults to 0).
   * @param limit The number of items to return in the list (defaults to 50).
   */
  invoke(offset: number = 0, limit: number = 50): Observable<Pokemon[]> {
    return this.dataService.getAllPokemon().pipe(
      map(allPokemon => {
        return allPokemon.slice(offset, offset + limit);
      }),
      catchError(error => {
        console.error('Error getting paginated Pokemon list:', error);
        return of([]);
      })
    );
  }
}
