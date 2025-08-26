
export interface cpMockPokemonDetailsFixture {
  count: number;
  next: string | null;
  previous: string | null;
  results: cpMockPokemonDetailsInterface[];
}
export interface cpMockPokemonListObject {
  name: string;
  url: string;
}
export interface cpMockPokemonDetailsInterface {
  id: number;
  name: string;
  base_experience: number;
  abilities: cpMockAbilityObject[];
  stats: cpMockStatObject[];
  sprites: cpMockSpriteObject;
  types: cpMockTypeObject[];
  height: number;
  weight: number;
  species: {
    name: string;
    url: string;
  };
}
export interface cpMockAbilityObject {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}
export interface cpMockStatObject {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}
export interface cpMockSpriteObject {
  front_default: string;
  other: {
    'official-artwork': {
      front_default: string;
    };
  };
}
export interface cpMockTypeObject {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}
