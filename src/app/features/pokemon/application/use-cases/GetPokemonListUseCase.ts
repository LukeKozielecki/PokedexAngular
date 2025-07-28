import {Inject, Injectable} from '@angular/core';
import {POKEMON_REPOSITORY, PokemonRepository} from '../../domain/model/PokemonRepository';
import {Observable} from 'rxjs';
import {Pokemon} from '../../domain/model/Pokemon';

@Injectable({
  providedIn: 'root'
})
export class GetPokemonListUseCase {
  constructor(@Inject(POKEMON_REPOSITORY) private pokemonRepository: PokemonRepository) {}

  execute(offset?: number, limit?: number): Observable<Pokemon[]> {
    return this.pokemonRepository.getPokemonList(offset, limit);
  }
}
