import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {EvolutionSpecies} from '../../../../../domain/model/EvolutionChain';
import {map, Observable} from 'rxjs';
import {Pokemon} from '../../../../../domain/model/Pokemon';
import {PokemonDataService} from '../../../../../infrastructure/services/PokemonDataService';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {NAVIGATION_DELAY} from '../../../../../../../shared/constants/app.constants';
import {PokemonDetails} from '../../../../../domain/model/PokemonDetails';

@Component({
  selector: 'app-evolution-chain-species',
  imports: [CommonModule],
  templateUrl: './evolution-chain-species.html',
  styleUrl: './evolution-chain-species.scss'
})
export class EvolutionChainSpeciesComponent implements OnChanges {
  @Input({required: true}) species!: EvolutionSpecies;
  @Input() pokemonDetails!: PokemonDetails
  pokemon$!: Observable<Pokemon | undefined>;

  constructor(
    private dataService: PokemonDataService,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['species']) {
      this.pokemon$ = this.dataService.getAllPokemon().pipe(
        map(allPokemon => allPokemon.find(pokemon => pokemon.name === this.species.name))
      );
    }
  }

  onPokemonVariantClick(id: number | string) {
    setTimeout(() => {
      this.router.navigate(['/pokemon-details', id])
    }, NAVIGATION_DELAY);
  }
}
