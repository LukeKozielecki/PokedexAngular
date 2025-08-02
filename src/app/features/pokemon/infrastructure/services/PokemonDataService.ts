import { Inject, Injectable } from '@angular/core';
import {Observable, BehaviorSubject, finalize, tap, filter} from 'rxjs';
import { POKEMON_REPOSITORY, PokemonRepository } from '../../domain/model/PokemonRepository';
import { Pokemon } from '../../domain/model/Pokemon';
import { shareReplay, take } from 'rxjs/operators';

/**
 * A data service that fetches and caches a list of all Pokémon.
 * It serves as a single source of truth for Pokémon data within the application,
 * preventing redundant API calls.
 */
@Injectable({
  providedIn: 'root'
})
export class PokemonDataService {

  // === Dependencies ===
  constructor(
      @Inject(POKEMON_REPOSITORY) private pokemonRepository: PokemonRepository
  ) {}

  // === Reactive State ===
  /**
   * Cache holder for the full Pokémon list.
   * `Null` until first load; then always emits an array.
   */
  private allPokemonCache$ = new BehaviorSubject<Pokemon[] | null>(null);

  /**
   * Tracks a fetch in progress, to prevent triggering multiple
   * simultaneous repository calls.
   */
  private loadingInProgress$?: Observable<Pokemon[]>;


  // === Exposed Methods ===
  /**
   * Returns the full list of Pokémon, using cache when available.
   * If `forceRefresh` is true, bypasses cache and fetches anew.
   * @param forceRefresh Optional. Default `false`.
   */
  public getAllPokemon(forceRefresh = false): Observable<Pokemon[]> {
    const cached$ = this.allPokemonCache$.asObservable().pipe(
        filter((list): list is Pokemon[] => !!list),
        take(1)
    );

    if (forceRefresh || !this.allPokemonCache$.getValue()) {
      return this.fetchAndCachePokemon();
    }

    return cached$;
  }

  // === Internal Details ===
  /**
   * Calls the repository, pushes the result into cache,
   * and shares the same in-flight Observable for any concurrent callers.
   */
  private fetchAndCachePokemon(): Observable<Pokemon[]> {
    if (!this.loadingInProgress$) {
      this.loadingInProgress$ = this.pokemonRepository
          .getPokemonList(0, 6000)
          .pipe(
              tap(list => this.allPokemonCache$.next(list)),
              shareReplay({ bufferSize: 1, refCount: true }),
              finalize(() => (this.loadingInProgress$ = undefined))
          );
    }

    return this.loadingInProgress$;
  }
}
