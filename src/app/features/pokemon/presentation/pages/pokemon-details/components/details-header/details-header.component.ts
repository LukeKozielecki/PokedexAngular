import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'details-page-header',
  imports: [CommonModule],
  templateUrl: './details-header.html',
  styleUrl: './details-header.scss'
})
export class PokemonDetailsHeader {
  @Input() imageUrl!: string;
  @Input() name!: string;
  @Input() id!: number;
}
