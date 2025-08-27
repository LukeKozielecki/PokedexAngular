import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PokemonAbility} from '../../../../../domain/model/PokemonDetails';

@Component({
  selector: 'app-pokemon-details-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-details-summary.html',
  styleUrl: './pokemon-details-summary.scss'
})
export class PokemonDetailsSummaryComponent {
  @Input() types!: string[];
  @Input() height!: number;
  @Input() weight!: number;
  @Input() baseExperience!: number;
  @Input() abilities!: PokemonAbility[];
  @Input() isEditing = false;

  @Output() heightChange = new EventEmitter<number>();
  @Output() weightChange = new EventEmitter<number>();
  @Output() baseExperienceChange = new EventEmitter<number>();

  onHeightChange(event: Event) {
    this.heightChange.emit(Number((event.target as HTMLInputElement).value));
  }

  onWeightChange(event: Event) {
    this.weightChange.emit(Number((event.target as HTMLInputElement).value));
  }

  onBaseExperienceChange(event: Event) {
    this.baseExperienceChange.emit(Number((event.target as HTMLInputElement).value));
  }
}
