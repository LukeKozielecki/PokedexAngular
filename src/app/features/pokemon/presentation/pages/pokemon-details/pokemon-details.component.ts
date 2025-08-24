import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, debounceTime, forkJoin, map, Observable, of, Subject, switchMap, takeUntil, tap} from 'rxjs';
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
import {AuthService} from '../../../../auth/services/auth.service';
import {PokemonFavoriteService} from '../../../../auth/services/pokemon-favorite.service';
import {PokemonDetailsDataService} from '../../../infrastructure/services/PokemonDetailsDataService';

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
  private destroy$ = new Subject<void>();
  private isFavoriteSubject = new BehaviorSubject<boolean>(false);
  private localPokemonDetails!: PokemonDetails;

  pokemonDetails$!: Observable<PokemonDetails>;
  pokemonEvolution$!: Observable<EvolutionChain>;
  equalTypePokemonList$!: Observable<Pokemon[]>;
  isLoggedIn$!: Observable<boolean>
  isFavorite$ = this.isFavoriteSubject.asObservable();
  currentUserUid: string | null = null;
  isLoading = true;
  isEditing = false

  @ViewChild(StatsBreakdownComponent) statsBreakdownComponent!: StatsBreakdownComponent;

  constructor(
    private route: ActivatedRoute,
    private pokemonDataSource: PokeApiPokemonDataSource,
    private searchPokemonUseCase: SearchPokemonUseCase,
    private router: Router,
    private scrollService: ScrollToTopService,
    private authService: AuthService,
    private favoriteService: PokemonFavoriteService,
    private pokemonDetailsDataService: PokemonDetailsDataService
  ) {}

  ngOnInit(): void {
    this.scrollService.requestScrollToTop();

    this.isLoggedIn$ = this.authService.isLoggedIn();

    this.authService.getCurrentUser().pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.currentUserUid = user ? user.uid : null;
      this.route.paramMap.pipe(
        map(params => +params.get('id')!),
        switchMap(id => {
          if (this.currentUserUid) {
            return this.favoriteService.isFavorite(this.currentUserUid, id);
          } else {
            return of(false);
          }
        }),
        takeUntil(this.destroy$)
      ).subscribe(isFav => this.isFavoriteSubject.next(isFav));
    });
    this.fetchPokemonDetails()
  }

  private fetchPokemonDetails(): void {
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
          details: this.pokemonDetailsDataService.getPokemonDetailsById(id),
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
        this.localPokemonDetails = pokemonDetails;
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

  onToggleFavorite(pokemon: PokemonDetails) {
    if (!this.currentUserUid) {
      console.log('User not logged in. Defaults favourite indicator to not toggled');
      return;
    }
    const currentStatus = this.isFavoriteSubject.getValue();

    this.isFavoriteSubject.next(!currentStatus);

    const toggleObservable = currentStatus
      ? this.favoriteService.removeFavorite(this.currentUserUid!, pokemon.id)
      : this.favoriteService.addFavorite(this.currentUserUid!, pokemon.id);

    toggleObservable.pipe(take(1)).subscribe({
      next: () => {
        console.log(`Pokemon ${currentStatus ? 'removed from' : 'added to'} favorites`);
      },
      error: (error) => {
        console.error(`Error toggling favorite status:`, error);
        this.isFavoriteSubject.next(currentStatus);
      }
    });
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
  }

  onSaveChanges(): void {
    if (this.statsBreakdownComponent) {
      const updatedStats = this.statsBreakdownComponent.getUpdatedStats();
      this.localPokemonDetails = {
        ...this.localPokemonDetails,
        stats: updatedStats
      };
    }

    this.pokemonDetailsDataService.updatePokemonDetails(this.localPokemonDetails);
    this.isEditing = false;
    this.fetchPokemonDetails()
  }

  onPokemonDetailChange<K extends keyof PokemonDetails>(property: K, value: PokemonDetails[K]): void {
    if (this.localPokemonDetails) {
      this.localPokemonDetails = {
        ...this.localPokemonDetails,
        [property]: value
      };
    }
  }
}
