/**
 * This interface represents the API response for:
 *
 * https://pokeapi.co/api/v2/pokemon?offset=0&limit=20
 */
export interface PokemonListDto {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListResult[];
}

export interface PokemonListResult {
  name: string;
  url: string;
}
