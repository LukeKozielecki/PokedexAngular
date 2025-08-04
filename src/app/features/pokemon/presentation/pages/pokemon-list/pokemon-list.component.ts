import {Component, OnInit, signal} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Observable, withLatestFrom} from 'rxjs';
import {Pokemon} from '../../../domain/model/Pokemon';
import {SearchFormComponent} from './search-form.component';
import {SearchPokemonUseCase} from '../../../application/use-cases/SearchPokemonUseCase';
import {PaginationButtonsComponent} from './pagination-buttons.component';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {take} from 'rxjs/operators';
import {LoadingScreenComponent} from '../../../../../shared/components/loading-screen/loading-screen.component';
import {PokemonCompendiumHeaderComponent} from '../components/pokemon-compendium-header/pokemon-compendium-header.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, SearchFormComponent, PaginationButtonsComponent, LoadingScreenComponent, PokemonCompendiumHeaderComponent],
  template: `
    <app-pokemon-compendium-header (scrolledToTopRequest)="onHeaderScrolledToTop()"/>
    <div class="pokemon-list-container p-4">
      <app-search-form (searchSubmitted)="onSearchSubmitted($event)"></app-search-form>
      @if (pokemonList$ | async; as pokemon) {
        <div class="grid grid-cols-1 angular-sm:grid-cols-2 angular-md:grid-cols-3 angular-lg:grid-cols-4 angular-xl:grid-cols-5 gap-4">
          @for (p of pokemon; track p.id) {
            <div class="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
              <img [src]="p.imageUrl" [alt]="p.name" class="w-24 h-24 object-contain mb-2" width="96" height="96">
              <h3 class="text-xl font-semibold mb-1">{{ p.name | titlecase }}</h3>
              <p class="text-gray-600 text-sm">ID: {{ p.id }}</p>
              <p class="text-gray-700 text-sm">Types: {{ p.types.join(', ') | titlecase }}</p>
            </div>
          }
          <app-pagination-buttons
            [currentOffset]="currentOffset$ | async"
            (nextPage)="onNextPage()"
            (prevPage)="onPreviousPage()"
          ></app-pagination-buttons>
        </div>
        @if (pokemon.length === 0) {
          <div class="text-center text-lg text-gray-500 mt-8">No Pokemon found.</div>
        }
      } @else {
        <app-loading-screen></app-loading-screen>
      }
    </div>
  `,
})
export class PokemonListComponent implements OnInit {
  pokemonList$!: Observable<Pokemon[]>;
  currentOffset$!: Observable<number>;
  isLoadingSignal = signal(true);

  constructor(
    private breakpointObserver: BreakpointObserver,
    private searchPokemonUseCase: SearchPokemonUseCase
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
  }

  onSearchSubmitted(term: string): void {
    this.searchPokemonUseCase.search(term);
  }

  onHeaderScrolledToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
