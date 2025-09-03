/**
 * These interfaces represent parts of the API responses for:
 * https://pokeapi.co/api/v2/stat/1
 * https://pokeapi.co/api/v2/type/1
 * https://pokeapi.co/api/v2/ability/1
 */
export interface LocalizedNameResponseDto {
  name: string;
  names: LocalizedNameEntryDto[];
}

export interface LocalizedNameEntryDto {
  name: string;
  language: LocalizedNameLanguageDto;
}

export interface LocalizedNameLanguageDto {
  name: string;
  url: string;
}
