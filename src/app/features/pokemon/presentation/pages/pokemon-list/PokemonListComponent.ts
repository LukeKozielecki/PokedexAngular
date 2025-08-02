import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable} from 'rxjs';
import {Pokemon} from '../../../domain/model/Pokemon';
import {SearchFormComponent} from './SearchForm';
import {SearchPokemonUseCase} from '../../../application/use-cases/SearchPokemonUseCase';
import {PaginationButtonsComponent} from './PaginationButtonsComponent';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, SearchFormComponent, PaginationButtonsComponent],
  template: `
    <div class="pokemon-list-container p-4">
      <app-search-form (searchSubmitted)="onSearchSubmitted($event)"></app-search-form>

      <h2 class="text-3xl font-bold mb-4">Pokemon List</h2>
      @if (pokemonList$ | async; as pokemon) {
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          @for (p of pokemon; track p.id) {
            <div class="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
              <img [src]="p.imageUrl" [alt]="p.name" class="w-24 h-24 object-contain mb-2" width="96" height="96">
              <h3 class="text-xl font-semibold mb-1">{{ p.name | titlecase }}</h3>
              <p class="text-gray-600 text-sm">ID: {{ p.id }}</p>
              <p class="text-gray-700 text-sm">Types: {{ p.types.join(', ') | titlecase }}</p>
            </div>
          }
        </div>
        @if (pokemon.length === 0) {
          <div class="text-center text-lg text-gray-500 mt-8">No Pokemon found.</div>
        }
      } @else {
        <div class="text-center text-lg text-gray-500 mt-8">Loading Pokemon...</div>
      }
      <app-pagination-buttons
        [currentOffset]="currentOffset$ | async"
        (nextPage)="onNextPage()"
        (prevPage)="onPreviousPage()"
      ></app-pagination-buttons>
    </div>
  `,
})
export class PokemonListComponent implements OnInit {
  pokemonList$!: Observable<Pokemon[]>;
  currentOffset$!: Observable<number>;

  constructor(
    private searchPokemonUseCase: SearchPokemonUseCase
  ) {}

  ngOnInit(): void {
    this.pokemonList$ = this.searchPokemonUseCase.results$;
    this.currentOffset$ = this.searchPokemonUseCase.currentOffset$;
  }

  onSearchSubmitted(term: string): void {
    this.searchPokemonUseCase.search(term);
  }

  /**
   * Handles the click event for the "Next" pagination button.
   * Increments the offset by 50 using the use case.
   */
  onNextPage(): void {
    const currentOffset = this.searchPokemonUseCase.currentOffset$.getValue();
    this.searchPokemonUseCase.setOffset(currentOffset + 50);
  }

  /**
   * Handles the click event for the "Previous" pagination button.
   * Decrements the offset by 50, ensuring it doesn't go below 0.
   */
  onPreviousPage(): void {
    const currentOffset = this.searchPokemonUseCase.currentOffset$.getValue();
    this.searchPokemonUseCase.setOffset(Math.max(0, currentOffset - 50));
  }
}
