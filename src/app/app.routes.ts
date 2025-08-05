import { Routes } from '@angular/router';
import {PokemonListComponent} from './features/pokemon/presentation/pages/pokemon-list/pokemon-list.component';
import {PokemonDetailsComponent} from './features/pokemon/presentation/pages/pokemon-details/pokemon-details.component';

export const routes: Routes = [
  { path: '', redirectTo: 'pokemon', pathMatch: 'full' },
  { path: 'pokemon', component: PokemonListComponent },
  { path: 'pokemon-details/:id', component: PokemonDetailsComponent }
];
