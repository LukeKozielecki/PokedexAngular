import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable, Subject, takeUntil, withLatestFrom} from 'rxjs';
import {Pokemon} from '../../../domain/model/Pokemon';
import {SearchFormComponent} from './search-form.component';
import {SearchPokemonUseCase} from '../../../application/use-cases/SearchPokemonUseCase';
import {PaginationButtonsComponent} from './pagination-buttons.component';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {take} from 'rxjs/operators';
import {LoadingScreenComponent} from '../../../../../shared/components/loading-screen/loading-screen.component';
import {PokemonCompendiumHeaderComponent} from '../components/pokemon-compendium-header/pokemon-compendium-header.component';
import {ScrollToTopService} from '../../../../../shared/services/scroll-to-top.service';
import {Router} from '@angular/router';
import {NAVIGATION_DELAY} from '../../../../../shared/constants/app.constants';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, SearchFormComponent, PaginationButtonsComponent, LoadingScreenComponent, PokemonCompendiumHeaderComponent],
  templateUrl: './pokemon-list.html',
  styleUrl: './pokemon-list.scss',
})
export class PokemonListComponent implements OnInit, OnDestroy {
  pokemonList$!: Observable<Pokemon[]>;
  currentOffset$!: Observable<number>;
  isLoadingSignal = signal(true);

  private destroy$ = new Subject<void>();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private searchPokemonUseCase: SearchPokemonUseCase,
    private scrollService: ScrollToTopService,
    private router: Router
  ) {}

  ngOnInit(): void {
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

    this.scrollService.scrollToTopRequested$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
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
