import {Injectable} from '@angular/core';
import {PokemonRepository} from '../../domain/model/PokemonRepository';
import {HttpClient} from '@angular/common/http';
import {forkJoin, map, Observable, switchMap} from 'rxjs';
import {Pokemon} from '../../domain/model/Pokemon';
import {PokemonDetailDto} from '../dtos/PokemonDetailDto';
import {mapPokemonDetailDtoToPokemon} from '../mappers/PokemonMappers';

@Injectable({
  providedIn: 'root'
})
export class PokeApiPokemonDataSource implements PokemonRepository {
  private readonly BASE_URL = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  getPokemonById(id: number): Observable<Pokemon> {
    return this.http.get<PokemonDetailDto>(`${this.BASE_URL}/pokemon/${id}`).pipe(
      map(mapPokemonDetailDtoToPokemon)
    );
  }

  getPokemonByName(name: string): Observable<Pokemon> {
    return this.http.get<PokemonDetailDto>(`${this.BASE_URL}/pokemon/${name.toLowerCase()}`).pipe(
      map(mapPokemonDetailDtoToPokemon)
    );
  }

  getPokemonList(offset: number = 0, limit: number = 20): Observable<Pokemon[]> {
    return this.http.get<any>(`${this.BASE_URL}/pokemon?offset=${offset}&limit=${limit}`).pipe(
      switchMap((response): Observable<Pokemon[]> => {
        const pokemonDetailsRequests : Pokemon[] = response.results.map((result: { name: string, url: string }) => {
          const idMatch = result.url.match(/\/(\d+)\/$/);
          const id = idMatch ? parseInt(idMatch[1], 10) : 0;
          return this.getPokemonById(id);
        });
        return forkJoin(pokemonDetailsRequests);
      })
    );
  }
}
