import { Routes } from '@angular/router';
import {PokemonListComponent} from './features/pokemon/presentation/pages/pokemon-list/pokemon-list.component';
import {PokemonDetailsComponent} from './features/pokemon/presentation/pages/pokemon-details/pokemon-details.component';
import {LoginForm} from './features/auth/presentation/login-form/login-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'pokemon', pathMatch: 'full' },
  { path: 'pokemon', component: PokemonListComponent },
  { path: 'pokemon-details/:id', component: PokemonDetailsComponent },
  { path: 'login', component: LoginForm }
];
