import { Routes } from '@angular/router';
import {PokemonListComponent} from './features/pokemon/presentation/pages/pokemon-list/pokemon-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'pokemon', pathMatch: 'full' },
  { path: 'pokemon', component: PokemonListComponent }
];
