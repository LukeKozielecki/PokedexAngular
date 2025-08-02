import {Injectable} from '@angular/core';
import {Observable, catchError, of, map, distinctUntilChanged, switchMap, BehaviorSubject, combineLatest} from 'rxjs';
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
  private offset$ = new BehaviorSubject<number>(0);
  private limit$ = new BehaviorSubject<number>(50);

  public results$: Observable<Pokemon[]> = combineLatest([
    this.searchTerm$.pipe(map(term => term.trim()), distinctUntilChanged()),
    this.offset$,
    this.limit$
  ]).pipe(
    switchMap(([term, offset, limit]) => {
      return term
        ? this.filterPokemon(term)
        : this.getDefaultPokemonList(offset, limit);
    })
  );

  public currentOffset$: BehaviorSubject<number> = this.offset$;

  // === Exposed Methods ===
  /**
   * Invoke this use case by passing in a search term.
   * Triggers the `results$` stream to emit matching Pokémon.
   * @param term The search string provided by the user.
   */
  public search(term: string): void {
    this.searchTerm$.next(term);
  }

  /**
   * Updates the pagination offset.
   * Triggers the `results$` stream to emit Pokémon from the new offset.
   * @param newOffset The new starting index for the list.
   */
  public setOffset(newOffset: number): void {
    if (newOffset >= 0) {
      this.offset$.next(newOffset);
    }
  }

  /**
   * Updates the pagination limit.
   * Triggers the `results$` stream to emit Pokémon with the new limit.
   * @param newLimit The number of items to return in the list.
   */
  public setLimit(newLimit: number): void {
    if (newLimit > 0) {
      this.limit$.next(newLimit);
    }
  }

  // === Internal Details ===
  /**
   * Retrieves a paginated list of Pokémon.
   * This is used when no search term is provided by the user.
   * @param offset The starting index for the list.
   * @param limit The number of items to return in the list.
   * @returns An Observable stream of the paginated Pokémon.
   */
  private getDefaultPokemonList(offset: number, limit: number): Observable<Pokemon[]> {
    return this.getPokemonListUseCase.invoke(offset, limit);
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
