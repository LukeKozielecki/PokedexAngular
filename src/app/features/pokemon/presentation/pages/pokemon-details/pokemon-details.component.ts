import {Component, OnDestroy, OnInit} from '@angular/core';
import {debounceTime, forkJoin, map, Observable, of, Subject, switchMap, takeUntil, tap} from 'rxjs';
import {PokeApiPokemonDataSource} from '../../../infrastructure/data-sources/PokeApiPokemonDataSource';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
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
import {take} from 'rxjs/operators';
import {ScrollToTopService} from '../../../../../shared/services/scroll-to-top.service';
import {MatIconModule} from '@angular/material/icon'

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [
    CommonModule,
    LoadingScreenComponent,
    EvolutionChainSpeciesComponent,
    StatsBreakdownComponent,
    PokemonDetailsSummaryComponent,
    PokemonDetailsHeader,
    RouterLink,
    MatIconModule
  ],
  templateUrl: './pokemon-details.html',
  styleUrl: './pokemon-details.scss'
})
export class PokemonDetailsComponent implements OnInit, OnDestroy{
  pokemonDetails$!: Observable<PokemonDetails>;
  pokemonEvolution$!: Observable<EvolutionChain>;
  equalTypePokemonList$!: Observable<Pokemon[]>;
  isLoading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private pokemonDataSource: PokeApiPokemonDataSource,
    private searchPokemonUseCase: SearchPokemonUseCase,
    private router: Router,
    private scrollService: ScrollToTopService
  ) {}

  ngOnInit(): void {
    this.scrollService.requestScrollToTop();
    const pokemonId$ = this.route.paramMap.pipe(
      map(params => {
        const id = params.get('id');
        if (!id) {
          throw new Error('Pokemon ID not found in route parameters.');
        }
        return +id;
      })
    );

    pokemonId$.pipe(
      tap(() => this.isLoading = true),
      switchMap(id => {
        return forkJoin({
          details: this.pokemonDataSource.getPokemonDetailsById(id),
          species: this.pokemonDataSource.getPokemonSpeciesById(id)
        }).pipe(
          switchMap(({ details, species }) => {
            const evolutionChainUrl = species.evolution_chain.url;
            const evolutionChainId = parseInt(evolutionChainUrl.match(/\/(\d+)\/$/)![1], 10);

            this.searchPokemonUseCase.filterByTypes(details.types);

            return forkJoin({
              pokemonDetails: of(details),
              pokemonEvolution: this.pokemonDataSource.getEvolutionChainById(evolutionChainId),
              equalTypePokemonList: this.searchPokemonUseCase.randomizedTypedPokemonList$.pipe(take(1))
            });
          })
        );
      }),
      debounceTime(500),
      takeUntil(this.destroy$)
    ).subscribe({
      next: ({ pokemonDetails, pokemonEvolution, equalTypePokemonList }) => {
        this.pokemonDetails$ = of(pokemonDetails);
        this.pokemonEvolution$ = of(pokemonEvolution);
        this.equalTypePokemonList$ = of(equalTypePokemonList);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching Pokemon data', error);
        this.isLoading = false;
      }
    });
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
