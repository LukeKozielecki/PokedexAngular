import {Component, Input} from '@angular/core';

@Component({
  selector: 'details-page-header',
  imports: [],
  templateUrl: './details-header.html',
  styleUrl: './details-header.scss'
})
export class PokemonDetailsHeader {
  @Input() imageUrl!: string;
  @Input() name!: string;
  @Input() id!: number;
}
