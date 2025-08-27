import {Injectable} from '@angular/core';
import {
  Observable,
  catchError,
  of,
  map,
  distinctUntilChanged,
  switchMap,
  BehaviorSubject,
  combineLatest,
  concatMap, tap, Subscription
} from 'rxjs';
import {Pokemon} from '../../domain/model/Pokemon';
import {PokemonDataService} from '../../infrastructure/services/PokemonDataService';
import {GetPokemonListUseCase} from './GetPokemonListUseCase';
import {PokemonFavoriteService} from '../../../auth/services/pokemon-favorite.service';
import {AuthService} from '../../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SearchPokemonUseCase {

  // === Dependencies ===
  constructor(
    private dataService: PokemonDataService,
    private getPokemonListUseCase: GetPokemonListUseCase,
    private favoriteService: PokemonFavoriteService,
    private authService: AuthService
  ) {
    this.results$ = combineLatest([
      this.searchTerm$.pipe(map(term => term.trim()), distinctUntilChanged()),
      this.filterTypes$,
      this.favoritesOnly$,
      this.authService.getCurrentUser().pipe(
        switchMap(user => user ? of(user.uid) : of(null))
      )
    ]).pipe(
      switchMap(([term, types, favoritesOnly, userId]) => {
        const isFiltered = term || types.length > 0 || favoritesOnly;

        if (isFiltered) {
          return this.applyFilters(term, types, favoritesOnly, userId)
        }

        this.initInfiniteScroll();
        return this.pokemonList$;
      })
    );
  }

  // === Reactive State ===
  private searchTerm$ = new BehaviorSubject<string>('');
  private _offset$ = new BehaviorSubject<number>(0);
  private _limit$ = new BehaviorSubject<number>(10);
  public offset$: BehaviorSubject<number> = this._offset$;
  public limit$: BehaviorSubject<number> = this._limit$;
  private filterTypes$ = new BehaviorSubject<string[]>([]);
  private favoritesOnly$ = new BehaviorSubject<boolean>(false);
  private pokemonList$ = new BehaviorSubject<Pokemon[]>([]);
  private infiniteScrollSubscription: Subscription | undefined;

  public results$: Observable<Pokemon[]>;

  public randomizedTypedPokemonList$: Observable<Pokemon[]> = this.filterTypes$.pipe(
    switchMap(types => {
      if (types.length === 0) {
        return of([]);
      }
      return this.dataService.getAllPokemon().pipe(
        map(allPokemon => this.applyTypesArrayFilters(allPokemon, types)),
        map(filteredPokemon => this.shuffleAndSlice(filteredPokemon, 5)),
        catchError(error => {
          console.error('Error fetching random typed Pokémon:', error);
          return of([]);
        })
      );
    })
  );

  // === Exposed Methods ===
  /**
   * Invoke this use case by passing in a search term.
   * Triggers the `results$` stream to emit matching Pokémon.
   * @param term The search string provided by the user.
   */
  public search(term: string): void {
    this.searchTerm$.next(term);
    this._offset$.next(0);
  }

  /**
   * Sets the filter to display Pokémon of the given type.
   * @param types An array of types to filter by.
   */
  public filterByTypes(types: string[]): void {
    this.filterTypes$.next(types);
  }

  /**
   * Toggles the favorites-only view via updating favoritesOnly$ state.
   * @param value - true to show favorites only, false to show all.
   */
  public setFavoritesOnly(value: boolean): void {
    this.favoritesOnly$.next(value);
  }

  /**
   * Updates the pagination offset.
   * Triggers the `results$` stream to emit Pokémon from the new offset.
   * @param newOffset The new starting index for the list.
   */
  public setOffset(newOffset: number): void {
    if (newOffset >= 0) {
      this._offset$.next(newOffset);
    }
  }

  /**
   * Updates the pagination limit.
   * Triggers the `results$` stream to emit Pokémon with the new limit.
   * @param newLimit The number of items to return in the list.
   */
  public setLimit(newLimit: number): void {
    if (newLimit > 0) {
      this._limit$.next(newLimit);
    }
  }

  // === Internal Details ===

  private applyFilters(
    term: string,
    types: string[],
    favoritesOnly: boolean,
    userId: string | null
  ): Observable<Pokemon[]> {
    if (this.infiniteScrollSubscription) {
      this.infiniteScrollSubscription.unsubscribe();
      this.infiniteScrollSubscription = undefined;
    }
    if (favoritesOnly && userId != null) {
      return this.getFavoritePokemon(userId, term, types);
    } else {
      return this.getFilteredPokemon(term, types);
    }
  }

  private initInfiniteScroll(): void {
    // Unsubscribe from any previous scroll.
    if (this.infiniteScrollSubscription) {
      this.infiniteScrollSubscription.unsubscribe();
    }

    // Reset the list and offset.
    this.pokemonList$.next([]);
    this._offset$.next(0);

    // Subscribe to offset/limit changes to fetch new pages.
    this.infiniteScrollSubscription = combineLatest([this._offset$, this._limit$]).pipe(
      concatMap(([offset, limit]) => this.getPokemonListUseCase.invoke(offset, limit)),
      tap(newPokemon => {
        const currentList = this.pokemonList$.getValue();
        this.pokemonList$.next([...currentList, ...newPokemon]);
      })
    ).subscribe();
  }

  private getFavoritePokemon(userId: string, term: string, types: string[]): Observable<Pokemon[]> {
    return this.favoriteService.getFavoritePokemonIds(userId).pipe(
      switchMap(favoriteIds => {
        // If the user has no favorite IDs, return an empty array.
        if (favoriteIds.length === 0) {
          return of([]);
        }
        return this.dataService.getPokemonByIds(favoriteIds);
      }),
      map(favoritePokemon => this.applyTermAndTypeFilters(favoritePokemon, term, types)),
      catchError(error => {
        console.error('Error fetching favorite Pokémon:', error);
        return of([]);
      })
    );
  }

  private getFilteredPokemon(term: string, types: string[]): Observable<Pokemon[]> {
    return this.dataService.getAllPokemon().pipe(
      map(allPokemon => this.applyTermAndTypeFilters(allPokemon, term, types))
    );
  }

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

  /**
   * Filters a list of Pokémon to find those with at least one matching type.
   * This function checks if any of the provided types exist within the Pokémon's types.
   *
   * @param pokemonList The array of all Pokémon to filter.
   * @param types The array of types to match against.
   * @returns A new array containing only the Pokémon that have at least one matching type.
   */
  private applyTypesArrayFilters(pokemonList: Pokemon[], types: string[]): Pokemon[] {
    return pokemonList.filter(pokemon =>
      types.some(type => pokemon.types.includes(type))
    );
  }

  /**
   * Filters a list of Pokémon first by a search term and then by a list of types.
   *
   * @param pokemonList The array of all Pokémon to filter.
   * @param term The search string to apply (matches against ID or name).
   * @param types The array of types to match against.
   * @returns A new array containing Pokémon that match both the search term and at least one of the provided types.
   */
  private applyTermAndTypeFilters(pokemonList: Pokemon[], term: string, types: string[]): Pokemon[] {
    const filteredByTerm = this.applyTermFilter(pokemonList, term);
    return types.length > 0 ? this.applyTypesArrayFilters(filteredByTerm, types) : filteredByTerm;
  }

  /**
   * Randomizes the order of a Pokémon list and returns a new list containing a specified number of items from the shuffled list.
   *
   * @param pokemonList The array of Pokémon to shuffle and slice.
   * @param count The number of Pokémon to return from the shuffled list.
   * @returns A new array containing a random selection of Pokémon.
   */
  private shuffleAndSlice(pokemonList: Pokemon[], count: number): Pokemon[] {
    const shuffled = [...pokemonList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}
