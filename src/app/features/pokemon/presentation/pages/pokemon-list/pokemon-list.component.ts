import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable, Subject, withLatestFrom} from 'rxjs';
import {Pokemon} from '../../../domain/model/Pokemon';
import {SearchFormComponent} from './components/search-form/search-form.component';
import {SearchPokemonUseCase} from '../../../application/use-cases/SearchPokemonUseCase';
import {PaginationButtonsComponent} from './components/pagination-buttons/pagination-buttons.component';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {take} from 'rxjs/operators';
import {LoadingScreenComponent} from '../../../../../shared/components/loading-screen/loading-screen.component';
import {Router} from '@angular/router';
import {NAVIGATION_DELAY} from '../../../../../shared/constants/app.constants';
import {NO_POKEMON_ART} from '../../../../../shared/constants/sad-pikachu-ASCII';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, SearchFormComponent, PaginationButtonsComponent, LoadingScreenComponent],
  templateUrl: './pokemon-list.html',
  styleUrl: './pokemon-list.scss',
})
export class PokemonListComponent implements OnInit, OnDestroy {
  pokemonList$!: Observable<Pokemon[]>;
  currentOffset$!: Observable<number>;

  private destroy$ = new Subject<void>();

  public isInSearchState = false;
  public noPokemonArt = NO_POKEMON_ART;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private searchPokemonUseCase: SearchPokemonUseCase,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchPokemonUseCase.search("");
    this.searchPokemonUseCase.filterByTypes([]);
    this.pokemonList$ = this.searchPokemonUseCase.results$;
    this.currentOffset$ = this.searchPokemonUseCase.offset$;
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large
    ]).subscribe(result => {
      let newLimit: number;
      if (result.breakpoints[Breakpoints.XSmall]) {
        newLimit = 8;
      } else if (result.breakpoints[Breakpoints.Small]) {
        newLimit = 12;
      } else if (result.breakpoints[Breakpoints.Medium]) {
        newLimit = 12;
      } else if (result.breakpoints[Breakpoints.Large]) {
        newLimit = 16;
      } else {
        newLimit = 50;
      }
      this.searchPokemonUseCase.setLimit(newLimit);
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

  onSearchSubmitted(term: string): void {
    this.isInSearchState = !!term.trim();
    setTimeout(() => {
      this.searchPokemonUseCase.search(term);
    }, NAVIGATION_DELAY);
  }

  /**
   * Handles the click event for the "Next" pagination button.
   * Increments the offset by 50 using the use case.
   */
  onNextPage(): void {
    this.searchPokemonUseCase
      .offset$
      .pipe(take(1), withLatestFrom(this.searchPokemonUseCase.limit$))
      .subscribe(([offset, limit]) =>
        this.searchPokemonUseCase.setOffset(offset + limit)
      );
  }

  /**
   * Handles the click event for the "Previous" pagination button.
   * Decrements the offset by 50, ensuring it doesn't go below 0.
   */
  onPreviousPage(): void {
    this.searchPokemonUseCase
      .offset$
      .pipe(take(1), withLatestFrom(this.searchPokemonUseCase.limit$))
      .subscribe(([offset, limit]) =>
        this.searchPokemonUseCase.setOffset(Math.max(0, offset - limit))
      );
  }
}
