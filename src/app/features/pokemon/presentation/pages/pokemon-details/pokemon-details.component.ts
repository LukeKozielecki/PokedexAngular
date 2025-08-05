import {Component, OnInit} from '@angular/core';
import {map, Observable, switchMap} from 'rxjs';
import {PokeApiPokemonDataSource} from '../../../infrastructure/data-sources/PokeApiPokemonDataSource';
import {ActivatedRoute} from '@angular/router';
import {PokemonDetails} from '../../../domain/model/PokemonDetails';
import {CommonModule} from '@angular/common';
import {LoadingScreenComponent} from '../../../../../shared/components/loading-screen/loading-screen.component';
import {EvolutionChain} from '../../../domain/model/EvolutionChain';
import {EvolutionChainSpeciesComponent} from '../components/evolution-chain-species.component/evolution-chain-species.component';

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [CommonModule, LoadingScreenComponent, EvolutionChainSpeciesComponent],
  templateUrl: './pokemon-details.html',
  styleUrl: './pokemon-details.scss'
})
export class PokemonDetailsComponent implements OnInit {
  pokemonDetails$!: Observable<PokemonDetails>;
  pokemonEvolution$!: Observable<EvolutionChain>;

  constructor(
    private route: ActivatedRoute,
    private pokemonDataSource: PokeApiPokemonDataSource
  ) {}

  ngOnInit(): void {
    const pokemonId$ = this.route.paramMap.pipe(
      map(params => {
        const id = params.get('id');
        if (!id) {
          throw new Error('Pokemon ID not found in route parameters.');
        }
        return +id;
      })
    );
    this.pokemonDetails$ = pokemonId$.pipe(
      switchMap(id => this.pokemonDataSource.getPokemonDetailsById(id))
    );

    this.pokemonEvolution$ = pokemonId$.pipe(
      switchMap(id => this.pokemonDataSource.getPokemonSpeciesById(id)),
      switchMap(species => {
        const evolutionChainUrl = species.evolution_chain.url;
        const evolutionChainId = parseInt(evolutionChainUrl.match(/\/(\d+)\/$/)![1], 10);
        return this.pokemonDataSource.getEvolutionChainById(evolutionChainId);
      })
    );
  }
}
