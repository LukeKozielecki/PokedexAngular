import {Ability, PokemonDetailDto, Sprites, Stat, Type} from '../dtos/PokemonDetailDto';
import {Pokemon} from '../../domain/model/Pokemon';
import {PokemonDetails} from '../../domain/model/PokemonDetails';

export const mapPokemonDetailDtoToPokemon = (dto: PokemonDetailDto): Pokemon => {
  const imageUrl = getOfficialArtworkUrl(dto.sprites) || dto.sprites.front_default;

  return {
    id: dto.id,
    name: dto.name,
    imageUrl: imageUrl,
    types: dto.types.map((typeSlot: Type) => typeSlot.type.name),
    height: dto.height,
    weight: dto.weight,
    };
  };

export const mapPokemonDetailDtoToPokemonDetails = (
  dto: PokemonDetailDto,
  localizedNames: LocalizedNames
): PokemonDetails => {
  const imageUrl = getOfficialArtworkUrl(dto.sprites) || dto.sprites.front_default;

  return {
    id: dto.id,
    name: dto.name,
    imageUrl: imageUrl,
    types: dto.types.map((_, index) => localizedNames.types[index]),
    height: dto.height,
    weight: dto.weight,
    base_experience: dto.base_experience,
    abilities: dto.abilities.map((abilitySlot: Ability, index: number) => ({
      name: localizedNames.abilities[index],
      isHidden: abilitySlot.is_hidden,
    })),
    stats: dto.stats.map((statSlot: Stat, index: number) => ({
      name: localizedNames.stats[index],
      baseStat: statSlot.base_stat,
    })),
    speciesUrl: dto.species.url,
  };
};

function getOfficialArtworkUrl(sprites: Sprites): string | null {
  if (sprites.other && sprites.other['official-artwork'] && sprites.other['official-artwork'].front_default) {
    return sprites.other['official-artwork'].front_default;
  }
  return null;
}
