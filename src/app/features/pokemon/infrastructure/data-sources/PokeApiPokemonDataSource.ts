import {Injectable} from '@angular/core';
import {PokemonRepository} from '../../domain/model/PokemonRepository';
import {HttpClient} from '@angular/common/http';
import {forkJoin, map, Observable, of, switchMap} from 'rxjs';
import {Pokemon} from '../../domain/model/Pokemon';
import {PokemonDetailDto} from '../dtos/PokemonDetailDto';
import {mapPokemonDetailDtoToPokemon, mapPokemonDetailDtoToPokemonDetails} from '../mappers/PokemonMappers';
import {EvolutionChainDto} from '../dtos/EvolutionChainDto';
import {EvolutionChain} from '../../domain/model/EvolutionChain';
import {mapEvolutionChainDtoToEvolutionChain} from '../mappers/EvolutionChainMappers';
import {PokemonDetails} from '../../domain/model/PokemonDetails';
import {PokemonSpeciesDto} from '../dtos/PokemonSpeciesDto';
import {POKEMON_API_BASE_URL} from '../../../../shared/constants/app.constants';
import {PokemonDetailsRepository} from '../../domain/model/PokemonDetailsRepository';

@Injectable({
  providedIn: 'root'
})
export class PokeApiPokemonDataSource implements PokemonRepository, PokemonDetailsRepository {

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
  getPokemonDetailsById(id: number, lang: string = 'en'): Observable<PokemonDetails> {
    return this.auxGeneratePokemonDetails(id, lang)
  }

  getPokemonDetailsByName(name: string): Observable<PokemonDetails> {
    return this.auxGeneratePokemonDetails(name)
  }

  private auxGeneratePokemonDetails(id: number | string, lang: string = 'en') : Observable<PokemonDetails> {
    const pokemonDetailUrl = `${POKEMON_API_BASE_URL}/pokemon/${id}`;
    const getLocalizedName = (http: HttpClient, url: string, lang: string): Observable<string> => {
      return http.get<any>(url).pipe(
        map(data => {
          const localizedName = data.names.find((nameObj: any) => nameObj.language.name === lang);
          return localizedName ? localizedName.name : data.name;
        })
      );
    };

    return this.http.get<PokemonDetailDto>(pokemonDetailUrl).pipe(
      switchMap(dto => {
        // Create an array of observables for each translatable field
        const statNameObservables = dto.stats.map(statSlot =>
          getLocalizedName(this.http, statSlot.stat.url, lang)
        );
        const typeNameObservables = dto.types.map(typeSlot =>
          getLocalizedName(this.http, typeSlot.type.url, lang)
        );
        const abilityNameObservables = dto.abilities.map(abilitySlot =>
          getLocalizedName(this.http, abilitySlot.ability!.url, lang)
        );

        // Wait for all localized names to be fetched
        return forkJoin([
          of(dto),
          forkJoin(statNameObservables),
          forkJoin(typeNameObservables),
          forkJoin(abilityNameObservables)
        ]);
      }),
      map(([dto, localizedStatNames, localizedTypeNames, localizedAbilityNames]) => {
        // Map the DTO and the fetched localized names to the final model
        return mapPokemonDetailDtoToPokemonDetails(dto, {
          stats: localizedStatNames,
          types: localizedTypeNames,
          abilities: localizedAbilityNames,
        });
      })
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
