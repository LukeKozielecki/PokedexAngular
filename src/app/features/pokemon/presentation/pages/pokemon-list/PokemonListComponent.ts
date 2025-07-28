import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable} from 'rxjs';
import {Pokemon} from '../../../domain/model/Pokemon';
import {GetPokemonListUseCase} from '../../../application/use-cases/GetPokemonListUseCase';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="text-3xl font-bold mb-4">Pokemon List</h2>
    @if (pokemonList | async; as pokemon) {
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
    } @else {
      <div class="text-center text-lg text-gray-500 mt-8">Loading Pokemon...</div>
    }
  `,
})
export class PokemonListComponent implements OnInit {
  pokemonList!: Observable<Pokemon[]>;

  constructor(private getPokemonListUseCase: GetPokemonListUseCase) {}

  ngOnInit(): void {
    this.pokemonList = this.getPokemonListUseCase.execute(0, 50);
  }
}
