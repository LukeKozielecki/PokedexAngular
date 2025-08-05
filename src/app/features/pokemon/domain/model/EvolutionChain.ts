export interface EvolutionChain {
  id: number;
  chain: EvolutionSpecies[];
}

export interface EvolutionSpecies {
  name: string;
  url: string;
  evolvesTo: EvolutionSpecies[];
}
