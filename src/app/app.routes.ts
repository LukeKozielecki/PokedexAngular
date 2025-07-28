import { Routes } from '@angular/router';
import {PokemonListComponent} from './features/pokemon/presentation/pages/pokemon-list/PokemonListComponent';

export const routes: Routes = [
  { path: '', redirectTo: 'pokemon', pathMatch: 'full' },
  { path: 'pokemon', component: PokemonListComponent }
];
