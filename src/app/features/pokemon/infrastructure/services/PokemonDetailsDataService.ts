import {Inject, Injectable} from '@angular/core';
import {POKEMON_DETAILS_REPOSITORY, PokemonDetailsRepository} from '../../domain/model/PokemonDetailsRepository';
import {finalize, Observable, of, tap} from 'rxjs';
import {PokemonDetails} from '../../domain/model/PokemonDetails';
import {shareReplay} from 'rxjs/operators';

/**
 * A service for managing and providing Pokémon details.
 *
 * It connects to the Pokémon API and provides a local cache for single-session data persistence.
 * This allows for temporary changes to Pokémon details to be maintained during a user's session.
 *
 * @remarks The Pokémon API does not support POST requests, so a local cache is used for temporary,
 * single-session persistence of user-made changes.
 */
@Injectable({
  providedIn: 'root'
})
export class PokemonDetailsDataService {

  constructor(
    @Inject(POKEMON_DETAILS_REPOSITORY) private pokemonDetailsRepository : PokemonDetailsRepository
  ) {}

  // === Reactive State ===
  /**
   * Cache holder for detailed Pokémon data.
   */
  private pokemonDetailsCache = new Map<number, PokemonDetails>();

  /**
   * Tracks a fetch in progress for a specific Pokemon ID.
   * Prevents multiple simultaneous repository calls for the same ID.
   */
  private loadingInProgress = new Map<number, Observable<PokemonDetails>>();


  // === Exposed Methods ===
  /**
   * Retrieves the details for a specific Pokémon, using cache when available.
   * @param id The ID of the Pokémon to fetch.
   * @returns An Observable of the PokemonDetails object.
   */
  public getPokemonDetailsById(id: number): Observable<PokemonDetails> {
    const cachedDetails = this.pokemonDetailsCache.get(id);

    if (cachedDetails) {
      return of(cachedDetails);
    }

    // Check if a request for this ID is already in progress
    if (this.loadingInProgress.has(id)) {
      return this.loadingInProgress.get(id)!;
    }

    // No cache and no in-progress request, so fetch from the repository
    const request$ = this.pokemonDetailsRepository.getPokemonDetailsById(id).pipe(
      tap(details => this.pokemonDetailsCache.set(id, details)),
      shareReplay({ bufferSize: 1, refCount: true }),
      finalize(() => this.loadingInProgress.delete(id))
    );

    this.loadingInProgress.set(id, request$);

    return request$;
  }

  /**
   * Updates a PokemonDetails object in the in-memory cache.
   * @param pokemon The PokemonDetails object to update.
   */
  public updatePokemonDetails(pokemon: PokemonDetails): void {
    this.pokemonDetailsCache.set(pokemon.id, pokemon);
    console.log('Pokemon details updated:', pokemon);
  }
}
