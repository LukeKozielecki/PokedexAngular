export interface PokemonTypeDto {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonTypeResult[];
}

export interface PokemonTypeResult {
  name: string;
  url: string;
}
