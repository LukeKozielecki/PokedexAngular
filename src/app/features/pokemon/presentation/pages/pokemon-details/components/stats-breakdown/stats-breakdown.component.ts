import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PokemonStat} from '../../../../../domain/model/PokemonDetails';

@Component({
  selector: 'app-stats-breakdown',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './stats-breakdown.html',
  styleUrl: './stats-breakdown.scss'
})
export class StatsBreakdownComponent implements OnChanges {
  @Input() stats!: PokemonStat[];
  @Input() isEditing = false;
  @Output() statsChange = new EventEmitter<PokemonStat[]>();

  /**
   * Stores local stats for purpose of emitting them down the line.
   *
   * It facilitates preventing erroneous emits of only single stat change.
   */
  public localStats: PokemonStat[] = [];

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stats'] && changes['stats'].currentValue) {
      this.localStats = JSON.parse(JSON.stringify(this.stats));
    }
  }

  /**
   * Handles the change event from an input field for a specific stat.
   * Updates the {@link localStats} array with the new value, ensuring it does not exceed the maximum allowed.
   * @param event The DOM change event from the input element.
   * @param statName The name of the stat being changed (e.g., 'hp', 'attack').
   */
  onStatChange(event: Event, statName: string) {
    const inputElement = event.target as HTMLInputElement;
    const newStatValue = Number(inputElement.value) > this.maxStatValue ? this.maxStatValue : Number(inputElement.value) ;

    this.localStats = this.localStats.map(stat =>
      stat.name === statName
        ? {...stat, baseStat: newStatValue}
        : stat
    );
  }

  /**
   * Returns the updated local copy of the stats to the parent component.
   * This method is called by the parent component via @ViewChild to retrieve the edited stats.
   * @returns An array of PokemonStat objects containing the locally updated stats.
   */
  getUpdatedStats(): PokemonStat[] {
    return this.localStats;
  }
}
