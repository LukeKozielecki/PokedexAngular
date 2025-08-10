import {Component, OnDestroy, OnInit} from '@angular/core';
import {map, Observable, Subject, switchMap} from 'rxjs';
import {PokeApiPokemonDataSource} from '../../../infrastructure/data-sources/PokeApiPokemonDataSource';
import {ActivatedRoute, Router} from '@angular/router';
import {PokemonDetails} from '../../../domain/model/PokemonDetails';
import {CommonModule} from '@angular/common';
import {LoadingScreenComponent} from '../../../../../shared/components/loading-screen/loading-screen.component';
import {EvolutionChain} from '../../../domain/model/EvolutionChain';
import {EvolutionChainSpeciesComponent} from './components/evolution-chain-species/evolution-chain-species.component';
import {StatsBreakdownComponent} from './components/stats-breakdown/stats-breakdown.component';
import {PokemonDetailsSummaryComponent} from './components/pokemon-details-summary/pokemon-details-summary.component';
import {PokemonDetailsHeader} from './components/details-header/details-header.component';
import {SearchPokemonUseCase} from '../../../application/use-cases/SearchPokemonUseCase';
import {Pokemon} from '../../../domain/model/Pokemon';
import {NAVIGATION_DELAY} from '../../../../../shared/constants/app.constants';

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [
    CommonModule,
    LoadingScreenComponent,
    EvolutionChainSpeciesComponent,
    StatsBreakdownComponent,
    PokemonDetailsSummaryComponent,
    PokemonDetailsHeader
  ],
  templateUrl: './pokemon-details.html',
  styleUrl: './pokemon-details.scss'
})
export class PokemonDetailsComponent implements OnInit, OnDestroy{
  pokemonDetails$!: Observable<PokemonDetails>;
  pokemonEvolution$!: Observable<EvolutionChain>;
  equalTypePokemonList$!: Observable<Pokemon[]>;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private pokemonDataSource: PokeApiPokemonDataSource,
    private searchPokemonUseCase: SearchPokemonUseCase,
    private router: Router
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

    this.equalTypePokemonList$ = this.pokemonDetails$.pipe(
      switchMap(pokemonDetails => {
        const types = pokemonDetails.types;
        this.searchPokemonUseCase.filterByTypes(types);
        return this.searchPokemonUseCase.randomizedTypedPokemonList$;
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPokemonCardClick(id: number | string) {
    setTimeout(() => {
      this.router.navigate(['/pokemon-details', id]);
    }, NAVIGATION_DELAY);
  }
}
