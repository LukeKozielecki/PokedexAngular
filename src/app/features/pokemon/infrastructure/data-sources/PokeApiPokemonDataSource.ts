import {Injectable} from '@angular/core';
import {PokemonRepository} from '../../domain/model/PokemonRepository';
import {HttpClient} from '@angular/common/http';
import {forkJoin, map, Observable, switchMap} from 'rxjs';
import {Pokemon} from '../../domain/model/Pokemon';
import {PokemonDetailDto} from '../dtos/PokemonDetailDto';
import {mapPokemonDetailDtoToPokemon, mapPokemonDetailDtoToPokemonDetails} from '../mappers/PokemonMappers';
import {EvolutionChainDto} from '../dtos/EvolutionChainDto';
import {EvolutionChain} from '../../domain/model/EvolutionChain';
import {mapEvolutionChainDtoToEvolutionChain} from '../mappers/EvolutionChainMappers';
import {PokemonDetails} from '../../domain/model/PokemonDetails';
import {PokemonSpeciesDto} from '../dtos/PokemonSpeciesDto';
import {POKEMON_API_BASE_URL} from '../../../../shared/constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class PokeApiPokemonDataSource implements PokemonRepository {

  constructor(private http: HttpClient) {}

  getPokemonById(id: number): Observable<Pokemon> {
    return this.http.get<PokemonDetailDto>(`${POKEMON_API_BASE_URL}/pokemon/${id}`).pipe(
      map(mapPokemonDetailDtoToPokemon)
    );
  }

  getPokemonByName(name: string): Observable<Pokemon> {
    return this.http.get<PokemonDetailDto>(`${POKEMON_API_BASE_URL}/pokemon/${name.toLowerCase()}`).pipe(
      map(mapPokemonDetailDtoToPokemon)
    );
  }

  getPokemonList(offset: number = 0, limit: number = 20): Observable<Pokemon[]> {
    return this.http.get<any>(`${POKEMON_API_BASE_URL}/pokemon?offset=${offset}&limit=${limit}`).pipe(
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

  getPokemonDetailsById(id: number): Observable<PokemonDetails> {
    return this.http.get<PokemonDetailDto>(`${POKEMON_API_BASE_URL}/pokemon/${id}`).pipe(
      map(mapPokemonDetailDtoToPokemonDetails)
    );
  }

  getPokemonDetailsByName(name: string): Observable<PokemonDetails> {
    return this.http.get<PokemonDetailDto>(`${POKEMON_API_BASE_URL}/pokemon/${name.toLowerCase()}`).pipe(
      map(mapPokemonDetailDtoToPokemonDetails)
    );
  }

  getPokemonSpeciesById(id: number): Observable<PokemonSpeciesDto> {
    return this.http.get<PokemonSpeciesDto>(`${POKEMON_API_BASE_URL}/pokemon-species/${id}`);
  }

  getEvolutionChainById(id: number): Observable<EvolutionChain> {
    return this.http.get<EvolutionChainDto>(`${POKEMON_API_BASE_URL}/evolution-chain/${id}`).pipe(
      map(mapEvolutionChainDtoToEvolutionChain)
    );
  }
}
