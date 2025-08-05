import {ChainDto, EvolutionChainDto} from '../dtos/EvolutionChainDto';
import {EvolutionChain, EvolutionSpecies} from '../../domain/model/EvolutionChain';

/**
 * Maps the {@link EvolutionChainDto} to the {@link EvolutionChain} domain model.
 * This function processes the nested `Chain` structure of the DTO
 * to create a simplified `EvolutionSpecies` array in the domain model.
 *
 * @param dto The raw {@link EvolutionChainDto} from the API.
 * @returns A simplified {@link EvolutionChain} domain model.
 */
export const mapEvolutionChainDtoToEvolutionChain = (dto: EvolutionChainDto): EvolutionChain => {
  console.log('Flattened Evolution Chain:', mapChainDtoToEvolutionSpecies(dto.chain));
  return {
    id: dto.id,
    chain: [mapChainDtoToEvolutionSpecies(dto.chain)],
  };
};

/**
 * A recursive function that maps the {@link ChainDto}, which is a property of {@link EvolutionChainDto},
 * to a new {@link EvolutionSpecies} structure. This new structure still maintains the hierarchical evolution chain
 * but in a format that is more convenient for the application's domain model.
 *
 * @param chain The `Chain` object from the {@link EvolutionChainDto}.
 * @returns A single {@link EvolutionSpecies} object representing the evolution chain from this point.
 */
const mapChainDtoToEvolutionSpecies = (chain: ChainDto): EvolutionSpecies => {
  const evolutionSpecies: EvolutionSpecies = {
    name: chain.species.name,
    url: chain.species.url,
    evolvesTo: [],
  };

  if (chain.evolves_to.length > 0) {
    evolutionSpecies.evolvesTo = chain.evolves_to.map(evolvedChain => {
      return mapChainDtoToEvolutionSpecies(evolvedChain);
    });
  }

  return evolutionSpecies;
};
