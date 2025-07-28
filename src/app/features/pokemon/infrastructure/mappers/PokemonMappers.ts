import {PokemonDetailDto, Sprites, Type} from '../dtos/PokemonDetailDto';
import {Pokemon} from '../../domain/model/Pokemon';

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

function getOfficialArtworkUrl(sprites: Sprites): string | null {
  if (sprites.other && sprites.other['official-artwork'] && sprites.other['official-artwork'].front_default) {
    return sprites.other['official-artwork'].front_default;
  }
  return null;
}
