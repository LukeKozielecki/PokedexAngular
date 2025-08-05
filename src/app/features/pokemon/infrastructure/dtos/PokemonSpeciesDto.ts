export interface PokemonSpeciesDto {
  id:                     number;
  name:                   string;
  order:                  number;
  gender_rate:            number;
  capture_rate:           number;
  base_happiness:         number;
  is_baby:                boolean;
  is_legendary:           boolean;
  is_mythical:            boolean;
  hatch_counter:          number;
  has_gender_differences: boolean;
  forms_switchable:       boolean;
  growth_rate:            Color;
  pokedex_numbers:        PokedexNumber[];
  egg_groups:             Color[];
  color:                  Color;
  shape:                  Color;
  evolves_from_species:   Color;
  evolution_chain:        EvolutionChain;
  habitat:                null;
  generation:             Color;
  names:                  Name[];
  flavor_text_entries:    FlavorTextEntry[];
  form_descriptions:      FormDescription[];
  genera:                 Genus[];
  varieties:              Variety[];
}

export interface Color {
  name: string;
  url:  string;
}

export interface EvolutionChain {
  url: string;
}

export interface FlavorTextEntry {
  flavor_text: string;
  language:    Color;
  version:     Color;
}

export interface FormDescription {
  description: string;
  language:    Color;
}

export interface Genus {
  genus:    string;
  language: Color;
}

export interface Name {
  name:     string;
  language: Color;
}

export interface PokedexNumber {
  entry_number: number;
  pokedex:      Color;
}

export interface Variety {
  is_default: boolean;
  pokemon:    Color;
}
