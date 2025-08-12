import { Injectable } from '@angular/core';
import { getDatabase, ref, get, set, remove, Database } from 'firebase/database';
import {catchError, from, map, Observable, of} from 'rxjs';
import {app} from '../../../firebaseConfig';

@Injectable({
  providedIn: 'root',
})
export class PokemonFavoriteService {
  private readonly db: Database;

  constructor() {
    this.db = getDatabase(app);
  }

  /**
   * Checks if a Pokémon is a favorite for a specific user.
   * @param {string} userId The ID of the user.
   * @param {number} pokemonId The ID of the Pokémon.
   * @returns {Observable<boolean>} An Observable that emits `true` if the Pokémon is a favorite, otherwise `false`.
   */
  isFavorite(userId: string, pokemonId: number): Observable<boolean> {
    const favoriteRef = ref(this.db, `users/${userId}/favorites/${pokemonId}`);
    return from(get(favoriteRef)).pipe(
      map(snapshot => snapshot.exists()),
      catchError(() => of(false))
    );
  }

  /**
   * Adds a Pokémon to a user's favorites.
   * @param {string} userId The ID of the user.
   * @param {number} pokemonId The ID of the Pokémon to add to favorites.
   * @returns {Observable<void>} An Observable that completes when the operation is finished.
   */
  addFavorite(userId: string, pokemonId: number): Observable<void> {
    const favoriteRef = ref(this.db, `users/${userId}/favorites/${pokemonId}`);
    return from(set(favoriteRef, true));
  }

  /**
   * Removes a Pokémon from a user's favorites.
   * @param {string} userId The ID of the user.
   * @param {number} pokemonId The ID of the Pokémon to remove from favorites.
   * @returns {Observable<void>} An Observable that completes when the operation is finished.
   */
  removeFavorite(userId: string, pokemonId: number): Observable<void> {
    const favoriteRef = ref(this.db, `users/${userId}/favorites/${pokemonId}`);
    return from(remove(favoriteRef));
  }

  /**
   * Retrieves an observable of a user's favorite Pokémon IDs from Firebase.
   * @param userId The ID of the user.
   * @returns An Observable of an array of Pokémon IDs.
   */
  getFavoritePokemonIds(userId: string): Observable<number[]> {
    const favoriteRef = ref(this.db, `users/${userId}/favorites`);
    return from(get(favoriteRef)).pipe(
      map(snapshot => {
        const favorites = snapshot.val();
        if (!favorites) {
          return [];
        }
        return Object.keys(favorites).map(id => +id);
      }),
      catchError(error => {
        console.error('Error fetching favorite Pokemon IDs:', error);
        return of([]);
      })
    );
  }
}
