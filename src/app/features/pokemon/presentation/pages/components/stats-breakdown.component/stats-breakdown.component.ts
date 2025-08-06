import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PokemonStat} from '../../../../domain/model/PokemonDetails';

@Component({
  selector: 'app-stats-breakdown',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './stats-breakdown.html',
  styleUrl: './stats-breakdown.scss'
})
export class StatsBreakdownComponent {
  @Input() stats!: PokemonStat[];

  /**
   * The number of slices for the stat bars.
   * This value is set to 15 to match the official Pokédex segmented stats bar functionality.
   */
  readonly numberOfStatSlices: number = 15;

  /**
   * The maximum possible stat is assigned `255`, because as per my understanding && per mid-2025
   * the highest single stat value any pokémon has reached was this number.
   *
   * Said pokémon being "Blissey"
   *   - @see {@link http://localhost:4200/pokemon-details/242}
   *   - @see {@link https://www.pokemon.com/us/pokedex/blissey}
   */
  readonly maxStatValue: number = 255;

}
