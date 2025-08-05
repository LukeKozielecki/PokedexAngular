import {Component, Input, OnInit} from '@angular/core';
import {EvolutionSpecies} from '../../../../domain/model/EvolutionChain';
import {map, Observable} from 'rxjs';
import {Pokemon} from '../../../../domain/model/Pokemon';
import {PokemonDataService} from '../../../../infrastructure/services/PokemonDataService';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-evolution-chain-species',
  imports: [CommonModule],
  templateUrl: './evolution-chain-species.html',
  styleUrl: './evolution-chain-species.scss'
})
export class EvolutionChainSpeciesComponent implements OnInit {
  @Input({required: true}) species!: EvolutionSpecies;
  pokemon$!: Observable<Pokemon | undefined>;

  constructor(
    private dataService: PokemonDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.pokemon$ = this.dataService.getAllPokemon().pipe(
      map(allPokemon => allPokemon.find(pokemon => pokemon.name === this.species.name))
    );
  }

  onPokemonVariantClick(id: number | string) {
    this.router.navigate(['/pokemon-details', id])
  }
}
