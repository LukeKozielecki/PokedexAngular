import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

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

}
