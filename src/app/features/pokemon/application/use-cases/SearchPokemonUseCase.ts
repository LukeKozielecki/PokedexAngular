import {Injectable} from '@angular/core';
import {Observable, catchError, of, map, distinctUntilChanged, switchMap, BehaviorSubject} from 'rxjs';
import {Pokemon} from '../../domain/model/Pokemon';
import {PokemonDataService} from '../../infrastructure/services/PokemonDataService';
import {GetPokemonListUseCase} from './GetPokemonListUseCase';

@Injectable({
  providedIn: 'root'
})
export class SearchPokemonUseCase {

  // === Dependencies ===
  constructor(
    private dataService: PokemonDataService,
    private getPokemonListUseCase: GetPokemonListUseCase
  ) {}

  // === Reactive State ===
  private searchTerm$ = new BehaviorSubject<string>('');

  public results$: Observable<Pokemon[]> = this.searchTerm$.pipe(
    map(term => term.trim()),
    distinctUntilChanged(),
    switchMap(term => term ? this.filterPokemon(term) : this.getDefaultPokemonList())
  );

  // === Exposed Methods ===
  /**
   * Invoke this use case by passing in a search term.
   * Triggers the `results$` stream to emit matching Pokémon.
   * @param term The search string provided by the user.
   */
  public search(term: string): void {
    this.searchTerm$.next(term);
  }

  // === Internal Details ===
  private getDefaultPokemonList(): Observable<Pokemon[]> {
    return this.getPokemonListUseCase.invoke(0, 50);
  }

  /**
   * Filters the complete list of Pokémon using the provided search term.
   * Determines whether the term is numeric or textual and filters accordingly.
   * Errors during the process are caught and logged, returning an empty array.
   * @param term The search string used for filtering Pokémon by ID or name.
   * @returns An Observable stream of Pokémon that match the search term.
   */
  private filterPokemon(term: string): Observable<Pokemon[]> {
    return this.dataService.getAllPokemon().pipe(
      map(allPokemon => this.applyTermFilter(allPokemon, term)),
      catchError(error => {
        console.error('Error searching/filtering Pokemon:', error);
        return of([]);
      })
    );
  }

  /**
   * Filters a list of Pokémon based on a search term.
   * Numeric terms are matched against Pokémon IDs, non-numeric terms against names.
   * @param pokemonList The complete array of Pokémon to filter.
   * @param term The search string to apply.
   * @returns A filtered array of Pokémon matching the search term.
   */
  private applyTermFilter(pokemonList: Pokemon[], term: string): Pokemon[] {
    const isNumeric = /^\d+$/.test(term);
    return isNumeric
      ? pokemonList.filter(pokemon => pokemon.id.toString().includes(term))
      : pokemonList.filter(pokemon => pokemon.name.toLowerCase().includes(term.toLowerCase()));
  }
}
