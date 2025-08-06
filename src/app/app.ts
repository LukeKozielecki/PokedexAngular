import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PokemonCompendiumHeaderComponent } from './features/pokemon/presentation/pages/components/pokemon-compendium-header/pokemon-compendium-header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PokemonCompendiumHeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('pokedex-v2-angular');
}
