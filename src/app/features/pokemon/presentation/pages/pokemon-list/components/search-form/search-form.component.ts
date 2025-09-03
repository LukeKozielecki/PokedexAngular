import {Component, EventEmitter, Inject, OnDestroy, OnInit, Output} from '@angular/core';
import {CommonModule, DOCUMENT} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {debounceTime, distinctUntilChanged, Observable, Subject, Subscription, takeUntil, tap} from 'rxjs';
import {AuthService} from '../../../../../../auth/services/auth.service';
import {MatIconModule} from '@angular/material/icon';
import {LanguageSwitcher} from '../../../../../../../shared/components/language-switcher/language-switcher';
import {PokemonDataService} from '../../../../../infrastructure/services/PokemonDataService';
import {getCurrentLocale} from '../../../../../../../shared/utils/locale.utils';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, LanguageSwitcher],
  templateUrl: './search-form.html',
  styleUrl: './search-form.scss'
})
export class SearchFormComponent implements OnInit, OnDestroy {
  searchTerm: string = '';
  selectedType: string = '';
  isFavoritesOnly: boolean = false;
  isLoggedIn$!: Observable<boolean>;
  pokemonTypes: string[] = [];

  @Output() searchSubmitted = new EventEmitter<{ term: string; types: string[]; favoritesOnly: boolean }>();

  private searchTerms = new Subject<string>();
  private subscription!: Subscription;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private pokemonDataService: PokemonDataService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn();
    this.subscription = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.emitSearchPayload())
    ).subscribe();
    const currentLang = getCurrentLocale(this.document.location.pathname);
    this.pokemonDataService
      .getPokemonTypes(currentLang || 'en')
      .pipe(takeUntil(this.destroy$))
      .subscribe((types) => {
        this.pokemonTypes = types;
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSearchInput(): void {
    this.searchTerms.next(this.searchTerm);
  }

  onTypeSelected(): void {
    this.emitSearchPayload();
  }

  onToggleFavorites(): void {
    this.isFavoritesOnly = !this.isFavoritesOnly;
    this.emitSearchPayload();
  }

  private emitSearchPayload(): void {
    const typesToFilter = this.selectedType ? [this.selectedType] : [];
    this.searchSubmitted.emit({
      term: this.searchTerm.trim(),
      types: typesToFilter,
      favoritesOnly: this.isFavoritesOnly
    });
  }
}
